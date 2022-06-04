import { DatabaseClient, ServiceProps } from "../types";
import { ExtendedDatabase } from "../db";
import { CreateOneCompany, List } from "./types";
import { checkQueryResultNoData, hashPassword, paginate } from "../modules/helpers";

export default class CompanyService {
  private db: ExtendedDatabase = null;
  private pgp: DatabaseClient = null;

  constructor(props: ServiceProps) {
    this.db = props.db;
    this.pgp = props.pgp;
  }

  // TODO: get list companies | admin_crm + mobile route
  list = async (data: List) => {
    try {
      return paginate(
        await this.db.manyOrNone(
          await this.db.company.query.list(data)
        )
      )
    } catch (e) {
      throw e;
    }
  }

  getOne = async (company_id: number) => {
    try {
      return checkQueryResultNoData(
        await this.db.oneOrNone(
          await this.db.company.query.getOne(company_id)
        )
      )
    } catch (e) {
      throw e;
    }
  }

  // TODO: create company / admin_crm route
  createOne = async (data: CreateOneCompany) => {
    try {
      return await this.db.tx(async (transaction) => {
        const company = await transaction.one(
          await transaction.company.query.createOne(data.name)
        )

        const company_user = await transaction.one(
          await transaction.companyUser.query.createOne({
            ...data.user,
            company_id: company.id,
            password: await hashPassword(data.user.password),
            is_super: true
          })
        )

        return {
          company: {
            id: company.id,
            name: company.name,
            image: company.image
          },
          user: {
            id: company_user.id,
            name: company_user.name,
            surname: company_user.surname,
            patronymic: company_user.patronymic,
            passport: company_user.passport,
            phone_number: company_user.phone_number,
            is_super: company_user.is_super
          }
        }
      })
    } catch (e) {
      throw e;
    }
  }

  // TODO: update company / admin_crm + company super user route
  // TODO: delete company / super admin_crm route
  deleteOne = async (company_id: number) => {
    try {
      await this.db.none(
        await this.db.company.query.deleteOne(company_id)
      )

      return {
        message: "success"
      }
    } catch (e) {
      throw e;
    }
  }
}