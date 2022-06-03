import { DatabaseClient, ServiceProps } from "../types";
import { ExtendedDatabase } from "../db";

export default class CompanyBranchService {
  private db: ExtendedDatabase = null;
  private pgp: DatabaseClient = null;

  constructor(props: ServiceProps) {
    this.db = props.db;
    this.pgp = props.pgp;
  }

  // TODO: get list company branches | admin_crm + company route

  // TODO: get list company branches for map | mobile route

  // TODO: create company branch / company super user route
  // TODO: update company branch / company super user route
  // TODO: delete company branch / company super user route
}