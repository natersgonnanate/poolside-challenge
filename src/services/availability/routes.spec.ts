import express, { Router } from "express";
import request from "supertest";
import { applyMiddleware, applyRoutes } from "../../utils";
import middleware from "../../middleware";
import errorHandlers from "../../middleware/errorHandlers";
import routes from "./routes";
import * as env from "../../config/envConfig";
import { OrmConfiguration } from "../../utils/orm";
import { Availability } from "../../entity/availability";

describe("route integrations", () => {
    let router: Router;

    beforeAll(async () => {
        await OrmConfiguration
            .ConfigureContainer(env.databaseConnName);
    });

    beforeEach(async () => {
        router = express();

        applyMiddleware(middleware, router);
        applyRoutes(routes, router);
        applyMiddleware(errorHandlers, router);
    });

    test("availability by range missing query string", async () => {
        const response = await request(router).get("/api/v1/availability/byrange/");
        expect(response.status).toEqual(400);
        expect(response.text).toEqual("Both the startdate and enddate parameters are required.");
    });

    test("availability by range missing start date from query string", async () => {
        request(router)
            .get("/api/v1/availability/byrange/?enddate=2019-01-02")
            .expect(400)
            .then(response => {
                expect(response.text).toEqual("Both the startdate and enddate parameters are required.");
            });
    });

    test("availability by range missing end date from query string", async () => {
        request(router)
            .get("/api/v1/availability/byrange/?startdate=2019-01-02")
            .expect(400);
    });

    test("availability by range end date same as start date", async () => {
        request(router)
            .get("/api/v1/availability/byrange/?startdate=2019-01-02&enddate=2019-01-02")
            .expect(400);
    });

    test("availability by range end date prior to start date", async () => {
        request(router)
            .get("/api/v1/availability/byrange/?startdate=2019-01-02&enddate=2019-01-01")
            .expect(400);
    });

    test("availability by range should return an empty array", async () => {
        return request(router)
            .get(`/api/v1/availability/byrange/?startdate=2019-12-31&enddate=2020-01-01`)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(response => {
                const emptyArray: Availability[] = [];
                expect(response.body.length).toBe(emptyArray.length);
            })
    });

    test("availability by id should return a not found response", async () => {
        return request(router)
            .get(`/api/v1/availability/1`)
            .set('Accept', 'application/json')
            .expect(404);
    });
});