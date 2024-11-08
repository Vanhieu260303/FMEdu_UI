import axios from "axios";
import { API_ENDPOINT } from "src/config-global";

export class ChartService {
  GetAverageValueForReport = async(campusId:string)=>{
    return axios.get(`${API_ENDPOINT}/api/Chart/average-values?campusId=${campusId}`)
  }

  GetAverageValueForCriteriaPerCampus = async (campusId: string) => {
    return axios.get(
      `${API_ENDPOINT}/api/Chart/GetTopCriteriaValuesByCampus?campusId=${campusId}`
    );
  };

  GetCleaningReportBy10Days = async ()=>{
    return axios.get(`${API_ENDPOINT}/api/Chart/GetCleaningReportsByLast10Days`)
  }
  GetCleaningReportByQuarter = async()=>{
    return axios.get(`${API_ENDPOINT}/api/Chart/GetCleaningReportsByQuarter`)
  }
  
  GetCleaningReportsByMonth = async (month: string,year: string) => {
    return axios.get(
      `${API_ENDPOINT}/api/Chart/GetCleaningReportsByMonth?month=${month}&year=${year}`
    );
  }


  GetCleaningProgressByCampusId = async (campusId: string) => {
    return axios.get(
      `${API_ENDPOINT}/api/Chart/summary?campusId=${campusId}`
    );
  }
  GetChartComparision = async ()=>{
    return axios.get(`${API_ENDPOINT}/api/Chart/comparison`)
  }

  GetDailyTagAndUserByCampus = async(campusId:string)=>{
    return axios.get(
      `${API_ENDPOINT}/api/Chart/responsible-tag-report?campusId=${campusId}`
    );
  }

  GetDailyRoomGroupReportByCampus = async (campusId: string) => {
    return axios.get(
      `${API_ENDPOINT}/api/Chart/room-group-report?campusId=${campusId}`
    );
  }

  GetDailyReportStatusTableByCampus = async (campusId: string) => {
    return axios.get(
      `${API_ENDPOINT}/api/Chart/detail-report?campusId=${campusId}`
    );
  }

  GetDailyComparisionByCampus = async (campusId: string) => {
    return axios.get(
      `${API_ENDPOINT}/api/Chart/GetShiftEvaluations?campusId=${campusId}`
    );
  }
}

export default new ChartService();