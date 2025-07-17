import { UserLoginDto, UserRegisterDto } from "@/dto/user.dto";
import axiosClient from "./axios";
import { PaginationDto } from "@/dto/pagination.dto";
import { UserRole } from "@/@types/users/user.enum";

export interface UserUpdateDto {
    updates: { email?: string; phone?: string; role?: UserRole }
}
export interface UpdatePassWordDto {
    oldPassword: string,
    newPassword: string
}

export class UserClient {
    login(data: UserLoginDto) {
        return axiosClient.post<{token:string}>("/user/login", data);
    }

    register(data: UserRegisterDto) {
        return axiosClient.post("/user/register", data);
    }

    getAllUsers = async (pagination: PaginationDto) => {
        return axiosClient.get(`/user`, {
            params: {
                page: pagination.page,
                limit: pagination.limit,
                search: pagination.search || "", // Truyền giá trị tìm kiếm nếu có
            },
        });
    };

    getUserById(id: string) {
        return axiosClient.get(`/user/${id}`);
    }

    deleteUser(id: string) {
        return axiosClient.delete(`/user/${id}`);
    }

    getMe() {
        return axiosClient.get("/user/me");
    }

    updateUser(id: string, data: UserUpdateDto) {
        return axiosClient.put(`/user/${id}`, data);
    }
    changePassword(id: string, data: UpdatePassWordDto){
        return axiosClient.put(`/user/${id}/change-password`, data);
    }

}
