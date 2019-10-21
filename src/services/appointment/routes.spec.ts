import express, { Router } from "express";
import request from "supertest";
import { applyMiddleware, applyRoutes } from "../../utils";
import middleware from "../../middleware";
import errorHandlers from "../../middleware/errorHandlers";
import routes from "./routes";
import * as env from "../../config/envConfig";
import { OrmConfiguration } from "../../utils/orm";
import { Appointment } from "../../entity/appointment";

describe("/appointment/:appointmentId", () => {
    let router: Router;

    beforeAll(async () => {
        if (!OrmConfiguration.hasBeenConfigured()) {
            await OrmConfiguration
                .ConfigureContainer(env.databaseConnName);
        }
    });

    beforeEach(async () => {
        router = express();

        applyMiddleware(middleware, router);
        applyRoutes(routes, router);
        applyMiddleware(errorHandlers, router);
    });

    test("appointment by id should return a not found response", async () => {
        return request(router)
            .get(`/api/v1/appointment/1`)
            .set('Accept', 'application/json')
            .expect(404);
    });
});

describe("/appointment/byemail/:email", () => {
    let router: Router;

    beforeAll(async () => {
        if (!OrmConfiguration.hasBeenConfigured()) {
            await OrmConfiguration
                .ConfigureContainer(env.databaseConnName);
        }
    });

    beforeEach(async () => {
        router = express();

        applyMiddleware(middleware, router);
        applyRoutes(routes, router);
        applyMiddleware(errorHandlers, router);
    });

    test("appointment by email missing email", async () => {
        request(router)
            .get("/api/v1/appointment/byemail/")
            .expect(400);
    });

    test("appointment by email should return an empty array", async () => {
        return request(router)
            .get(`/api/v1/appointment/byemail/nathan.gudritz@gmail.com`)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(response => {
                const emptyArray: Appointment[] = [];
                expect(response.body.length).toBe(emptyArray.length);
            })
    });
});

describe("/appointment/byphone/:phone", () => {
    let router: Router;

    beforeAll(async () => {
        if (!OrmConfiguration.hasBeenConfigured()) {
            await OrmConfiguration
                .ConfigureContainer(env.databaseConnName);
        }
    });

    beforeEach(async () => {
        router = express();

        applyMiddleware(middleware, router);
        applyRoutes(routes, router);
        applyMiddleware(errorHandlers, router);
    });

    test("appointment by phone missing phone", async () => {
        request(router)
            .get("/api/v1/appointment/byphone/")
            .expect(400);
    });
});

describe("/appointment/", () => {
    let router: Router;

    beforeAll(async () => {
        if (!OrmConfiguration.hasBeenConfigured()) {
            await OrmConfiguration
                .ConfigureContainer(env.databaseConnName);
        }
    });

    beforeEach(async () => {
        router = express();

        applyMiddleware(middleware, router);
        applyRoutes(routes, router);
        applyMiddleware(errorHandlers, router);
    });

    test("create appointment", async () => {
        return request(router)
            .post(`/api/v1/appointment/`)
            .send({
                "email": "nathan.gudritz@gmail.com",
                "phone": "2489218105"
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(201);
    });
});