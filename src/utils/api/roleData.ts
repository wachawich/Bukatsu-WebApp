// import { TABLENAME, myIndexDB } from "../indexDB/indexDBFunction";
import { fetchJSONRPC } from "../jsonRPC";
import { basePath } from "./apiENV";
import { fetchDataApi } from "../callAPI"

export interface RoleField {
  role_id?: number;
  role_name?: string;
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