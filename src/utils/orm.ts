import "reflect-metadata";
import { useContainer, createConnection, getConnectionOptions } from "typeorm";
import { Container } from "typedi";
import * as env from "../config/envConfig";
import { Availability } from "../entity/availability";

export class OrmConfiguration {
    public static async ConfigureContainer(connectionName: string = env.databaseConnName): Promise<boolean> {
        useContainer(Container);
        await createConnection(connectionName);
        return true;
    }
};