// import { TABLENAME, myIndexDB } from "../indexDB/indexDBFunction";
import { fetchJSONRPC } from "../jsonRPC";
import { basePath } from "./apiENV";
import { fetchDataApi } from "../callAPI"

export interface RoleField {
  role_id?: number;
  role_name?: string;
  access?: object;
  show? : boolean
}

export const getRole = async (input: RoleField) => {

  const {
    role_id = "",
    role_name = "",
    show = ""
  } = input;

  const data = await fetchDataApi(`POST`, "role.get", {
    role_id: role_id,
    role_name: role_name,
    show : show,
  });

  return data;
};


export const createRole = async (input: RoleField) => {

  const {
    role_name = "",
    access = "",
  } = input;

  const data = await fetchDataApi(`POST`, "role.create", {
    role_name: role_name,
    access : access,
  });

  return data;
};


export const updateRole = async (input: RoleField) => {

  const {
    role_id = "",
    role_name = "",
    access = "",
    show = ""
  } = input;

  const data = await fetchDataApi(`POST`, "role.update", {
    role_id : role_id,
    role_name: role_name,
    access : access,
    show : show
  });

  return data;
};