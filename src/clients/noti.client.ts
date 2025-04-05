import { PaginationDto } from "@/dto/pagination.dto";
import axiosClient from "./axios";

export interface CreateNotiDto {
    title: string;     // Tiêu đề
    content: string;   // Nội dung thông báo
}
export interface CreateNotiByStaffDto {
    receiverId:string;
    title: string;     // Tiêu đề
    content: string;   // Nội dung thông báo
}

export interface UpdateNotiStatusDto {
    notiId: string; // ID của thông báo cần cập nhật
    status: boolean; // Trạng thái đã đọc (true = đã đọc, false = chưa đọc)
}

export class notiClient {
    // 🟢 Tạo thông báo mới
    createNoti = async (data: CreateNotiDto) => {
        return axiosClient.post("/noti", data);
    };
    createNotiByStaff = async (data: CreateNotiByStaffDto) => {
        return axiosClient.post("/noti/staff", data);
    };

    // 🟡 Lấy danh sách thông báo (có phân trang, tải thêm)
    getNotiList = async (pagination: PaginationDto) => {
        return axiosClient.get("/noti", {
            params: {
                page: pagination.page,
                limit: pagination.limit
            },
        });
    };
    updateAllNotiStatus = async () => {
        return axiosClient.put(`/noti/readall`);
    };
    // 🟠 Cập nhật trạng thái đã đọc của thông báo
    updateNotiStatus = async (data: UpdateNotiStatusDto) => {
        return axiosClient.put(`/noti/read/${data.notiId}`, { status: data.status });
    };
   
}
