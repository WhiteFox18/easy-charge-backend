import { DatabaseClient, Lang, ServiceProps } from "../types";
import { ExtendedDatabase } from "../db";
import { CompanyUser } from "./types";
import bcrypt from "bcrypt";
import Errors from "../modules/errors";
import { createUserJwtToken } from "../modules/helpers";

export default class CompanyUserService {
  private db: ExtendedDatabase = null;
  private pgp: DatabaseClient = null;

  constructor(props: ServiceProps) {
    this.db = props.db;
    this.pgp = props.pgp;
  }

  setToken = async ({ id, token }: { id: number; token: string }) => {
    try {
      await this.db.none(
        await this.db.companyUser.query.setToken({ id, token }),
      );
    } catch (e) {
      throw e;
    }
  };

  getCompanyUserCompanyAndWorkingBranches = async ({company_user_id, lang}: { company_user_id: number; lang: Lang }) => {
    try {
      return await this.db.one(
        await this.db.companyUser.query.getCompanyUserCompanyAndWorkingBranches({
          company_user_id, lang
        })
      )
    } catch (e) {
      throw e;
    }
  }

  // TODO: login / company route

  login = async ({ phone_number, password }: { phone_number: string, password: string }) => {
    try {
      const company_user: CompanyUser = await this.db.oneOrNone(
        await this.db.companyUser.query.getOneByPhoneNumber(phone_number),
      );

      if (!company_user || !(await bcrypt.compare(password, company_user.password)))
        Errors.login();

      const token = await createUserJwtToken({
        user_id: company_user.id,
        is_super: company_user.is_super,
        working_branches: company_user.working_branches,
        type: "company_user",
      });

      const company_user_info = await this.getCompanyUserCompanyAndWorkingBranches({
        company_user_id: company_user.id,
        lang: "en"
      })

      return {
        token: token,
        user: {
          id: company_user.id,
          name: company_user.name,
          surname: company_user.surname,
          patronymic: company_user.patronymic,
          is_super: company_user.is_super,
          image: company_user.image,
          passport: company_user.passport,
          phone_number: company_user.phone_number
        },
        company: company_user_info.company,
        working_branches: company_user_info.working_branches
      }
    } catch (e) {
      throw e;
    }
  };

  logout = async (company_user_id: number) => {
    try {
      await this.db.none(
        await this.db.companyUser.query.deleteToken(company_user_id)
      )

      return {
        message: "success"
      }
    } catch (e) {
      throw e
    }
  }

  // TODO get company user list by company by branch / admin_crm + company route

  // TODO: create company user / company super user route
  // TODO: update company user / company super user + related user route
  // TODO: delete company user / company super user admin_crm route
}