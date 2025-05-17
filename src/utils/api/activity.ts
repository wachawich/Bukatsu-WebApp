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
    activity_json_form?: any;
    activity_json_form_user?: any;
    image_link?: any;
    user_sys_id?: number;
    approve?: boolean;
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
        activity_json_form = "",
        image_link = "",
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
        activity_json_form,
        image_link
    });

    return data;
};

export const updateActivity = async (input: ActivityField) => {
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
        activity_type = "",
        subject = "",
        activity_json_form = "",
        image_link = ""
    } = input;

    const data = await fetchDataApi("POST", "activity.update", {
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
        activity_type,
        subject,
        activity_json_form,
        image_link,
    });

    return data;
};

export const deleteActivity = async (input: ActivityField) => {
    const {
        activity_id = "",
    } = input;

    const data = await fetchDataApi("POST", "activity.delete", {
        activity_id,
    });

    return data;
};

export const joinActivity = async (input: ActivityField) => {
    const {
        user_sys_id = "",
        activity_id = "",
        approve = false,
        flag_valid = true,
        activity_json_form_user = ""
    } = input;

    const data = await fetchDataApi("POST", "join_activity", {
        user_sys_id,
        activity_id,
        approve,
        flag_valid,
        activity_json_form_user
    });

    return data;
};

export const approveActivity = async (input: ActivityField) => {
    const {
        user_sys_id = "",
        activity_id = "",
        approve = true,
        flag_valid = ""
    } = input;

    const data = await fetchDataApi("POST", "activity_approve", {
        user_sys_id,
        activity_id,
        approve,
        flag_valid
    });

    return data;
};

export interface ActivityTypeField {
    activity_type_id?: number;
    activity_type_name?: string;
    activity_type_description?: string;
    show?: boolean;
    flag_valid?: boolean;
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

export const createActivityType = async (input: ActivityTypeField) => {
    const {
        activity_type_name = "",
        activity_type_description = "",
    } = input;

    const data = await fetchDataApi("POST", "activity_type.create", {
        activity_type_name,
        activity_type_description,
    });

    return data;
};


export const updateActivityType = async (input: ActivityTypeField) => {
    const {
        activity_type_id = "",
        activity_type_name = "",
        activity_type_description = "",
        show = "",
        flag_valid = "",
    } = input;

    const data = await fetchDataApi("POST", "activity_type.update", {
        activity_type_id,
        activity_type_name,
        activity_type_description,
        show,
        flag_valid,
    });

    return data;
};

export const getActivityAttendance = async (input: ActivityField) => {
    const {
        activity_id = "",
        approve = ""
    } = input;

    const data = await fetchDataApi("POST", "activity_attendance.get", {
        activity_id,
        approve
    });

    return data;
};