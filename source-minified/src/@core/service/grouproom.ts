import axios from "axios";
import { API_ENDPOINT } from "src/config-global";

export class GroupRoomService {

  createGroupRooms = async (data: object) => {
    return axios.post(`${API_ENDPOINT}/api/GroupRooms`, data); 
  };
  getRoomGroupById = async (id:string)=>{
    return axios.get(`${API_ENDPOINT}/api/GroupRooms/id?id=${id}`);
  }

  updateRoomGroup = async (id:string ,data:object)=>{
    return axios.put(`${API_ENDPOINT}/api/GroupRooms?id=${id}`,data);
  }

  getAllGroupRooms = async (pageNumber: number = 1, pageSize: number = 10)=>{
    return axios.get(`${API_ENDPOINT}/api/GroupRooms`,{ params: { 
      pageNumber, 
      pageSize}});
  }
}

export default new GroupRoomService();
