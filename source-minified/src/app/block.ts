import axios from "axios";
import { API_ENDPOINT } from "src/config-global";

export class BlockService {
    getBlockByCampusId = async(CampusId: string) => {
        return axios.get(`${API_ENDPOINT}/api/Blocks/ByCampus?campusId=${CampusId}`);
    };
     getAllBlocks = async() => {
        return axios.get(`${API_ENDPOINT}/api/Blocks`);
    }

}
export default new BlockService();