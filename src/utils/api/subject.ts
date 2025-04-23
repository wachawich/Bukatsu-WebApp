// import { TABLENAME, myIndexDB } from "../indexDB/indexDBFunction";
import { fetchJSONRPC } from "../jsonRPC";
import { basePath } from "./apiENV";
import { fetchDataApi } from "../callAPI"

export interface SubjectField {
  subject_id?: number;
  subject_name?: string;
  show? : boolean
}

export const getSubject = async (input: SubjectField) => {

  const {
    subject_id = "",
    subject_name = "",
    show = ""
  } = input;

  const data = await fetchDataApi(`POST`, "subject.get", {
    subject_id: subject_id,
    subject_name: subject_name,
    show : show,
  });

  return data;
};