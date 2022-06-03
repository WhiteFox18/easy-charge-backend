import { DatabaseClient, ServiceProps } from "../types";
import { ExtendedDatabase } from "../db";

export default class CompanyService {
  private db: ExtendedDatabase = null;
  private pgp: DatabaseClient = null;

  constructor(props: ServiceProps) {
    this.db = props.db;
    this.pgp = props.pgp;
  }

  // TODO: get list companies | admin_crm + mobile route

  // TODO: create company / admin_crm route
  // TODO: update company / admin_crm + company super user route
  // TODO: delete company / super admin_crm route

}