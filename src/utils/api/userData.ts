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
    password?: string;
    subject?: any;
    activity_type?: any;
    otp?: string
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


export const updateUser = async (input: UserField) => {

  const {
    user_sys_id = "",
    user_first_name = "",
    user_last_name = "",
    username = "",
    sex = "",
    phone = "",
  } = input;

  const data = await fetchDataApi(`POST`, "users.update", {
    user_sys_id,
    user_first_name,
    user_last_name,
    username,
    sex,
    phone,
  });

  return data;
};


export const resetPassword = async (input: UserField) => {

  const {
    email = "",
    password = "",
  } = input;

  const data = await fetchDataApi(`POST`, "password.reset", {
    email,
    password
  });

  return data;
};


export const changePassword = async (input: any) => {

  const {
    user_sys_id = "", 
    old_password = "", 
    new_password = ""
  } = input;

  const data = await fetchDataApi(`POST`, "password.change", {
    user_sys_id, 
    old_password, 
    new_password
  });

  return data;
};