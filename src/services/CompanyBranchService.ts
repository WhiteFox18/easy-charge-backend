import { DatabaseClient, ServiceProps } from "../types";
import { ExtendedDatabase } from "../db";
import { GetOne, ListCompanyBranches } from "./types";
import { checkQueryResultNoData, paginate } from "../modules/helpers";

export default class CompanyBranchService {
  private db: ExtendedDatabase = null;
  private pgp: DatabaseClient = null;

  constructor(props: ServiceProps) {
    this.db = props.db;
    this.pgp = props.pgp;
  }

  // TODO: get list company branches | admin_crm + company route

  list = async (data: ListCompanyBranches) => {
    try {
      return paginate(
        await this.db.manyOrNone(
          await this.db.companyBranch.query.list(data)
        )
      )
    } catch (e) {
      throw e;
    }
  }

  // TODO: get list company branches for map | mobile route

  getOneForMobile = async (data: GetOne) => {
    try {
      return checkQueryResultNoData(
        await this.db.oneOrNone(
          await this.db.companyBranch.query.getOneForMobile(data)
        )
      )
    } catch (e) {
      throw e;
    }
  }

  getOneForCompany = async (data: GetOne) => {
    try {
      return checkQueryResultNoData(
        await this.db.oneOrNone(
          await this.db.companyBranch.query.getOneForCompany(data)
        )
      )
    } catch (e) {
      throw e;
    }
  }

  // TODO: create company branch / company super user route
  // TODO: update company branch / company super user route
  // TODO: delete company branch / company super user route
}