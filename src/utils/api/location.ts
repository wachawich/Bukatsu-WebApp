import { fetchDataApi } from "../callAPI"

export interface LocationField {
    location_id?: number;
    location_name?: string;
    location_type?: string;
    lat?: number;
    long?: number;
    flag_valid?: boolean;
}

export const getLocation = async (input: LocationField) => {

    const {
        location_id = "",
        location_name = "",
        location_type = "",
        flag_valid = "",
    } = input;

    const data = await fetchDataApi(`POST`, "location.get", {
        location_id,
        location_name,
        location_type,
        flag_valid,
    });

    return data;
};


export const createLocation = async (input: LocationField) => {

    const {
        location_name = "",
        location_type = "",
        lat = "",
        long = "",
    } = input;

    const data = await fetchDataApi(`POST`, "location.create", {
        location_name,
        location_type,
        lat,
        long,
    });

    return data;
};


export const updateLocation = async (input: LocationField) => {

    const {
        location_id = "",
        location_name = "",
        location_type = "",
        lat = "",
        long = "",
        flag_valid = "",
    } = input;

    const data = await fetchDataApi(`POST`, "location.update", {
        location_id,
        location_name,
        location_type,
        lat,
        long,
        flag_valid,
    });

    return data;
};