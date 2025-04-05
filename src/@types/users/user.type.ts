import { UserRole, UserStatus } from "@/@types/users/user.enum";

export interface User {
  _id: string;
  username: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
}
