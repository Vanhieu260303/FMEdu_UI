import axios from "axios";
import { API_ENDPOINT } from "src/config-global";

export class FileService{
 PostFile = async(file:any) => {
    return axios.post(`${API_ENDPOINT}/api/Files/UploadFiles`,file,{
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
 }
 DeleteFile = async(fileName:string) => {
    return axios.delete(`${API_ENDPOINT}/api/Files/DeleteFile?filename=${fileName}`);
 }
}
export default new FileService();