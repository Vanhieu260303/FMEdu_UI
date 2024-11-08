import axios from "axios";
import { API_ENDPOINT } from "src/config-global";

export class ShiftService{
 getShiftsByRoomId = async(roomCategoricalId:string) => {
    return axios.get(`${API_ENDPOINT}/api/Shifts/ByRoomId?roomId=${roomCategoricalId}`);
 }
 getAllShifts = async (pageNumber: number = 1, pageSize: number = 10, shiftName?: string, categoryName?: string) => {
  return axios.get(`${API_ENDPOINT}/api/Shifts`, {
    params: { 
      pageNumber, 
      pageSize, 
      shiftName,    
      categoryName  
    }
  });
}


 createShifts = async (data: object) => {
   return axios.post(`${API_ENDPOINT}/api/Shifts`, data); 
 };
 
 editShifts = async (id:string,data: object) => {
  return axios.put(`${API_ENDPOINT}/api/Shifts?id=${id}`, data); 
};
 
}
export default new ShiftService();