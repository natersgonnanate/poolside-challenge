import { Request, Response } from "express";
import { AvailabilityController } from "./availability.controller";
import { checkAvailabilityByDateRangeParams } from "../../middleware/checks";
import { Container } from "typedi";

console.log("Configuring availability routes");

export default [
    {
        path: "/api/v1/availability/byrange",
        method: "get",
        handler: [
            checkAvailabilityByDateRangeParams,
            async ({ query }: Request, res: Response) => {
                const result = await Container
                    .get(AvailabilityController)
                    .getAvailabilityByDateRange(new Date(query.startdate), new Date(query.enddate));
                res.status(200).send(result);
            }
        ]
    }
];
