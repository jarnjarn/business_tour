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
        set({ isLoading: true });
        try {
            return await cb(); // ✅ return kết quả để hàm ngoài nhận được
        } catch (e) {
            if (err) {
                err(e as Error);
            }
            throw e; // ✅ throw lại lỗi để `login()` biết lỗi và ném ra component
        } finally {
            set({ isLoading: false });
        }
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
        await get().loading(async () => {
            try {
                const res = await userClient.login(data);
                // Kiểm tra nếu không có token thì ném lỗi
                if (!res?.data?.token) {
                    throw new Error("Token không tồn tại");
                }

                CookieUtil.setCookie("token", res.data.token);
                await get().fetchMe();
                setTimeout(() => {
                    window.location.replace("/");
                }, 1000);
            } catch (error) {
                throw error; // <--- BẮT BUỘC phải throw lại để component nhận biết là lỗi
            }
        });
    },

    fetchMe: async () => {
        get().loading(async () => {
            try {
                const res = await userClient.getMe();
                set({ auth: res as any }); // Cập nhật trạng thái auth
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