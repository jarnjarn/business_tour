import { create } from "zustand";
import { CreateScheduleDto, ScheduleClient, UpdateScheduleDto } from "@/clients/schedule.client";
import { PaginationDto } from "@/dto/pagination.dto";
import { Pagination } from "@/common/struct/pagination.struct";
import { User } from "@/@types/users/user.type";
import { Room } from "./room.state";

const scheduleClient = new ScheduleClient();

export interface Schedule {
    _id: string;
    tourist: string;
    room: Room;
    time: string;
    title: string;
    content: string;
    organizer: User;
    createdAt: string;
    updatedAt: string;
}

export interface ScheduleState {
    isLoading: boolean;
    schedules: Pagination<Schedule> | null;
    schedule: Schedule | null;
    select: Schedule | null;
    search: string;
    totalSchedules: number;
    currentPage: number;
    list:Schedule[]|[];
    setSearch: (search: string) => void;
    setSelect: (schedule: Schedule) => void;
    fetchSchedules: (pagination: PaginationDto) => Promise<void>;
    createSchedule: (data: CreateScheduleDto) => Promise<void>;
    updateSchedule: (id: string, data: UpdateScheduleDto) => Promise<void>;
    deleteSchedule: (id: string) => Promise<void>;
    getById: (id: string) => Promise<void>;
    getByIdTourist: (id: string) => Promise<void>;
}

export const useScheduleStore = create<ScheduleState>((set, get) => ({
    isLoading: false,
    schedules: null,
    schedule: null,
    select: null,
    search: "",
    totalSchedules: 0,
    currentPage: 1,
    list:[],

    setSearch: (search: string) => {
        set({ search });
    },

    fetchSchedules: async (pagination: PaginationDto) => {
        set({ isLoading: true });

        try {
            const response = await scheduleClient.getAllSchedules(pagination);
            set({
                schedules: response as any,
                isLoading: false
            });

        } catch (error) {
            console.error("Failed to fetch schedules:", error);
            set({ isLoading: false });
        }
    },

    setSelect: (schedule: Schedule) => {
        set({ select: schedule });
    },

    createSchedule: async (data: CreateScheduleDto) => {    
        set({ isLoading: true });
        try {
            await scheduleClient.createSchedule(data);
            await get().fetchSchedules({ page: get().currentPage, limit: 10 });
            set({ isLoading: false });
        } catch (error) {
            console.error("Failed to create schedule:", error);
            set({ isLoading: false });
        }
    },

    updateSchedule: async (id: string, data: UpdateScheduleDto) => {
        set({ isLoading: true });
        try {
            await scheduleClient.updateSchedule(id, data);
            await get().fetchSchedules({ page: get().currentPage, limit: 10 });
            set({ isLoading: false });
        } catch (error) {
            console.error("Failed to update schedule:", error);
            set({ isLoading: false });
        }
    },

    deleteSchedule: async (id: string) => {
        set({ isLoading: true });
        try {
            await scheduleClient.deleteSchedule(id);
            await get().fetchSchedules({ page: get().currentPage, limit: 10 });
            set({ isLoading: false });
        } catch (error) {
            console.error("Failed to delete schedule:", error);
            set({ isLoading: false });
        }
    },

    getById: async (id: string) => {
        set({ isLoading: true });
        try {
            const result: any = await scheduleClient.getScheduleById(id);
            set({
                schedule: result,
                isLoading: false,
            });
        } catch (error) {
            set({ isLoading: false });
        }
    },
    getByIdTourist: async (id: string) => {
        set({ isLoading: true });
        try {
            const result: any = await scheduleClient.getScheduleByIdTourist(id);
            set({
                list: result,
                isLoading: false,
            });
        } catch (error) {
            set({ isLoading: false });
        }
    },
    
}));
