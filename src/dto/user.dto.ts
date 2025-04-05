import {UserRole, UserStatus} from "@/@types/users/user.enum";

export class UserRegisterDto {
    username:string;
    email:string;
    phone:string;
    password:string;
}

export class UserLoginDto
{
    username:string;
    password:string;
}
export class UserUpdateDto
{
}



