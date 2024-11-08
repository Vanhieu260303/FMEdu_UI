import axios from "axios";
import { API_ENDPOINT } from "src/config-global";

export class RoomCategoryService{
 getRoomCategoryById = async(Id:string) => {
    return axios.get(`${API_ENDPOINT}/api/RoomCategories/id?id=${Id}`);
 }
 getAllRoomCategory = async() => {
    return axios.get(`${API_ENDPOINT}/api/RoomCategories`);
 }
}
export default new RoomCategoryService();