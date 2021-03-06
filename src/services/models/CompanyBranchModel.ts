import {
  CreateOneCompanyBranch,
  GetOne,
  ListCompanyBranches,
  ListCompanyBranchesForMobile,
  UpdateOneCompanyBranch,
} from "../types";
import { pgp } from "../../db";
import { Lang } from "../../types";

const CompanyBranchModel = {
  list: async (data: ListCompanyBranches) => {
    const lang: Lang = data.lang;

    return pgp.as.format(`
      SELECT count(*) OVER ()::int as count,
             cb.id,
             concat(
                     d.name_${lang},
                     ', ',
                     c.name_${lang},
                     ', ',
                     c2.name_${lang}
                 )                 as address,
             cb.name_${lang}       as name,
             json_build_object(
                     'longitude', cb.coords[0],
                     'latitude', cb.coords[1]
                 )                 as coords,
             cb.is_working
      FROM company_branch cb
               LEFT JOIN districts d on cb.district_id = d.id
               LEFT JOIN cities c on d.city_id = c.id
               LEFT JOIN states s on c.state_id = s.id
               LEFT JOIN countries c2 on s.country_id = c2.id
      WHERE company_id = $1::int
      ORDER BY CASE WHEN $2::varchar IS NOT NULL THEN similarity(cb.full_name, $2::varchar) END DESC
      LIMIT $3::int OFFSET $4::int
    `, [data.company_id, data.search, data.limit, data.offset]);
  },
  listMobile: async (data: ListCompanyBranchesForMobile) => {
    const lang: Lang = data.lang;

    return pgp.as.format(`
      SELECT count(*) OVER()::int as count,
             cb.id,
             cb.name_${lang} as name,
             json_build_object(
                     'longitude', cb.coords[0],
                     'latitude', cb.coords[1]
                 )           as coords
      FROM company_branch cb
               LEFT JOIN districts d on cb.district_id = d.id
               LEFT JOIN cities c on d.city_id = c.id
               LEFT JOIN states s on c.state_id = s.id
               LEFT JOIN countries c2 on s.country_id = c2.id
      WHERE CASE
                WHEN array_length($1::int[], 1) IS NOT NULL THEN
                    array_length(array_diff($1::int[], (SELECT array_agg(fuel_type_id)
                                                        FROM company_branch_fuel_selection
                                                        WHERE company_branch_id = cb.id
                                                          AND is_available = true
                                                        GROUP BY company_branch_id)), 1) IS NULL
                ELSE cb.id = cb.id END
      ORDER BY CASE WHEN $2::varchar IS NOT NULL THEN similarity(cb.full_name, $2::varchar) END DESC,
               CASE
                   WHEN $3::decimal IS NOT NULL AND $4::decimal IS NOT NULL THEN
                       st_distance(
                               st_setsrid(st_makepoint($3::decimal, $4::decimal), 4326),
                               st_setsrid(cb.coords::geometry, 4326),
                               true
                           ) END ASC
      LIMIT $5::int OFFSET $6::int
    `, [
      data.fuel_types, data.search, data.longitude,
      data.latitude, data.limit, data.offset,
    ]);
  },
  getOneForMobile: async (data: GetOne) => {
    const lang: Lang = data.lang;

    return pgp.as.format(`
      SELECT cb.id,
             concat(
                     d.name_${lang},
                     ', ',
                     c.name_${lang},
                     ', ',
                     c2.name_${lang}
                 )                               as address,
             cb.name_${lang}                     as name,
             c3.name                             as company_name,
             json_build_object(
                     'longitude', cb.coords[0],
                     'latitude', cb.coords[1]
                 )                               as coords,
             cb.is_working,
             json_build_object(
                     'mon', json_build_object('from', cb.mon_from, 'to', cb.mon_to),
                     'tue', json_build_object('from', cb.tue_from, 'to', cb.tue_to),
                     'wed', json_build_object('from', cb.wed_from, 'to', cb.wed_to),
                     'thu', json_build_object('from', cb.thu_from, 'to', cb.thu_to),
                     'fri', json_build_object('from', cb.fri_from, 'to', cb.fri_to),
                     'sat', json_build_object('from', cb.sat_from, 'to', cb.sat_to),
                     'sun', json_build_object('from', cb.sun_from, 'to', cb.sun_to)
                 )                               as working_days,
             (SELECT json_agg(temp ORDER BY temp.id)
              FROM (SELECT ft_parent.id,
                           ft_parent.name_${lang} as name,
                           json_agg(
                                   json_build_object(
                                           'id', ft_child.id,
                                           'name', ft_child.name_${lang},
                                           'price', cbfs.price
                                       )
                                   ORDER BY ft_child.id
                               ) as childs
                    FROM fuel_types ft_parent
                             LEFT JOIN fuel_types ft_child ON ft_parent.id = ft_child.parent_id
                             LEFT JOIN company_branch_fuel_selection cbfs on ft_child.id = cbfs.fuel_type_id AND cbfs.company_branch_id = cb.id
                    WHERE ft_parent.parent_id IS NULL
                      AND ft_child.id = ANY (SELECT fuel_type_id
                                             FROM company_branch_fuel_selection
                                             WHERE company_branch_id = cb.id)
                    GROUP BY ft_parent.id) temp) as fuel_selection
      FROM company_branch cb
               LEFT JOIN districts d on cb.district_id = d.id
               LEFT JOIN cities c on d.city_id = c.id
               LEFT JOIN states s on c.state_id = s.id
               LEFT JOIN countries c2 on s.country_id = c2.id
               LEFT JOIN companies c3 on c3.id = cb.company_id
      WHERE cb.id = $1::int
    `, [data.id]);
  },
  getOneForCompany: async (data: GetOne) => {
    const lang: Lang = data.lang;

    return pgp.as.format(`
      SELECT cb.id,
             concat(
                     d.name_${lang},
                     ', ',
                     c.name_${lang},
                     ', ',
                     c2.name_${lang}
                 )                               as address,
             cb.name_uz,
             cb.name_ru,
             cb.name_en,
             json_build_object(
                     'longitude', cb.coords[0],
                     'latitude', cb.coords[1]
                 )                               as coords,
             cb.is_working,
             json_build_object(
                     'mon', json_build_object('from', cb.mon_from, 'to', cb.mon_to),
                     'tue', json_build_object('from', cb.tue_from, 'to', cb.tue_to),
                     'wed', json_build_object('from', cb.wed_from, 'to', cb.wed_to),
                     'thu', json_build_object('from', cb.thu_from, 'to', cb.thu_to),
                     'fri', json_build_object('from', cb.fri_from, 'to', cb.fri_to),
                     'sat', json_build_object('from', cb.sat_from, 'to', cb.sat_to),
                     'sun', json_build_object('from', cb.sun_from, 'to', cb.sun_to)
                 )                               as working_days,
             (SELECT json_agg(temp ORDER BY temp.id)
              FROM (SELECT ft_parent.id,
                           ft_parent.name_${lang},
                           json_agg(
                                   json_build_object(
                                           'id', ft_child.id,
                                           'name', ft_child.name_${lang},
                                           'price', cbfs.price
                                       )
                                   ORDER BY ft_child.id
                               ) as childs
                    FROM fuel_types ft_parent
                             LEFT JOIN fuel_types ft_child ON ft_parent.id = ft_child.parent_id
                             LEFT JOIN company_branch_fuel_selection cbfs on ft_child.id = cbfs.fuel_type_id AND cbfs.company_branch_id = cb.id
                    WHERE ft_parent.parent_id IS NULL
                      AND ft_child.id = ANY (SELECT fuel_type_id
                                             FROM company_branch_fuel_selection
                                             WHERE company_branch_id = cb.id)
                    GROUP BY ft_parent.id) temp) as fuel_selection
      FROM company_branch cb
               LEFT JOIN districts d on cb.district_id = d.id
               LEFT JOIN cities c on d.city_id = c.id
               LEFT JOIN states s on c.state_id = s.id
               LEFT JOIN countries c2 on s.country_id = c2.id
      WHERE cb.id = $1::int
    `, [data.id]);
  },
  createOne: async (data: CreateOneCompanyBranch & { company_id: number }) => {
    return pgp.as.format(`
      INSERT INTO company_branch(
          district_id, coords, name_uz, name_ru, name_en,
          mon_from, mon_to,
          tue_from, tue_to,
          wed_from, wed_to,
          thu_from, thu_to,
          fri_from, fri_to,
          sat_from, sat_to,
          sun_from, sun_to,
          company_id
      )
      VALUES(
          $1, $2, $3, $4, $5,
          $6, $7,
          $8, $9,
          $10, $11,
          $12, $13,
          $14, $15,
          $16, $17,
          $18, $19,
          $20
      )
      RETURNING *
    `, [
      data.district_id, data.coords,
      data.name_uz, data.name_ru, data.name_en,
      data.mon_from, data.mon_to,
      data.tue_from, data.tue_to,
      data.wed_from, data.wed_to,
      data.thu_from, data.thu_to,
      data.fri_from, data.fri_to,
      data.sat_from, data.sat_to,
      data.sun_from, data.sun_to,
      data.company_id,
    ]);
  },
  updateOne: async (data: UpdateOneCompanyBranch) => {
    return pgp.as.format(`
      UPDATE company_branch
      SET district_id = $1,
          coords      = $2,
          mon_from    = $3,
          mon_to      = $4,
          tue_from    = $5,
          tue_to      = $6,
          wed_from    = $7,
          wed_to      = $8,
          thu_from    = $9,
          thu_to      = $10,
          fri_from    = $11,
          fri_to      = $12,
          sat_from    = $13,
          sat_to      = $14,
          sun_from    = $15,
          sun_to      = $16,
          name_uz     = $17,
          name_ru     = $18,
          name_en     = $19
      WHERE id = $20
      RETURNING *
    `, [
      data.district_id, data.coords,
      data.mon_from, data.mon_to,
      data.tue_from, data.tue_to,
      data.wed_from, data.wed_to,
      data.thu_from, data.thu_to,
      data.fri_from, data.fri_to,
      data.sat_from, data.sat_to,
      data.sun_from, data.sun_to,
      data.name_uz, data.name_ru, data.name_en,
      data.id,
    ]);
  },
  deleteOne: async (branch_id: number) => {
    return pgp.as.format(`
      DELETE FROM company_branch
      WHERE id = $1::bigint
      RETURNING id
    `, [branch_id])
  }
};

export default CompanyBranchModel;