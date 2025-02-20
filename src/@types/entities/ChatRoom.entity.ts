import {EntityBase} from "@/common/base/entity.base";
import { Message } from "./message.entity";
import {User} from "@/entities/user.entity";

export class ChatRoom extends EntityBase
{
    isGroup:boolean
    messages: Message[]
    lastMessage:Message
    users: User[];
    isBlocked:boolean;
    displayName:string;
}