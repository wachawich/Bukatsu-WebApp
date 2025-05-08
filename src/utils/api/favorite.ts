// import { TABLENAME, myIndexDB } from "../indexDB/indexDBFunction";
import { fetchJSONRPC } from "../jsonRPC";
import { basePath } from "./apiENV";
import { fetchDataApi } from "../callAPI"

export interface FavField {
    user_sys_id?: number;
    activity_id?: number;
    flag_valid?: boolean;
}

export const getFav = async (input: FavField) => {

    const {
        user_sys_id = "",
        activity_id = "",
        flag_valid = ""
    } = input;

    const data = await fetchDataApi(`POST`, "fav.get", {
        user_sys_id: user_sys_id,
        activity_id: activity_id,
        flag_valid: flag_valid,
    });

    return data;
};

export const createFav = async (input: FavField) => {

    const {
        user_sys_id = "",
        activity_id = ""
    } = input;

    const data = await fetchDataApi(`POST`, "fav.create", {
        user_sys_id: user_sys_id,
        activity_id: activity_id,
    });

    return data;
};


export const updateFav = async (input: FavField) => {

    const {
        user_sys_id = "",
        activity_id = "",
        flag_valid = "",
    } = input;

    const data = await fetchDataApi(`POST`, "fav.update", {
        user_sys_id: user_sys_id,
        activity_id: activity_id,
        flag_valid: flag_valid,
    });

    return data;
};