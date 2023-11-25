import geoip from 'geoip-lite';
import 'dotenv/config';

import { Session } from '../db/models.js';
import tokenService from "./token-service.js";

class SessionService {
    async saveSession(req, userTokenInfo, shouldCreateNotify = true) {
        try {
            const { accessToken, refreshToken } = tokenService.generateTokens({ ...userTokenInfo });
            const { id: userId } = userTokenInfo;
            const token = await tokenService.createToken(refreshToken);

            const sessionData = await this.findCurrentSession(req, userId);

            const { id: tokenId } = token;
            const currentDate = Date.now();
            const expiredDate = currentDate + 30 * 24 * 60 * 60 * 1000;
            let sessionId;

            if (sessionData) {
                tokenService.removeTokenById(sessionData.tokenId);

                await sessionData.update({
                    tokenId,
                    isActive: true,
                    date: currentDate,
                    expiredDate
                });

                sessionId = sessionData.id;
            } else {
                const newSession = await this.createSession(req, userId, true, tokenId, currentDate, expiredDate);

                sessionId = newSession.id;
            }

            return { accessToken, refreshToken, sessionId };
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    async findCurrentSession(req, userId) {
        const reqInfo = this.getReqInfo(req);
        const { ip, country, city, deviceType, browser, browserVersion, os, platform, isBot } = reqInfo;

        return await Session.findOne({
            where: {
                userId,
                ip,
                deviceType,
                country,
                city,
                browser,
                browserVersion,
                os,
                platform,
                isBot
            }
        });
    }

    async createSession(req, userId, isActive, tokenId, date, expiredDate) {
        const reqInfo = this.getReqInfo(req);
        const { ip, country, city, deviceType, browser, browserVersion, os, platform, isBot } = reqInfo;

        return await Session.create({
            userId,
            tokenId,
            isActive,
            date,
            expiredDate,
            ip,
            deviceType,
            country,
            city,
            browser,
            browserVersion,
            os,
            platform,
            isBot
        });
    }

    getReqInfo(req) {
        let { ip } = req;
        ip = ip.replace("::ffff:", "");
        const geoData = geoip.lookup(ip);
        const { country = null, city = null } = geoData || {};
        const { type: deviceType } = req.device;
        let { browser, version: browserVersion, os, platform, isBot } = req.useragent;
        browser = browser != 'unknown' ? browser : null;
        browserVersion = browserVersion != 'unknown' ? browserVersion : null;
        os = os != 'unknown' ? os : null;
        platform = platform != 'unknown' ? platform : null;
        isBot = isBot.toString();

        return { ip, country, city, deviceType, browser, browserVersion, os, platform, isBot };
    }

    async checkSession(req, userId, tokenId) {
        const currentSession = await this.findCurrentSession(req, userId);
        const { tokenId: currentSessionTokendId } = currentSession || {};

        if (!currentSession || currentSessionTokendId != tokenId) {
            const tokens = await this.saveSession(req, req.user, false);
            return tokens;
        }

        return null;
    }

    async endCurrentSession(req, userId) {
        try {
            const currentSession = await this.findCurrentSession(req, userId);

            if (currentSession) {
                const { tokenId } = currentSession;
                await currentSession.update({ isActive: false, tokenId: null });
                return await tokenService.removeTokenById(tokenId);
            }

            const currentDate = Date.now();
            return await this.createSession(req, userId, false, null, currentDate, currentDate);
        } catch (e) {
            console.log(e);
        }
    }
}

export default new SessionService();