import axios from "axios";
import { API_ENDPOINT } from "src/config-global";


export class CleaningFormService{
 getAllCleaningForm =async (pageNumber: number = 1, pageSize: number = 10) => {
    return axios.get(`${API_ENDPOINT}/api/CleaningForms`, {
      params: { pageNumber, pageSize }
    });
  }
 postCleaningForm = async(form:object) => {
    return axios.post(`${API_ENDPOINT}/api/CleaningForms/create-form`,form);
 }
 postCriteriaPerForm = async(data:any) => {
    return axios.post(`${API_ENDPOINT}/api/CriteriasPerForms/newForm`,data);
 }
 getFormById = async(formId:string) => {
    return axios.get(`${API_ENDPOINT}/api/CleaningForms?id=${formId}`);
 }
 getFormInfoById = async(formId:string)=>{
   return axios.get(`${API_ENDPOINT}/api/CleaningForms/GetFullInfo?formId=${formId}`);
 }
 EditCleaningForm = async(data:any) => {
    return axios.put(`${API_ENDPOINT}/api/CriteriasPerForms/edit`,data);
 }
 getFormByRoomId = async(roomId:string) => {
    return axios.get(`${API_ENDPOINT}/api/CleaningForms/ByRoomId?RoomId=${roomId}`);
 }
}
export default new CleaningFormService();