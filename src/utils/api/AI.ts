import { fetchDataApiAI } from "../callAPI"

export interface AIField {
    flag_valid ?: boolean;
    user_sys_id ?: number;
    limit ?: boolean;
    section ?: string;
    activity_name ?: string;
    activity_id ?: number;
}

export const getActivityAI = async (input: AIField) => {

    const {
        flag_valid = "",
        user_sys_id = "",
        limit = "",
    } = input;

    const data = await fetchDataApiAI(`POST`, "activity.get.ai", {
        flag_valid,
        user_sys_id,
        limit
    });

    return data;
};

export const updateJsonAI = async (input: AIField) => {

    const {
        activity_name = "",
        activity_id = "",
        user_sys_id = "",
        section = "",
    } = input;

    const data = await fetchDataApiAI(`POST`, "update_json.ai", {
        activity_name,
        user_sys_id,
        section,
        activity_id
    });

    return data;
};


export const processLocationAI = async (input: AIField) => {

    const {
        activity_name = "",
        user_sys_id = "",
        section = "",
    } = input;

    const data = await fetchDataApiAI(`POST`, "location.predict.ai", {
        activity_name,
        user_sys_id,
        section
    });

    return data;
};
