import { Request, Response, NextFunction } from "express";
import { HTTP400Error } from "../utils/httpErrors";

export const checkAvailabilityByDateRangeParams = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.query.startdate
        || !req.query.enddate) {
        throw new HTTP400Error("Both the startdate and enddate parameters are required.");
    } else {
        next();
    }
};