// import { TABLENAME, myIndexDB } from "../indexDB/indexDBFunction";
import { fetchJSONRPC } from "../jsonRPC";
import { basePath } from "./apiENV";
import { fetchDataApi } from "../callAPI"

export interface UserField {
  user_sys_id?: number;
  username?: string;
  user_first_name?: string;
  user_last_name?: string;
  role_id?: number;
  org_id?: number;
  sex?: string;
  phone?: string;
  email?: string;
}

export interface calResponsibilityField {
  type: string;
  cal_structure: string;
  id:number;
}

export const getUser = async (input: UserField) => {

  const {
    user_sys_id = "",
    username = "",
    user_first_name = "",
    user_last_name = "",
    org_id = "",
    role_id = "",
    sex = "",
    phone = "",
    email = ""
  } = input;

  const data = await fetchDataApi(`POST`, "users.get", {
    user_sys_id: user_sys_id,
    username: username,
    user_first_name: user_first_name,
    user_last_name: user_last_name,
    org_id: org_id,
    role_id: role_id,
    sex : sex,
    phone : phone,
    email : email,
  });

  return data;
};