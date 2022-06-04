import { pgp } from "../../db";
import { CreateAdmin, List, UpdateAdmin } from "../types";

const AdminModel = {
  getOneByUsername: async (username: string) => {
    return pgp.as.format(`
      SELECT *
      FROM admins
      WHERE username = $1
    `, [username]);
  },
  setToken: async ({ id, token }: { id: number; token: string }) => {
    return pgp.as.format(`
      UPDATE admins
      SET token = $1
      WHERE id = $2
    `, [token, id]);
  },
  deleteToken: async (admin_id: number) => {
    return pgp.as.format(`
      UPDATE admins
      SET token = null
      WHERE id = $1
    `, [admin_id]);
  },
  list: async (data: List) => {
    return pgp.as.format(`
      SELECT count(*) OVER ()::int as count,
             id,
             username,
             name,
             surname,
             patronymic,
             is_super
      FROM admins
      ORDER BY CASE WHEN $1::varchar IS NOT NULL THEN similarity(full_name, $1::varchar) END DESC
      LIMIT $2::int OFFSET $3::int
    `, [data.search, data.limit, data.offset]);
  },
  getOne: async (admin_id: number) => {
    return pgp.as.format(`
      SELECT id,
             username,
             name,
             surname,
             patronymic,
             is_super
      FROM admins
      WHERE id = $1::int
    `, [admin_id]);
  },
  createOne: async (data: CreateAdmin) => {
    return pgp.as.format(`
      INSERT INTO admins(username, name, surname, patronymic, password, is_super)
      VALUES($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [
      data.username, data.name, data.surname,
      data.patronymic, data.password, data.is_super,
    ]);
  },
  updateOne: async (data: UpdateAdmin) => {
    return pgp.as.format(`
      UPDATE admins
      SET name          = $1,
          surname       = $2,
          patronymic    = $3
      WHERE id = $4
      RETURNING id, name, surname, patronymic
    `, [data.name, data.surname, data.patronymic, data.id]);
  },
  deleteOne: async (admin_id: number) => {
    return pgp.as.format(`
      DELETE FROM admins
      WHERE id = $1
    `, [admin_id])
  }
};

export default AdminModel;