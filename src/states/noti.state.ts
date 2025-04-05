import { User } from "@/@types/users/user.type";
import { CreateNotiByStaffDto, CreateNotiDto, notiClient, UpdateNotiStatusDto } from "@/clients/noti.client";
import { PaginationDto } from "@/dto/pagination.dto";
import { create } from "zustand";

const NotiClient = new notiClient();

export interface Noti {
    _id: string;
    sender: User,
    receiver: User,
    title: string;
    content: string;
    status:boolean;
}

export interface NotiState {
    isLoading: boolean,
    select: Noti | null,
    list: Noti[] | [],
    setSelect: (noti: Noti) => void;
    createNoti: (data: CreateNotiDto) => Promise<void>;
    createNotiByStaff: (data: CreateNotiByStaffDto) => Promise<void>;
    updateStatusNoti: (data: UpdateNotiStatusDto) => Promise<void>;
    updateStatusAllNoti: () => Promise<void>;
    getNoti: (pagination: PaginationDto) => Promise<void>;
}

export const useNotiStore = create<NotiState>((set, get) => ({
    isLoading: false,
    select: null,
    list: [],

    setSelect: (noti: Noti) => {
        set({ select: noti });
    },

    createNoti: async (data: CreateNotiDto) => {
        set({ isLoading: true });
        try {
            await NotiClient.createNoti(data);
            set({ isLoading: false });
        } catch (error) {
            set({ isLoading: false });
        }
    },
    createNotiByStaff: async (data: CreateNotiByStaffDto) => {
        set({ isLoading: true });
        try {
            await NotiClient.createNotiByStaff(data);
            set({ isLoading: false });
        } catch (error) {
            set({ isLoading: false });
        }
    },
    getNoti: async (pagination: PaginationDto) => {
        set({ isLoading: true });
        try {
            const result: any = await NotiClient.getNotiList(pagination)
            set({
                list: result.data,
                isLoading: false
            })
        } catch (error) {
            set({ isLoading: false });
        }
    },
    updateStatusNoti: async (data: UpdateNotiStatusDto) => {
        set({ isLoading: true });
        try {
            await NotiClient.updateNotiStatus(data);
            await get().getNoti({page:1,limit:10} );
            set({ isLoading: false });
        } catch (error) {
            set({ isLoading: false });
        }
    },
    updateStatusAllNoti:async ()=>{
        set({ isLoading: true });
        try {
            await NotiClient.updateAllNotiStatus();
            await get().getNoti({page:1,limit:10} );
            set({ isLoading: false });
        } catch (error) {
            set({ isLoading: false });
        }
    }

}));
