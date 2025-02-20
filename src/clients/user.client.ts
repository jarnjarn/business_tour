import type {UserController} from "@/controllers/user.controller";
import type {User} from "@/entities/user.entity";
import type {UserLoginDto, UserRegisterDto, UserUpdateDto, UserUpdateRoleDto} from "@/dto/users/userRegisterDto";
import {RestBase} from "@/common/base/rest.base";
import axiosClient from "@/clients/axios";
import type {ResultType} from "@/@types/common.type";

export class UserClient extends RestBase<User>(axiosClient,"/users")
{
    login(data:UserLoginDto):ResultType<UserController['login']>
    {
        return this.axios.post("/api/users/login",data);
    }

    register(data:UserRegisterDto):ResultType<UserController['register']> {
        return this.axios.post("/api/users/register", data);
    }

    getMe():ResultType<UserController['me']> {
        return this.axios.get("/api/users/me");
    }

    updateMe(data:Partial<UserUpdateDto>):ResultType<UserController['updateMe']> {
        return this.axios.put("/api/users/me", data);
    }

    updateRole(id:number,data:UserUpdateRoleDto):ResultType<UserController['updateRole']> {
        return this.axios.put(`/api/users/${id}/role`, data);
    }

    updateStatus(id:number,data:UserUpdateRoleDto):ResultType<UserController['updateStatus']> {
        return this.axios.put(`/api/users/${id}/status`, data);
    }

    updateAvatar(data:FormData):Promise<User> {
        return this.axios.putForm(`/api/users/me/avatar`, data);
    }
}
