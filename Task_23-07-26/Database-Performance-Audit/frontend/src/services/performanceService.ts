import apiClient from "../api/apiClient";
import type { PerformanceReport } from "../types";

interface PerformanceResponse {

    success:boolean;
    report:{

        performance:PerformanceReport;

    };


}

export const getPerformance =
async():Promise<PerformanceReport> => {


    const response =
    await apiClient.get<PerformanceResponse>(
        "/performance"
    );

    return response.data.report.performance;


};