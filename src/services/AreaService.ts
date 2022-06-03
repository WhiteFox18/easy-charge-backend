import { ExtendedDatabase } from "../db";
import { DatabaseClient, ServiceProps } from "../types";

export default class AreaService {
  private db: ExtendedDatabase = null;
  private pgp: DatabaseClient = null;

  constructor(props: ServiceProps) {
    this.db = props.db;
    this.pgp = props.pgp;
  }

  // TODO: get list countries

  // TODO: get list states

  // TODO: get list cities

  // TODO: get list districts
}