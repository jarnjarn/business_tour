import { create } from 'zustand'
import { UserClient } from "@/clients/user.client";
import { message } from "antd";
import { CookieUtil } from "@/common/utils/cookie.util";
import { User } from '@/@types/users/user.type';
import { UserLoginDto, UserRegisterDto } from '@/dto/user.dto';


const userClient = new UserClient();

interface AuthStore {
    isLoading: boolean,
    auth: User | null,
    loading: (cb: () => Promise<void>, error?: (e: Error) => void) => void,
    register: (data: UserRegisterDto) => void
    login: (data: UserLoginDto) => void
    logout: () => void
    fetchMe: () => Promise<void>

}


export const useAuthStore = create<AuthStore>((set, get) => ({
    isLoading: false,
    auth: null,
    loading: async (cb, err) => {
        set({ isLoading: true })
        try {
            await cb()
        } catch (e) {
            if (err) {
                err(e as Error)
            }
        }
        set({ isLoading: false })
    },
    register: async (data) => {
        get().loading(async () => {

            try {
                await userClient.register(data)
                alert("Đăng ký thành công")
                setTimeout(() => {
                    window.location.replace("/login")
                }, 1000)
            } catch (error: any) {
                alert("Tài khoản, Email đã tồn tại")
            }

        })
    },
    login: async (data) => {
        get().loading(async () => {
            try {
                const res = await userClient.login(data);
                CookieUtil.setCookie("token", res?.token);
                await get().fetchMe(); 
                setTimeout(() => {
                    window.location.replace("/");
                }, 1000);
            } catch (error) {
                console.log(error);
            }
        });
    },
    fetchMe: async () => {
        get().loading(async () => {
            try {
                const res = await userClient.getMe();
                set({ auth: res as any}); // Cập nhật trạng thái auth
            } catch (error) {
                console.log("Lỗi khi lấy thông tin người dùng:", error);
                CookieUtil.removeCookie("token")
                set({ auth: null }); // Xóa trạng thái nếu có lỗi
            }
        });
    },

    logout: () => {
        CookieUtil.removeCookie("token")
        set({ auth: null })
    }
}))