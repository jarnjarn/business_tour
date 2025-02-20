import {EntityBase} from "@/common/base/entity.base";
import {Rank, TagUser, UserRole, UserStatus} from "@/@types/users/user.enum";


export class User extends EntityBase
{
    public username: string;
    public password: string;
    public phone: string;
    fullname:string;
    public role:UserRole
    public status:UserStatus;
}