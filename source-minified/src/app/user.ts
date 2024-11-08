import axios from "axios";
import { API_ENDPOINT } from "src/config-global";

export class UserService {
     getAllUsers = async() => {
        return axios.get(`${API_ENDPOINT}/api/Users`);
    }

}
export default new UserService();