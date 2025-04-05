import axiosClient from "./axios";
import { PaginationDto } from "@/dto/pagination.dto";

export interface CreateLocationDto {
    name: string;
    image: string; // Base64 hoặc URL ảnh từ Cloudinary
    description: string;
}

export interface UpdateLocationDto {
    name?: string;
    address?: string;
    description?: string;
}

export class LocationClient {
    createLocation = async (formData: FormData) => {
        return axiosClient.post("/location", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    };

    getAllLocations = async (pagination: PaginationDto) => {
        return axiosClient.get(`/location`, {
            params: {
                page: pagination.page,
                limit: pagination.limit,
                search: pagination.search || "", // Truyền giá trị tìm kiếm nếu có
            },
        });
    };

    getLocationById(id: string) {
        return axiosClient.get(`/location/${id}`);
    }

    updateLocation(id: string, data: UpdateLocationDto) {
        return axiosClient.put(`/location/${id}`, data);
    }

    deleteLocation(id: string) {
        return axiosClient.delete(`/location/${id}`);
    }
}
