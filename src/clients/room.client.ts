import axiosClient from "./axios";
import { PaginationDto } from "@/dto/pagination.dto";

export interface CreateRoomDto {
    name: string;  // ID của Tourist
    description: string;  // Id phòng
    capacity: number;      // Thời gian diễn ra sự kiện
    status: string;     // Tiêu đề
    location: string;   // Nội dung chi tiết
    organizer: string; // Người tổ chức
}

export interface UpdateRoomDto {
    name?: string;
    description?: string;
    capacity?: number;
    status?: string;
    location?: string;
    organizer?: string;
}

export class RoomClient {
    // 🟢 Tạo lịch trình mới
    createRoom = async (data: CreateRoomDto) => {
        return axiosClient.post("/room", data);
    };

    // 🟡 Lấy danh sách lịch trình (hỗ trợ phân trang)
    getAllRooms = async (pagination: PaginationDto) => {
        return axiosClient.get(`/room`, {
            params: {
                page: pagination.page,
                limit: pagination.limit,
                search: pagination.search || "",
            },
        });
    };

    // 🔵 Lấy thông tin chi tiết lịch trình theo ID
    getRoomById = async (id: string) => {
        return axiosClient.get(`/room/${id}`);
    };

    getRoomByLocationId = async (id: string) => {
        return axiosClient.get(`/room/location/${id}`);
    };

    // 🟠 Cập nhật lịch trình
    updateRoom = async (id: string, data: UpdateRoomDto) => {
        return axiosClient.put(`/room/${id}`, data);
    };

    // 🔴 Xoá lịch trình
    deleteRoom = async (id: string) => {
        return axiosClient.delete(`/room/${id}`);
    };
}
