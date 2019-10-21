import { Request, Response } from "express";
import { AppointmentController } from "./appointment.controller";
import { Container } from "typedi";
import { Appointment } from "../../entity/appointment";

console.log("Configuring appointment routes");

export default [
    {
        path: "/api/v1/appointment/byemail/:email",
        method: "get",
        handler: [
            async (req: Request, res: Response) => {
                const result = await Container
                    .get(AppointmentController)
                    .getAppointmentByEmailOrPhone(req.params.email);
                res.status(200).send(result);
            }
        ]
    },
    {
        path: "/api/v1/appointment/byphone/:phone",
        method: "get",
        handler: [
            async (req: Request, res: Response) => {
                const result = await Container
                    .get(AppointmentController)
                    .getAppointmentByEmailOrPhone(req.params.phone);
                res.status(200).send(result);
            }
        ]
    },
    {
        path: "/api/v1/appointment/:appointmentId",
        method: "get",
        handler: [
            async (request: Request, res: Response) => {
                const result = await Container
                    .get(AppointmentController)
                    .getAppointmentById(parseInt(request.params.appointmentId));

                if (result) {
                    res.status(200).send(result);
                } else {
                    res.status(404).send(`Appointment not found by appointmentId ${request.params.appointmentId}`);
                }
            }
        ]
    },
    {
        path: "/api/v1/appointment/",
        method: "post",
        handler: [
            async (request: Request, res: Response) => {
                const result = await Container
                    .get(AppointmentController)
                    .createAppointment(request.body as Appointment)
                res.status(201).send(result);
            }
        ]
    },
    {
        path: "/api/v1/appointment/",
        method: "put",
        handler: [
            async (request: Request, res: Response) => {
                const result = await Container
                    .get(AppointmentController)
                    .updateAppointment(request.body as Appointment)
                res.status(200).send(result);
            }
        ]
    }
];
