class HealthController {
    async checkHealth(req, res, next) {
        try {
            res.send(200);
        } catch (error) {
            next(error);
        }
    }
}

export default new HealthController();