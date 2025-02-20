import {User} from "@/entities/user.entity";
import {ChatRoom} from "@/@types/entities/ChatRoom.entity";
import {EntityBase} from "@/common/base/entity.base";

export class Message extends EntityBase
{
    content: string;
    chatRoom: ChatRoom;
    type: string; // text | image
    user: User;
    userRead: User[];
}

export class Messages extends EntityBase
{
    content: string;
    chatRoom: ChatRoom[];
    type: string; // text | image
    user: User;
    userRead: User[];
}