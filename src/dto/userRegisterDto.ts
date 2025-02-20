import {UserRole, UserStatus} from "@/@types/users/user.enum";
import {PaginationDto} from "@/common/dto/pagination.dto";
import { addOnInfo } from "@/entities/user.entity";


export class UserRegisterDto {
    username:string;
    fullname:string;
    password:string;
}

export class UserLoginDto
{
    username:string;
    password:string;
}
export class UserUpdateDto
{
    fullname:string;
    longitude:string;
    latitude:string;
}



export class UserUpdateRoleDto
{
    role:number;
}

export class UserUpdateStatusDto
{
    status:UserStatus;
}

export class UserPaginationDto extends PaginationDto{
    role?:UserRole;
}

export class updateRoleDto {
    role : number;
    addOnInfo : addOnInfo
}