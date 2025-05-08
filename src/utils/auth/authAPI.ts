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

export const register = async (input: UserField) => {

    const {
        email = "",
        user_first_name = "",
        user_last_name = "",
        password = "",
        role_id = "",
        org_id = "",
        subject = "",
        sex = "",
        activity_type = "",
    } = input;

    const data = await fetchDataApi(`POST`, "register", {
        email,
        user_first_name,
        user_last_name,
        password,
        role_id,
        org_id,
        subject,
        sex,
        activity_type,
    });

    return data;
};


export const login = async (input: UserField) => {

    const {
        username = "",
        password = "",
    } = input;

    const data = await fetchDataApi(`POST`, "login", {
        username,
        password,
    });

    return data;
};


export const sendOTP = async (input: UserField) => {

    const {
        email = "",
    } = input;

    const data = await fetchDataApi(`POST`, "otp.send", {
        email,
    });

    return data;
};


export const verifyOTP = async (input: UserField) => {

    const {
        email = "",
        otp = "",
    } = input;

    const data = await fetchDataApi(`POST`, "otp.verify", {
        email,
        otp,
    });

    return data;
};
