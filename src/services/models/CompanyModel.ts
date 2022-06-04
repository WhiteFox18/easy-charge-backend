import { pgp } from "../../db";
import { List } from "../types";
import config from "../../config";

const CompanyModel = {
  createOne: async (name: string) => {
    return pgp.as.format(`
      INSERT INTO companies(name)
      VALUES($1)
      RETURNING *
    `, [name])
  },
  list: async (data: List) => {
    return pgp.as.format(`
      SELECT count(*) OVER ()::int                                                       as count,
             c.id,
             c.name,
             CASE WHEN c.image IS NOT NULL THEN concat('${config.url}/images/', c.image) END as image,
             concat(cu.name, ' ', cu.surname, ' ', cu.patronymic, ' | +', cu.phone_number) as director
      FROM companies c
          LEFT JOIN company_user cu on c.id = cu.company_id AND cu.is_super = true
      ORDER BY CASE WHEN $1::varchar IS NOT NULL THEN similarity(c.name, $1::varchar) END DESC
      LIMIT $2::int OFFSET $3::int
    `, [data.search, data.limit, data.offset])
  },
  getOne: async (company_id: number) => {
    return pgp.as.format(`
      SELECT id,
             name,
             CASE WHEN image IS NOT NULL THEN concat('${config.url}/images/', image) END as image
      FROM companies
      WHERE id = $1::int
    `, [company_id])
  },
  deleteOne: async (company_id: number) => {
    return pgp.as.format(`
      DELETE FROM companies
      WHERE id = $1
    `, [company_id])
  }
};

export default CompanyModel;