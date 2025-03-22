// import { TABLENAME, myIndexDB } from "../indexDB/indexDBFunction";
import { fetchJSONRPC } from "../jsonRPC";
import { basePath } from "./apiENV";

export interface UserField {
  user_sys_id?: number;
  username?: string;
  password?: string;
  role_id?: number;
  access_group_id?: number | null;
  first_name?: string;
  last_name?: string;
  org_id?: number;
  user_subzone_id?: number | null;
  employee_id?: string;
  approver_id?: string;
  user_org_chart?: Object;
  user_status?: string;
  update_by?: number;
  responsibility?: object;
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
    first_name = "",
    last_name = "",
    org_id = "",
    role_id = "",
    access_group_id = ""
  } = input;

  const data = await fetchJSONRPC(`${basePath}/gsgis`, "get_user", {
    user_sys_id: user_sys_id,
    username: username,
    first_name: first_name,
    last_name: last_name,
    org_id: org_id,
    role_id: role_id,
    access_group_id: access_group_id
  });

  return data;
};