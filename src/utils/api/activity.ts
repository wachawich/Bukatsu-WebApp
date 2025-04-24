import { fetchDataApi } from "../callAPI";

export interface ActivityField {
  activity_id?: number;
  title?: string;
  description?: string;
  create_date?: string;
  start_date?: string;
  end_date?: string;
  status?: string;
  contact?: string;
  user_count?: number;
  price?: number;
  user_property?: string;
  remark?: string;
  create_by?: string;
  location_id?: number;
}

export const getActivity = async (input: ActivityField) => {
  const {
    activity_id = "",
    title = "",
    description = "",
    create_date = "",
    start_date = "",
    end_date = "",
    status = "",
    contact = "",
    user_count = "",
    price = "",
    user_property = "",
    remark = "",
    create_by = "",
    location_id = "",
  } = input;

  const data = await fetchDataApi("POST", "activity.get", {
    activity_id,
    title,
    description,
    create_date,
    start_date,
    end_date,
    status,
    contact,
    user_count,
    price,
    user_property,
    remark,
    create_by,
    location_id,
  });

  return data;
};


export const createActivity = async (input: ActivityField) => {
  const {
    activity_id = "",
    title = "",
    description = "",
    create_date = "",
    start_date = "",
    end_date = "",
    status = "",
    contact = "",
    user_count = "",
    price = "",
    user_property = "",
    remark = "",
    create_by = "",
    location_id = "",
  } = input;

  const data = await fetchDataApi("POST", "create_activity.post", {
    activity_id,
    title,
    description,
    create_date,
    start_date,
    end_date,
    status,
    contact,
    user_count,
    price,
    user_property,
    remark,
    create_by,
    location_id,
  });

  return data;
};
