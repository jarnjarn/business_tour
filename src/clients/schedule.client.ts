
import axiosClient from "./axios";
import { PaginationDto } from "@/dto/pagination.dto";

export interface CreateScheduleDto {
    tourist: string;  // ID của Tourist
    room: string;  // Id phòng
    time: Date;      // Thời gian diễn ra sự kiện
    title: string;     // Tiêu đề
    content: string;   // Nội dung chi tiết
    organizer: string; // Người tổ chức
}

export interface UpdateScheduleDto {
    time?: Date;
    room?: string;
    title?: string;
    content?: string;
    organizer?: string;
}

export class ScheduleClient {
    // 🟢 Tạo lịch trình mới
    createSchedule = async (data: CreateScheduleDto) => {
        return axiosClient.post("/schedule", data);
    };

    // 🟡 Lấy danh sách lịch trình (hỗ trợ phân trang)
    getAllSchedules = async (pagination: PaginationDto) => {
        return axiosClient.get(`/schedule`, {
            params: {
                page: pagination.page,
                limit: pagination.limit,
                search: pagination.search || "",
            },
        });
    };

    // 🔵 Lấy thông tin chi tiết lịch trình theo ID
    getScheduleById = async (id: string) => {
        return axiosClient.get(`/schedule/${id}`);
    };

    getScheduleByIdTourist = async (id: string) => {
        return axiosClient.get(`/schedule/tourist/${id}`);
    };

    // 🟠 Cập nhật lịch trình
    updateSchedule = async (id: string, data: UpdateScheduleDto) => {
        return axiosClient.put(`/schedule/${id}`, data);
    };

    // 🔴 Xoá lịch trình
    deleteSchedule = async (id: string) => {
        return axiosClient.delete(`/schedule/${id}`);
    };

}
