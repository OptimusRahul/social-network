import * as express from 'express';

class App {
    public express: express.Application;

    constructor(){
        this.express = express.default();
        this.mountRoutes();
    }

    private mountRoutes(): void {
        const router = express.Router();
        router.get('/', (request: express.Request, response: express.Response) => {
            response.json({
                message: 'Hello World!'
            });
        });
        this.express.use('/', router);
    }
}

export default new App().express;