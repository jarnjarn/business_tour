import { EvaluateCreateDto } from "@/dto/evaluate.dto";
import axiosClient from "./axios";
import { PaginationDto } from "@/common/dto/pagination.dto";


export class EvaluateClient {
    // 🟢 Tạo lịch trình mới
    createEvaluate = async (data: Partial<EvaluateCreateDto>) => {
        return axiosClient.post("/evaluate", data);
    };

    // 🟡 Lấy danh sách lịch trình (hỗ trợ phân trang)
    getAllEvaluates = async (pagination: PaginationDto) => {
        return axiosClient.get(`/evaluate`, {
            params: {
                page: pagination.page,
                limit: pagination.limit,
                query: pagination.query || "",
            },
        });
    };

    // 🔵 Lấy thông tin chi tiết lịch trình theo ID
    getEvaluateById = async (id: string) => {
        return axiosClient.get(`/evaluate/${id}`);
    };

    getEvaluateByIdTourist = async (id: string) => {
        return axiosClient.get(`/evaluate/location/${id}`);
    };

    // 🟠 Cập nhật lịch trình
    updateEvaluate = async (id: string, data: Partial<EvaluateCreateDto>) => {
        return axiosClient.put(`/evaluate/${id}`, data);
    };

    // 🔴 Xoá lịch trình
    deleteEvaluate = async (id: string) => {
        return axiosClient.delete(`/evaluate/${id}`);
    };
}
