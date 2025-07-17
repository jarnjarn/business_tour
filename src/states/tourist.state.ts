import { create } from "zustand";
import { TouristClient } from "@/clients/tourist.client";
import { PaginationDto } from "@/dto/pagination.dto";
import { Pagination } from "@/common/struct/pagination.struct";
import { notiClient } from "@/clients/noti.client";
import { User } from "@/@types/users/user.type";
import { Statistic } from "@/@types/tourist/statistic";
import { IUserRegister } from "@/models/tourist.model";

const touristClient = new TouristClient();

export interface Tourist {
    _id: string;
    location: Location;
    user: User;
    totalPeople: number;
    form: string; // Ngày bắt đầu
    to: string;   // Ngày kết thúc
    status: string; // pending | approved | rejected
    note?: string; // Ghi chú từ admin
    userRegister: IUserRegister[];
}

export interface Location {
    _id: string;
    name: string;
    image: string
}

export interface TouristState {
    isLoading: boolean;
    tourists: Pagination<Tourist> | null;
    tourist: Tourist | null;
    select: Tourist | null;
    search: string;
    totalTourists: number;
    currentPage: number;
    statistics: Statistic[] | null;
    setSearch: (search: string) => void;
    setSelect: (tourist: Tourist) => void;
    fetchTourists: (pagination: PaginationDto) => Promise<void>;
    createTourist: (data: any) => Promise<void>;
    updateTourist: (id: string, data: Partial<Tourist>) => Promise<void>;
    deleteTourist: (id: string) => Promise<void>;
    getById: (id: string) => Promise<void>;
    compareTouristStatsByLocation: () => Promise<void>;
    updateUserRegister: (id: string, data: IUserRegister) => Promise<void>;
}

export const useTouristStore = create<TouristState>((set, get) => ({
    isLoading: false,
    tourists: null,
    select: null,
    search: "",
    tourist: null,
    totalTourists: 0,
    currentPage: 0,
    statistics: null,

    setSearch: (search: string) => {
        set({ search });
    },

    fetchTourists: async (pagination: PaginationDto) => {
        set({ isLoading: true });

        try {
            const response = await touristClient.getAllTourists(pagination);

            set({
                tourists: response as any,
                isLoading: false
            });

        } catch (error) {
            console.error("Failed to fetch tourists:", error);
            set({ isLoading: false });
        }
    },

    setSelect: (tourist: Tourist) => {
        set({ select: tourist });
    },

    createTourist: async (data: any) => {
        set({ isLoading: true });
        try {
            await touristClient.createTourist(data);
            await get().fetchTourists({ page: get().currentPage, limit: 10 });
            set({ isLoading: false });
        } catch (error) {
            console.error("Failed to create tourist request:", error);
            set({ isLoading: false });
        }
    },

    updateTourist: async (id: string, data: Partial<Tourist>) => {
        set({ isLoading: true });
        try {
            await touristClient.updateTouristStatus(id, data as any);
            await get().fetchTourists({ page: get().currentPage, limit: 10 });
            set({ isLoading: false });
        } catch (error) {
            console.error("Failed to update tourist status:", error);
            set({ isLoading: false });
        }
    },

    deleteTourist: async (id: string) => {
        set({ isLoading: true });
        try {
            await touristClient.deleteTourist(id);
            await get().fetchTourists({ page: get().currentPage, limit: 10 });
            set({ isLoading: false });
        } catch (error) {
            console.error("Failed to delete tourist request:", error);
            set({ isLoading: false });
        }
    },

    getById: async (id: string) => {
        set({ isLoading: true });
        try {
            const result: any = await touristClient.getTouristById(id);
            set({
                tourist: result,
                isLoading: false,
            });
        } catch (error) {
            console.error("Failed to fetch tourist details:", error);
            set({ isLoading: false });
        }
    },

    compareTouristStatsByLocation: async () => {
        set({ isLoading: true });
        try {
            const result: any = await touristClient.compareTouristStatsByLocation();
            set({ isLoading: false, statistics: result });
        } catch (error) {
            console.error("Failed to compare tourist stats by location:", error);
            set({ isLoading: false });
        }
    },

    updateUserRegister: async (id: string, data: IUserRegister) => {
        set({ isLoading: true });
        try {
            await touristClient.updateUserRegister(id, data);

            // Sau khi update xong thì gọi lại getById để lấy dữ liệu mới nhất
            const result: any = await touristClient.getTouristById(id);
            set({
                tourist: result,
                isLoading: false
            });

        } catch (error) {
            console.error("Failed to update user register:", error);
            set({ isLoading: false });
        }
    }

}));
