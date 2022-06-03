import { ExtendedDatabase } from "../db";
import { DatabaseClient, Lang, ServiceProps } from "../types";
import { checkQueryResultNoData, paginate } from "../modules/helpers";
import { CreateFuelType, FuelType } from "./types";
import Errors from "../modules/errors";

export default class FuelTypesService {
  private db: ExtendedDatabase = null;
  private pgp: DatabaseClient = null;

  constructor(props: ServiceProps) {
    this.db = props.db;
    this.pgp = props.pgp;
  }

  // TODO: get list fuel types with children
  listFuels = async (lang: Lang) => {
    try {
      return paginate(
        await this.db.manyOrNone(
          await this.db.fuelTypes.query.listFuels(lang),
        ),
      );
    } catch (e) {
      throw e;
    }
  };

  getOne = async (fuel_type_id: number) => {
    try {
      return checkQueryResultNoData(
        await this.db.oneOrNone(
          await this.db.fuelTypes.query.getOne(fuel_type_id)
        )
      )
    } catch (e) {
      throw e;
    }
  }

  private checkParentIdIsNull = async (fuel_type_id: number) => {
    try {
      let {has_parent} = await this.db.oneOrNone(
        await this.db.fuelTypes.query.parentIdIsNull(fuel_type_id)
      )

      if(has_parent)
        Errors.fuelTypeHasParent()

       return has_parent
    } catch (e) {
      throw e;
    }
  };

  createOne = async (data: CreateFuelType) => {
    try {
      if(data.parent_id)
        await this.checkParentIdIsNull(data.parent_id)

      return await this.db.one(
        await this.db.fuelTypes.query.createOne(data),
      );
    } catch (e) {
      throw e;
    }
  };

  updateOne = async (data: FuelType) => {
    try {
      return await this.db.one(
        await this.db.fuelTypes.query.updateOne(data),
      );
    } catch (e) {
      throw e;
    }
  };

  deleteOne = async (fuel_type_id: number) => {
    try {
      return await this.db.one(
        await this.db.fuelTypes.query.deleteOne(fuel_type_id),
      );
    } catch (e) {
      throw e;
    }
  };
}