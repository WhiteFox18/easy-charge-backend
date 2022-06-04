import * as promise from "bluebird"; // best promise library today
import pgPromise, { ICTFObject, IDatabase, IFormattingOptions, QueryFile } from "pg-promise";
import dotenv from "dotenv";
import AdminService from "../services/AdminService";
import AdminModel from "../services/models/AdminModel";
import fs from "fs";
import path from "path";
import config from "../config";
import FuelTypesModel from "../services/models/FuelTypesModel";
import FuelTypesService from "../services/FuelTypesService";
import CompanyUserModel from "../services/models/CompanyUserModel";
import CompanyUserService from "../services/CompanyUserService";
import CompanyModel from "../services/models/CompanyModel";
import CompanyService from "../services/CompanyService";
import CompanyBranchService from "../services/CompanyBranchService";
import CompanyBranchModel from "../services/models/CompanyBranchModel";

dotenv.config();

interface IExtensions {
  admin: {
    query: typeof AdminModel,
    service: AdminService
  };
  fuelTypes: {
    query: typeof FuelTypesModel,
    service: FuelTypesService
  };
  companyUser: {
    query: typeof CompanyUserModel,
    service: CompanyUserService
  };
  company: {
    query: typeof CompanyModel,
    service: CompanyService
  };
  companyBranch: {
    query: typeof CompanyBranchModel,
    service: CompanyBranchService
  };
}

export type ExtendedDatabase = IDatabase<IExtensions> & IExtensions

const initOptions: any = {
  capSQL: true,
  // Using a custom promise library, instead of the default ES6 Promise:
  promiseLib: promise,

  // Extending the database protocol with our custom repositories;
  // API: http://vitaly-t.github.io/pg-promise/global.html#event:extend
  extend(db: ExtendedDatabase, dc: any) {
    // Database Context (dc) is mainly needed for extending multiple databases with different access API.

    // Do not use 'require()' here, because this event occurs for every task and transaction being executed,
    // which should be as fast as possible.
    //  TODO: Create repo classes that include only SQL queries as methods and extend obj with repos
    db.admin = {
      query: AdminModel,
      service: new AdminService({ db, pgp }),
    };

    db.fuelTypes = {
      query: FuelTypesModel,
      service: new FuelTypesService({ db, pgp }),
    };

    db.companyUser = {
      query: CompanyUserModel,
      service: new CompanyUserService({ db, pgp }),
    };

    db.company = {
      query: CompanyModel,
      service: new CompanyService({ db, pgp }),
    };

    db.companyBranch = {
      query: CompanyBranchModel,
      service: new CompanyBranchService({ db, pgp }),
    };
  },
};


const pgp = pgPromise(initOptions);

const connectionObject = {
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_NAME,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  port: Number(process.env.DATABASE_PORT),
};

const db: ExtendedDatabase = pgp(connectionObject);

// To write every query from pgp.as.format into the file
if (config.production !== true) {
  const oldFormat = pgp.as.format;
  pgp.as.format = (query: string | QueryFile | ICTFObject, values?: any, options?: IFormattingOptions): string => {
    const queryToReturn = oldFormat(query, values, options);

    let formatted = queryToReturn;

    formatted += "\n";
    formatted += "##############################";
    formatted += "\n";

    fs.writeFileSync(path.join(path.resolve(), "constants", "queries.txt"), formatted, {
      flag: "a",
    });

    return queryToReturn;
  };
}

export default db;
export { pgp };