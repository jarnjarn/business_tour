import axiosClient from "./axios";
import { PaginationDto } from "@/dto/pagination.dto";

export interface CreateTouristDto {
    locationId: string;
    totalPeople:number;
    form: string; // Ngày bắt đầu (ISO string hoặc YYYY-MM-DD)
    to: string;   // Ngày kết thúc (ISO string hoặc YYYY-MM-DD)
}

export interface UpdateTouristDto {
    totalPeople:number
    status: string; // Trạng thái yêu cầu: "pending" | "approved" | "rejected"
    note?: string;  // Ghi chú (tuỳ chọn)
}

export class TouristClient {
    // 🟢 Tạo yêu cầu du lịch
    createTourist = async (data: CreateTouristDto) => {
        return axiosClient.post("/tourist", data);
    };

    // 🟡 Lấy danh sách yêu cầu du lịch (hỗ trợ phân trang & tìm kiếm)
    getAllTourists = async (pagination: PaginationDto) => {
        return axiosClient.get(`/tourist`, {
            params: {
                page: pagination.page,
                limit: pagination.limit,
                search: pagination.search || "",
            },
        });
    };

    // 🔵 Lấy thông tin chi tiết yêu cầu du lịch
    getTouristById = async (id: string) => {
        return axiosClient.get(`/tourist/${id}`);
    };

    // 🟠 Cập nhật trạng thái yêu cầu du lịch (Chỉ Admin/Staff có quyền duyệt)
    updateTouristStatus = async (id: string, data: UpdateTouristDto) => {
        return axiosClient.put(`/tourist/${id}`, data);
    };

    // 🔴 Xoá yêu cầu du lịch
    deleteTourist = async (id: string) => {
        return axiosClient.delete(`/tourist/${id}`);
    };

    // 🔵 So sánh số lượng du khách theo địa điểm
    compareTouristStatsByLocation = async () => {
        return axiosClient.get("/tourist/compare");
    };
}
