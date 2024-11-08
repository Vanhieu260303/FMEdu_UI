import axios from "axios";
import { API_ENDPOINT } from "src/config-global";

export class RoomService {
   getRoomsByFloorIdAndBlockId = async (floorId: string,blockId:string) => {
      return axios.get(`${API_ENDPOINT}/api/Rooms/By-Floor&Block?floorId=${floorId}&blockId=${blockId}`);
   }
   getRoomById = async (roomId: string) => {
      return axios.get(`${API_ENDPOINT}/api/Rooms/${roomId}`);
   }
   getRoomsByFloorIdAndBlockIdIfExistForm = async (floorId: string,blockId:string) => {
      return axios.get(`${API_ENDPOINT}/api/Rooms/IfExistForm-Floor&Block?floorId=${floorId}&blockId=${blockId}`);
   }
   getAllRooms = async () => {
      return axios.get(`${API_ENDPOINT}/api/Rooms/All`);
   }

   getRoomByCampus = async (campusId: string) => {
      return axios.get(`${API_ENDPOINT}/api/Rooms/GetRoomByCampus?campusId=${campusId}`);
   }
   searchRooms = async (input: string) => {
      return axios.get(`${API_ENDPOINT}/api/Rooms/SearchRoom?roomName=${input}`);
   }
   getRoomByBlockAndCampus = async (campusId: string, blockId: string) => {
      return axios.get(`${API_ENDPOINT}/api/Rooms/GetRoomByBlocksAndCampus?blockId=${blockId}&campusId=${campusId}`);
   }
   getRoomListByRoomType = async (roomType: string) => {
      return axios.get(`${API_ENDPOINT}/api/Schedules/GetRoomsList?RoomType=${roomType}`);
   }
}

export default new RoomService();