import axios from "axios";
import { API_ENDPOINT } from "src/config-global";

export class UserPerTagService {
    CreateUserPerTag = async(userPerTag: any) => {
        return axios.post(`${API_ENDPOINT}/api/UsersPerTag`,userPerTag);
    }

}
export default new UserPerTagService();