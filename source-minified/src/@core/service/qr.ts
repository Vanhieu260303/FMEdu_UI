import axios from "axios";
import { API_ENDPOINT } from "src/config-global";


export class QRScannerService{
 
 getInfoByQR = async(roomCode:string) => {
    return axios.get(`${API_ENDPOINT}/GetInfo?roomCode=${roomCode}`);
 }
}
export default new QRScannerService();