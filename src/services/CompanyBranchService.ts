import { DatabaseClient, ServiceProps } from "../types";
import { ExtendedDatabase } from "../db";
import {
  CreateOneCompanyBranch,
  GetOne,
  ListCompanyBranches,
  ListCompanyBranchesForMobile,
  UpdateOneCompanyBranch,
} from "./types";
import { checkQueryResultNoData, paginate } from "../modules/helpers";
import Errors from "../modules/errors";

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
          await this.db.companyBranch.query.list(data),
        ),
      );
    } catch (e) {
      throw e;
    }
  };

  listMobile = async (data: ListCompanyBranchesForMobile) => {
    try {
      return paginate(
        await this.db.manyOrNone(
          await this.db.companyBranch.query.listMobile(data),
        ),
      );
    } catch (e) {
      throw e;
    }
  };

  // TODO: get list company branches for map | mobile route

  getOneForMobile = async (data: GetOne) => {
    try {
      return checkQueryResultNoData(
        await this.db.oneOrNone(
          await this.db.companyBranch.query.getOneForMobile(data),
        ),
      );
    } catch (e) {
      throw e;
    }
  };

  getOneForCompany = async (data: GetOne) => {
    try {
      return checkQueryResultNoData(
        await this.db.oneOrNone(
          await this.db.companyBranch.query.getOneForCompany(data),
        ),
      );
    } catch (e) {
      throw e;
    }
  };

  // TODO: create company branch / company super user route
  createOne = async (data: CreateOneCompanyBranch) => {
    try {
      const user = await this.db.one(
        await this.db.companyUser.query.getOneById(data.user_id),
      );

      if (!user.is_super)
        Errors.notAllowed();

      return await this.db.one(
        await this.db.companyBranch.query.createOne({
          ...data,
          company_id: user.company_id,
        }),
      );
    } catch (e) {
      throw e;
    }
  };
  // TODO: update company branch / company super user route
  updateOne = async (data: UpdateOneCompanyBranch) => {
    try {
      const user = await this.db.one(
        await this.db.companyUser.query.getOneByIdWithCompanyBranchInfo({
          id: data.user_id,
          branch_id: data.id,
        }),
      );

      if (!user.is_super || !user.branch_is_super)
        Errors.notAllowed();

      return await this.db.one(
        await this.db.companyBranch.query.updateOne(data),
      );
    } catch (e) {
      throw e;
    }
  };

  // TODO: delete company branch / company super user route
  deleteOne = async ({ user_id, branch_id }: { user_id: number, branch_id: number }) => {
    try {
      const user = await this.db.one(
        await this.db.companyUser.query.getOneById(user_id),
      );

      if (!user.is_super)
        Errors.notAllowed();

      return await this.db.one(
        await this.db.companyBranch.query.deleteOne(branch_id),
      );
    } catch (e) {
      throw e;
    }
  };
}