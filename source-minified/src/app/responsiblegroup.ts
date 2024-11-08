import axios from "axios";
import { API_ENDPOINT } from "src/config-global";

export class ResponsibleGroupRoomService {
 
  createResponsibleGroups = async (data: object) => {
    return axios.post(`${API_ENDPOINT}/api/ResponsibleGroups`, data); 
  };


  getAllResponsibleGroups = async ()=>{
    return axios.get(`${API_ENDPOINT}/api/ResponsibleGroups`);
  }
  getAll = async (pageNumber: number = 1, pageSize: number = 10)=>{
    return axios.get(`${API_ENDPOINT}/api/ResponsibleGroups/all`,{ params: { 
      pageNumber, 
      pageSize}}
    );
  }
  getResponsibleGroupbyId = async (id:string)=>{
    return axios.get(`${API_ENDPOINT}/api/ResponsibleGroups/id?id=${id}`);
  }
  
  updateResponsibleGroup = async (id:string ,data:object)=>{
    return axios.put(`${API_ENDPOINT}/api/ResponsibleGroups?id=${id}`,data);
  }
}

export default new ResponsibleGroupRoomService();
