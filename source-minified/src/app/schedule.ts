import axios from "axios";
import { API_ENDPOINT } from "src/config-global";

type place = {
  campusId:string,
  roomId:string
  blockId:string,
  floorId:string,
  shiftId:string
}
export class ScheduleService {
 
  createSchedule = async (data: object) => {
    return axios.post(`${API_ENDPOINT}/api/Schedules`, data); 
  };

  getAllSchedule = async ()=>{
    return axios.get(`${API_ENDPOINT}/api/Schedules`);
  }
  getTagAndUserByShiftAndRoom = async (place:place, criteriaIds:string[]) => {
    const criteriaParams = criteriaIds.map(id => `criteriaIds=${id}`).join('&');
    const url = `${API_ENDPOINT}/api/Schedules/get-users-by-shift-room-and-criteria?CampusId=${place.campusId}&BlockId=${place.blockId}&FloorId=${place.floorId}&RoomId=${place.roomId}&ShiftId=${place.shiftId}&${criteriaParams}`;
    return axios.get(url);
  }
  deleteSchedule = async (id: string) => {
    return axios.delete(`${API_ENDPOINT}/api/Schedules?scheduleId=${id}`);
  }

  editSchedule = async (id: string, data: object) => {
    return axios.put(`${API_ENDPOINT}/api/Schedules?id=${id}`, data);
  }
}

export default new ScheduleService();
