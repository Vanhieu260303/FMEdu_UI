import axios from "axios";
import { API_ENDPOINT } from "src/config-global";

export class CampusService {
     getCampusById = async(CampusId: string) => {
        return axios.get(`${API_ENDPOINT}/api/Campus?id=${CampusId}`);
    };
     getAllCampus = async() => {
        return axios.get(`${API_ENDPOINT}/api/Campus`);
    }

}
export default new CampusService();