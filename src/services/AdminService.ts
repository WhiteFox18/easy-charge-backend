import { DatabaseClient, ServiceProps } from "../types";
import { ExtendedDatabase } from "../db";
import Errors from "../modules/errors";
import bcrypt from "bcrypt";
import { Admin, CreateAdmin, List, UpdateAdmin } from "./types";
import { checkQueryResultNoData, createUserJwtToken, hashPassword, paginate } from "../modules/helpers";

export default class AdminService {
  private db: ExtendedDatabase = null;
  private pgp: DatabaseClient = null;

  constructor(props: ServiceProps) {
    this.db = props.db;
    this.pgp = props.pgp;
  }

  // TODO: login

  setToken = async ({ id, token }: { id: number; token: string }) => {
    try {
      await this.db.none(
        await this.db.admin.query.setToken({ id, token }),
      );
    } catch (e) {
      throw e;
    }
  };

  login = async ({ username, password }: { username: string, password: string }) => {
    try {
      const admin: Admin = await this.db.oneOrNone(
        await this.db.admin.query.getOneByUsername(username),
      );

      if (!admin || !(await bcrypt.compare(password, admin.password)))
        Errors.login();

      const token = await createUserJwtToken({
        user_id: admin.id,
        is_super: admin.is_super,
        type: "admin",
      });

      return {
        token: token,
        user: {
          id: admin.id,
          username: admin.username,
          name: admin.name,
          surname: admin.surname,
          patronymic: admin.patronymic,
          is_super: admin.is_super,
        },
      };
    } catch (e) {
      throw e;
    }
  };

  logout = async (admin_id: number) => {
    try {
      await this.db.none(
        await this.db.admin.query.deleteToken(admin_id),
      );

      return {
        message: "success",
      };
    } catch (e) {
      throw e;
    }
  };

  // TODO: get list admins
  list = async (data: List) => {
    try {
      return paginate(
        await this.db.manyOrNone(
          await this.db.admin.query.list(data),
        ),
      );
    } catch (e) {
      throw e;
    }
  };

  getOne = async (admin_id: number) => {
    try {
      return checkQueryResultNoData(
        await this.db.oneOrNone(
          await this.db.admin.query.getOne(admin_id),
        ),
      );
    } catch (e) {
      throw e;
    }
  };

  // TODO: create admin_crm
  createOne = async (data: CreateAdmin) => {
    try {
      return await this.db.one(
        await this.db.admin.query.createOne({
          ...data,
          password: await hashPassword(data.password),
        })
      )
    } catch (e) {
      throw e;
    }
  }

  // TODO: update admin_crm
  updateOne = async (data: UpdateAdmin) => {
    try {
      return await this.db.one(
        await this.db.admin.query.updateOne(data),
      );
    } catch (e) {
      throw e;
    }
  };

  // TODO: delete admin_crm
  deleteOne = async (admin_id: number) => {
    try {
      return await this.db.one(
        await this.db.admin.query.deleteOne(admin_id)
      )
    } catch (e) {
      throw e;
    }
  }
}