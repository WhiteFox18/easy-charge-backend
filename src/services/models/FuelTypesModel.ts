import { pgp } from "../../db";
import { Lang } from "../../types";
import { CreateFuelType, FuelType, Name } from "../types";

const FuelTypesModel = {
  listFuels: async (lang: Lang) => {
    try {
      return pgp.as.format(`
        SELECT count(*) OVER()::int as count,
               ft_parent.id,
               ft_parent.name_${lang} as name,
               json_agg(
                       json_build_object(
                               'id', ft_child.id,
                               'name', ft_child.name_${lang}
                           )
                       ORDER BY ft_child.id
                   ) as children
        FROM fuel_types ft_parent
                 LEFT JOIN fuel_types ft_child ON ft_parent.id = ft_child.parent_id
        WHERE ft_parent.parent_id IS NULL
        GROUP BY ft_parent.id
      `);
    } catch (e) {
      throw e;
    }
  },
  getOne: async (fuel_type_id: number) => {
    return pgp.as.format(`
      SELECT id, parent_id, name_uz, name_ru, name_en
      FROM fuel_types
      WHERE id = $1
    `, [fuel_type_id])
  },
  parentIdIsNull: async (fuel_type_id: number) => {
    return pgp.as.format(`
      SELECT CASE WHEN parent_id IS NULL THEN false ELSE true END as has_parent
      FROM fuel_types
      WHERE id = $1
    `, [fuel_type_id])
  },
  createOne: async (data: CreateFuelType) => {
    return pgp.as.format(`
      INSERT INTO fuel_types(parent_id, name_uz, name_ru, name_en)
      VALUES($1, $2, $3, $4)
      RETURNING id, parent_id, name_uz, name_ru, name_en
    `, [data.parent_id, data.name_uz, data.name_ru, data.name_en]);
  },
  updateOne: async (data: FuelType) => {
    return pgp.as.format(`
      UPDATE fuel_types
      SET name_uz = $1,
          name_ru = $2,
          name_en = $3
      WHERE id = $4
      RETURNING id, parent_id, name_uz, name_ru, name_en
    `, [data.name_uz, data.name_ru, data.name_en, data.id]);
  },
  deleteOne: async (fuel_type_id: number) => {
    return pgp.as.format(`
      DELETE FROM fuel_types
      WHERE id = $1
      RETURNING id
    `, [fuel_type_id]);
  },
};

export default FuelTypesModel;