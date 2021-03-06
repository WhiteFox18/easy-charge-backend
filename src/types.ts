import pgPromise from "pg-promise";
import { IClient } from "pg-promise/typescript/pg-subset";
import { ExtendedDatabase } from "./db";

export type DatabaseClient = pgPromise.IMain<{}, IClient>

export interface ServiceProps {
  db: ExtendedDatabase;
  pgp: DatabaseClient;
}

export type Lang = "ru" | "en" | "uz"

export type JwtTokenUserType = "admin" | "company_user"