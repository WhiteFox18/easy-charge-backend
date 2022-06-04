import { pgp } from "../../db";
import { Lang } from "../../types";
import config from "../../config";
import { CreateOneCompanyUser } from "../types";

const CompanyUserModel = {
  setToken: async ({ id, token }: { id: number; token: string }) => {
    return pgp.as.format(`
      UPDATE company_user
      SET token = $1
      WHERE id = $2
    `, [token, id]);
  },
  getOneByPhoneNumber: async (phone_number: string) => {
    return pgp.as.format(`
      SELECT cu.id,
             cu.company_id,
             cu.name,
             cu.surname,
             cu.patronymic,
             cu.full_name,
             cu.passport,
             cu.phone_number,
             cu.image,
             cu.password,
             cu.token,
             cu.is_super,
             cu.created_at,
             json_agg(
                 json_build_object(
                     'id', cub.company_branch_id,
                     'is_super', cub.is_super
                     )
                 ) as working_branches
      FROM company_user cu
          LEFT JOIN company_user_branches cub on cu.id = cub.company_user_id
      WHERE phone_number = $1
      GROUP BY cu.id
    `, [phone_number]);
  },
  getCompanyUserCompanyAndWorkingBranches: async ({
                                                    company_user_id,
                                                    lang,
                                                  }: { company_user_id: number; lang: Lang }) => {
    return pgp.as.format(`
      SELECT cu.id,
             json_build_object(
                     'id', c.id,
                     'name', c.name,
                     'image', CASE WHEN c.image IS NOT NULL THEN concat('${config.url}/', c.image) END
                 ) as company,
             json_agg(
                     json_build_object(
                             'id', cb.id,
                             'name', cb.name_${lang},
                             'is_super', cub.is_super,
                             'is_working', cb.is_working
                         )
                 ) as working_branches
      FROM company_user cu
               LEFT JOIN companies c on cu.company_id = c.id
               LEFT JOIN company_user_branches cub on cu.id = cub.company_user_id
               LEFT JOIN company_branch cb on cub.company_branch_id = cb.id
      WHERE cu.id = $1
      GROUP BY cu.id, c.id
    `, [company_user_id]);
  },
  deleteToken: async (company_user_id: number) => {
    return pgp.as.format(`
      UPDATE company_user
      SET token = null
      WHERE id = $1
    `, [company_user_id]);
  },
  createOne: async (data: CreateOneCompanyUser) => {
    return pgp.as.format(`
        INSERT INTO company_user(company_id, name, surname, patronymic, passport, phone_number, password, is_super)
        VALUES($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
    `, [
      data.company_id, data.name, data.surname, data.patronymic,
      data.passport, data.phone_number, data.password, data.is_super,
    ]);
  },
};

export default CompanyUserModel;