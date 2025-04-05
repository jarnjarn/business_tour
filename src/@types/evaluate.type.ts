import { Location } from "./location.type";
import { User } from "./users/user.type";

export interface Evaluate {
    _id: string;
    location: Location;
    user: User;
    star: number;
    content: string;
    createdAt: string;
    updatedAt: string;
}