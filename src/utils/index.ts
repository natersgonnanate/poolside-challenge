import { Router, Request, Response, NextFunction } from "express";
import cors = require('cors');

type Wrapper = ((router: Router) => void);

export const applyMiddleware = (
    middleware: Wrapper[],
    router: Router
) => {
    for (const f of middleware) {
        f(router);
    }
};

type Handler = (
    req: Request,
    res: Response,
    next: NextFunction
) => Promise<void> | void;

type Route = {
    path: string;
    method: string;
    handler: Handler | Handler[];
};

export const applyRoutes = (routes: Route[], router: Router) => {
    //options for cors midddleware
    const options: cors.CorsOptions = {
        allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "X-Access-Token"],
        credentials: true,
        methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
        origin: "http://localhost:4200",
        preflightContinue: false
    };

    //use cors middleware
    router.use(cors(options));

    for (const route of routes) {
        const { method, path, handler } = route;
        (router as any)[method](path, handler);
    }
};
