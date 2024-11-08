import axios from "axios";
import { API_ENDPOINT } from "src/config-global";

export class TagService{
 getAllTags = async() => {
    return axios.get(`${API_ENDPOINT}/api/Tags`);
 }

 getGroupInfoByTagId = async (id:string) =>{
  return axios.get(`${API_ENDPOINT}/api/Tags/GetGroupInfoByTagId?tagId=${id}`);
}

 getTagsByCriteriaId = async(criteriaId:string) =>{
   return axios.get(`${API_ENDPOINT}/api/TagsPerCriterias/Criteria?criteriaId=${criteriaId}`);
 }
 postTagsPerCriteria = async(data: { criteriaId: string|undefined, Tag: object[] }) =>{
   return axios.post(`${API_ENDPOINT}/api/TagsPerCriterias/newCriteria`, data);
 }
 getTagGroups =async(pageNumber:number=1,pageSize:number=10)=>{
  return axios.get(`${API_ENDPOINT}/api/Tags/GetTagGroups`,{
    params: { pageNumber, pageSize }
  })
 }
}
export default new TagService();