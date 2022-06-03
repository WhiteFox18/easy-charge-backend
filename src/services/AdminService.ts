import { DatabaseClient, ServiceProps } from "../types";
import { ExtendedDatabase } from "../db";

export default class AdminService {
  private db: ExtendedDatabase = null;
  private pgp: DatabaseClient = null;

  constructor(props: ServiceProps) {
    this.db = props.db;
    this.pgp = props.pgp;
  }

  // TODO: login

  // TODO: get list admins

  // TODO: create admin_crm
  // TODO: update admin_crm
  // TODO: delete admin_crm
}