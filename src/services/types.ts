import { Lang } from "../types";

export interface ListFuels {
  search: string;
}

export interface GetOne {
  id: number;
  lang: Lang;
}

export interface Name {
  name_uz: string;
  name_ru: string;
  name_en: string;
}

export interface List {
  search: string;
  limit: number;
  offset: number;
}

export interface ListCompanyBranches {
  company_id: number;
  search: string;
  limit: number;
  offset: number;
  lang: Lang;
}

export interface ListCompanyBranchesForMobile {
  longitude: number;
  latitude: number;
  search: string;
  fuel_types: number[];
  lang: Lang;
  limit: number;
  offset: number;
}

export interface CreateOneCompanyBranch extends Name {
  user_id: number;
  district_id: number;
  coords: string;
  mon_from: string;
  mon_to: string;
  tue_from: string;
  tue_to: string;
  wed_from: string;
  wed_to: string;
  thu_from: string;
  thu_to: string;
  fri_from: string;
  fri_to: string;
  sat_from: string;
  sat_to: string;
  sun_from: string;
  sun_to: string;
}

export interface UpdateOneCompanyBranch extends CreateOneCompanyBranch {
  id: number;
}

export interface Admin {
  id: number;
  name: string;
  surname: string;
  patronymic: string;
  username: string;
  password: string;
  full_name: string;
  is_super: boolean;
  created_at: Date;
}

export interface CreateAdmin extends Omit<Admin, "id" | "is_super" | "created_at" | "full_name"> {
  is_super?: boolean;
}

export interface UpdateAdmin extends Omit<Admin, "username" | "password" | "is_super" | "created_at" | "full_name"> {
}

export interface CompanyUser {
  id: number;
  company_id: number;
  password: string;
  name: string;
  surname: string;
  patronymic: string;
  full_name: string;
  passport: string;
  phone_number: string;
  image: string;
  token: string;
  is_super: boolean;
  created_at: Date;
  working_branches: { id: number; is_super: boolean }[];
}

export interface FuelType extends Name {
  id: number;
  parent_id?: number;
}

export interface CreateFuelType extends Omit<FuelType, "id"> {
}

export interface Company {
  id: number;
  name: string;
  image: string;
  created_at: Date;
}

export interface CreateOneCompanyUser {
  name: string;
  company_id: number;
  surname: string;
  patronymic: string;
  passport: string;
  phone_number: string;
  password: string;
  is_super?: boolean;
}

export interface CreateOneCompany {
  name: string;
  user: {
    name: string;
    surname: string;
    patronymic: string;
    passport: string;
    phone_number: string;
    password: string;
  };
}