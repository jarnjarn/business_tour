import { create } from "zustand";
import { PaginationDto } from "@/dto/pagination.dto";
import { Pagination } from "@/common/struct/pagination.struct";
import { CreateRoomDto, RoomClient, UpdateRoomDto } from "@/clients/room.client";
import { RoomStatus } from "@/@types/room/room.enum";

const roomClient = new RoomClient();

export interface Room    {
    _id: string;
    name: string;
    description: string;
    capacity: number;
    status: RoomStatus;
    location: string;
    QrCode: string;
    organizer: string;
    createdAt: string;
    updatedAt: string;
}

export interface RoomState {
    isLoading: boolean;
    rooms: Pagination<Room> | null;
    room: Room | null;
    select: Room | null;
    search: string;
    totalRooms: number;
    currentPage: number;
    list:Room[]|[];
    setSearch: (search: string) => void;
    setSelect: (room: Room) => void;
    fetchRooms: (pagination: PaginationDto) => Promise<void>;
    createRoom: (data: CreateRoomDto) => Promise<void>;
    updateRoom: (id: string, data: UpdateRoomDto) => Promise<void>;
    deleteRoom: (id: string) => Promise<void>;
    getById: (id: string) => Promise<void>;
    getByLocationId: (id: string) => Promise<void>;
    updateRoomImg: (id: string, data: FormData) => Promise<void>;
}

export const useRoomStore = create<RoomState>((set, get) => ({
    isLoading: false,
    rooms: null,
    room: null,
    select: null,
    search: "",
    totalRooms: 0,
    currentPage: 1,
    list:[],

    setSearch: (search: string) => {
        set({ search });
    },

    
    setSelect: (room: Room) => {
        set({ select: room });
    },

    fetchRooms: async (pagination: PaginationDto) => {
        set({ isLoading: true });

        try {
            const response = await roomClient.getAllRooms(pagination);
            set({
                rooms: response as any,
                isLoading: false
            });

        } catch (error) {
            console.error("Failed to fetch rooms:", error);
            set({ isLoading: false });
        }
    },


    createRoom: async (data: CreateRoomDto) => {
        set({ isLoading: true });
        try {
            await roomClient.createRoom(data);
            await get().fetchRooms({ page: get().currentPage, limit: 10 });
            set({ isLoading: false });
        } catch (error) {
            console.error("Failed to create room:", error);
            set({ isLoading: false });
        }
    },

    updateRoom: async (id: string, data: UpdateRoomDto) => {
        set({ isLoading: true });
        try {
            await roomClient.updateRoom(id, data);
            await get().fetchRooms({ page: get().currentPage, limit: 10 });
            set({ isLoading: false });
        } catch (error) {
            console.error("Failed to update room:", error);
            set({ isLoading: false });
        }
    },

    deleteSchedule: async (id: string) => {
        set({ isLoading: true });
        try {
            await roomClient.deleteRoom(id);
            await get().fetchRooms({ page: get().currentPage, limit: 10 });
            set({ isLoading: false });
        } catch (error) {
            console.error("Failed to delete room:", error);
            set({ isLoading: false });
        }
    },

    getById: async (id: string) => {
        set({ isLoading: true });
        try {
            const result: any = await roomClient.getRoomById(id);
            set({
                room: result,
                isLoading: false,
            });
        } catch (error) {
            set({ isLoading: false });
        }
    },
    getByLocationId: async (id: string) => {
        set({ isLoading: true });
        try {
            console.log(id)
            const result: any = await roomClient.getRoomByLocationId(id);
            set({
                list: result,
                isLoading: false,
            });
        } catch (error) {
            set({ isLoading: false });
        }
    },
    deleteRoom: async (id: string) => {
        set({ isLoading: true });
        try {
            await roomClient.deleteRoom(id);
            await get().fetchRooms({ page: get().currentPage, limit: 10 });
        } catch (error) {
            set({ isLoading: false });
        }
    },
    updateRoomImg: async (id: string, data: FormData) => {
        set({ isLoading: true });
        try {
            await roomClient.updateRoomImg(id, data);
            await get().getById(id);
            set({ isLoading: false });
        } catch (error) {
            set({ isLoading: false });
        }
    }
}));
