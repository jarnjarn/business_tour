import { create } from "zustand";
import { LocationClient } from "@/clients/location.client";
import { PaginationDto } from "@/dto/pagination.dto";
import { Pagination } from "@/common/struct/pagination.struct";

const locationClient = new LocationClient();

export interface Location {
    _id: string;
    name: string;
    image: string;
    description: string;
    address: string;
}

export interface LocationState {
    isLoading: boolean;
    locations: Pagination<Location>|null;
    location: Location | null
    select: Location | null;
    search: string;
    totalLocations: number;
    currentPage: number;
    setSearch: (search: string) => void;
    setSelect: (location: Location) => void;
    fetchLocations: (pagination: PaginationDto) => Promise<void>;
    createLocation: (data: any) => Promise<void>;
    updateLocation: (id: string, data: Partial<Location>) => Promise<void>;
    deleteLocation: (id: string) => Promise<void>;
    getById: (id: string) => Promise<void>;
}

export const useLocationStore = create<LocationState>((set, get) => ({
    isLoading: false,
    locations: null,
    select: null,
    search: "",
    location: null,
    totalLocations: 0,
    currentPage: 0,

    setSearch: (search: string) => {
        set({ search });
    },

    fetchLocations: async (pagination: PaginationDto) => {
        set({ isLoading: true });

        try {
            const response = await locationClient.getAllLocations(pagination);

            set({
                locations: response as any,
                isLoading: false
            });

        } catch (error) {
            set({ isLoading: false });
        }
    },

    setSelect: (location: Location) => {
        set({ select: location });
    },

    createLocation: async (data: any) => {
        set({ isLoading: true });
        try {
            await locationClient.createLocation(data);
            await get().fetchLocations({ page: get().currentPage, limit: 10 });
            set({  isLoading: false });
        } catch (error) {
            set({ isLoading: false });
        }
    },

    updateLocation: async (id: string, data: Partial<Location>) => {
        set({ isLoading: true });
        try {
            await locationClient.updateLocation(id, data);
            await get().fetchLocations({ page: get().currentPage, limit: 10 }); // Gọi lại API để lấy dữ liệu mới
            set({ isLoading: false });
        } catch (error) {
            set({ isLoading: false });
        }
    },



    deleteLocation: async (id: string) => {
        set({ isLoading: true });
        try {
            await locationClient.deleteLocation(id);
            await get().fetchLocations({ page: get().currentPage, limit: 10 });
            set({
                isLoading: false,
            });
        } catch (error) {
            set({ isLoading: false });
        }
    },
    getById: async (id: string) => {
        try {
            const result: any = await locationClient.getLocationById(id);
            set({
                location: result,
                isLoading: false,
            });
        } catch (error) {
            set({ isLoading: false });
        }
    }

}));
