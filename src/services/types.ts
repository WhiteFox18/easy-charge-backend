export interface ListFuels {
  search: string;
}

export interface Name {
  name_uz: string;
  name_ru: string;
  name_en: string;
}

export interface FuelType extends Name{
  id: number;
  parent_id?: number;
}

export interface CreateFuelType extends Omit<FuelType, "id"> {
}