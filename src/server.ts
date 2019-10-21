import "reflect-metadata";
import http from "http";
import express from "express";
import * as env from "./config/envConfig";
import { applyMiddleware, applyRoutes } from "./utils";
import middleware from "./middleware";
import errorHandlers from "./middleware/errorHandlers";
import routes from "./services";
import { OrmConfiguration } from "./utils/orm";

process.on("uncaughtException", e => {
    console.log(e); /*Eventually replace with a logging instance*/
    process.exit(1);
});

process.on("unhandledRejection", e => {
    console.log(e); /*Eventually replace with a logging instance*/
    process.exit(1);
});

console.log("Configuring orm...")
OrmConfiguration
    .ConfigureContainer(env.databaseConnName);

const router = express();
console.log("Applying middleware...");
applyMiddleware(middleware, router);
console.log("Applying routes...")
applyRoutes(routes, router);
console.log("Applying error handlers...");
applyMiddleware(errorHandlers, router);

const server = http.createServer(router);

console.log("Starting server...")
server.listen(env.port, () => {
    console.log(`Server is running http://localhost:${env.port}...`);
});