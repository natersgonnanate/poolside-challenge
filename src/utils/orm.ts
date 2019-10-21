import "reflect-metadata";
import { useContainer, createConnection, getConnectionOptions } from "typeorm";
import { Container } from "typedi";
import * as env from "../config/envConfig";

export class OrmConfiguration {
    private static _hasBeenConfigured: boolean = false;

    public static async ConfigureContainer(connectionName: string = env.databaseConnName): Promise<boolean> {
        useContainer(Container);
        await createConnection(connectionName);
        this._hasBeenConfigured = true;
        return true;
    }

    public static hasBeenConfigured(): boolean {
        return this._hasBeenConfigured;
    }
};