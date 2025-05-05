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
    location_name?: string;
    location_type?: string;
    flag_valid?: boolean;
    activity_type?: any;
    subject?: any;
}

export const getActivity = async (input: ActivityField) => {
    const {
        activity_id = "",
        title = "",
        create_date = "",
        start_date = "",
        end_date = "",
        status = "",
        create_by = "",
        location_id = "",
        location_name = "",
        location_type = "",
        flag_valid = "",
    } = input;

    const data = await fetchDataApi("POST", "activity.get", {
        activity_id,
        title,
        create_date,
        start_date,
        end_date,
        status,
        create_by,
        location_id,
        location_name,
        location_type,
        flag_valid,
    });

    return data;
};


export const createActivity = async (input: ActivityField) => {
    const {
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
        activity_type = "",
        subject = "",
    } = input;

    const data = await fetchDataApi("POST", "create_activity.post", {
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
        activity_type,
        subject,
    });

    return data;
};


export interface ActivityTypeField {
    activity_type_id?: number;
    activity_type_name?: string;
    show?: boolean;
}

export const getActivityType = async (input: ActivityTypeField) => {
    const {
        activity_type_id = "",
        activity_type_name = "",
        show = "",
    } = input;

    const data = await fetchDataApi("POST", "activity_type.get", {
        activity_type_id,
        activity_type_name,
        show,
    });

    return data;
};

