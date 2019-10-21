import { Router } from "express";
import swaggerUi from "swagger-ui-express";
import openApiDocument from "../config/openapi.json";

export const handleAPIDocs = (router: Router) =>
    router.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));