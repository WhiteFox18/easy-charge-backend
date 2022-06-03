import { DatabaseClient, ServiceProps } from "../types";
import { ExtendedDatabase } from "../db";

export default class CompanyUserService {
  private db: ExtendedDatabase = null;
  private pgp: DatabaseClient = null;

  constructor(props: ServiceProps) {
    this.db = props.db;
    this.pgp = props.pgp;
  }

  // TODO: login / company route

  // TODO get company user list by company by branch / admin_crm + company route

  // TODO: create company user / company super user route
  // TODO: update company user / company super user + related user route
  // TODO: delete company user / company super user admin_crm route
}