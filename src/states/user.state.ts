import { User } from "@/@types/users/user.type";
import { UpdatePassWordDto, UserClient } from "@/clients/user.client";
import { Pagination } from "@/common/struct/pagination.struct";
import { PaginationDto } from "@/dto/pagination.dto";
import { create } from "zustand";

const userClient = new UserClient();

export interface UserState {
    isLoading: boolean;
    users: Pagination<User> | null;
    select: User | null;

    setSelect: (user: User) => void;
    fetchUsers: (pagination: PaginationDto) => Promise<void>;
    deleteUser: (id: string) => Promise<void>;
    updateUser: (id: string, data: Partial<User>) => Promise<void>;
    changePassword: (id: string, data: UpdatePassWordDto) => Promise<void>;

}

export const useUserStore = create<UserState>((set, get) => ({
    isLoading: false,
    users: null,
    select: null,

    setSelect: (user: User) => {
        set({ select: user });
    },

    fetchUsers: async (pagination: PaginationDto) => {
        set({ isLoading: true });
        try {
            const response = await userClient.getAllUsers(pagination);
            set({ users: response as any, isLoading: false }); // Lấy response.data thay vì response
        } catch (error) {
            console.error("Failed to fetch users:", error);
            set({ isLoading: false });
        }
    },
    deleteUser: async (id: string) => {
        set({ isLoading: true });
        try {
            await userClient.deleteUser(id);
            await get().fetchUsers({ page: 1, limit: 10 });
        } catch (error) {
            set({ isLoading: false });
        }
    },
    updateUser: async (id: string, data: Partial<User>) => {
        set({ isLoading: true });
        try {
            await userClient.updateUser(id,data as any);
            await get().fetchUsers({ page: 1, limit: 10 });
        } catch (error) {
            set({ isLoading: false });
        }
    },
    changePassword: async (id: string, data: UpdatePassWordDto) => {
        set({ isLoading: true });
        try {
            await userClient.changePassword(id,data);
        } catch (error) {
            set({ isLoading: false });
        }
    }
}));
