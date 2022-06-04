import { GetOne, ListCompanyBranches } from "../types";
import { pgp } from "../../db";
import { Lang } from "../../types";

const CompanyBranchModel = {
  list: async (data: ListCompanyBranches) => {
    const lang: Lang = data.lang

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
    `, [data.company_id, data.search, data.limit, data.offset])
  },
  getOneForMobile: async (data: GetOne) => {
    const lang: Lang = data.lang

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
                             LEFT JOIN company_branch_fuel_selection cbfs on ft_child.id = cbfs.fuel_type_id
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
    `, [data.id])
  },
  getOneForCompany: async (data: GetOne) => {
    const lang: Lang = data.lang

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
                             LEFT JOIN company_branch_fuel_selection cbfs on ft_child.id = cbfs.fuel_type_id
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
    `, [data.id])
  }
}

export default CompanyBranchModel