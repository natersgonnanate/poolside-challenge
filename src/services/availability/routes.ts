import { Request, Response } from "express";
import { AvailabilityController } from "./availability.controller";
import { checkAvailabilityByDateRangeParams } from "../../middleware/checks";
import { Container } from "typedi";
import { Availability } from "../../entity/availability";

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
    },
    {
        path: "/api/v1/availability/:availabilityId",
        method: "get",
        handler: [
            async (request: Request, res: Response) => {
                const result = await Container
                    .get(AvailabilityController)
                    .getAvailabilityById(parseInt(request.params.availabilityId));

                if (result) {
                    res.status(200).send(result);
                } else {
                    res.status(404).send(`Availbility not found by availabilityId ${request.params.availabilityId}`);
                }
            }
        ]
    },
    {
        path: "/api/v1/availability/",
        method: "post",
        handler: [
            async (request: Request, res: Response) => {
                const result = await Container
                    .get(AvailabilityController)
                    .createAvailability(request.body as Availability)
                res.status(201).send(result);
            }
        ]
    },
    {
        path: "/api/v1/availability/",
        method: "put",
        handler: [
            async (request: Request, res: Response) => {
                const result = await Container
                    .get(AvailabilityController)
                    .updateAvailability(request.body as Availability)
                res.status(200).send(result);
            }
        ]
    }
];
