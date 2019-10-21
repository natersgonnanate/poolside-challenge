import dotenv from "dotenv";

dotenv.config();

export const databaseConnName = process.env.DATABASE_CONN_NAME as string;
export const port = process.env.port as string;