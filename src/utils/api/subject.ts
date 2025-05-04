// import { TABLENAME, myIndexDB } from "../indexDB/indexDBFunction";
import { fetchJSONRPC } from "../jsonRPC";
import { basePath } from "./apiENV";
import { fetchDataApi } from "../callAPI"

export interface SubjectField {
  subject_id?: number;
  subject_name?: string;
  subject_description? : string;
  show? : boolean
  flag_valid? : boolean;
}

export const getSubject = async (input: SubjectField) => {

  const {
    subject_id = "",
    subject_name = "",
    flag_valid = "",
    show = ""
  } = input;

  const data = await fetchDataApi(`POST`, "subject.get", {
    subject_id: subject_id,
    subject_name: subject_name,
    show : show,
    flag_valid : flag_valid
  });

  return data;
};


export const createSubject = async (input: SubjectField) => {

  const {
    subject_name = "",
    subject_description = "",
  } = input;

  const data = await fetchDataApi(`POST`, "subject.create", {
    subject_name: subject_name,
    subject_description : subject_description
  });

  return data;
};


export const updateSubject = async (input: SubjectField) => {

  const {
    subject_id = "",
    subject_name = "",
    subject_description = "",
    flag_valid = "",
    show = ""
  } = input;

  const data = await fetchDataApi(`POST`, "subject.update", {
    subject_id: subject_id,
    subject_name: subject_name,
    subject_description: subject_description,
    show : show,
    flag_valid : flag_valid
  });

  return data;
};