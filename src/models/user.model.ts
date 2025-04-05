import { UserRole, UserStatus } from "@/@types/users/user.enum";
import mongoose, { Schema, Document } from "mongoose";

interface IUser extends Document {
  username: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
  status: UserStatus;
}

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: Object.values(UserRole),
    required: true,
    default: UserRole.USER
  },
  status: { 
    type: String, 
    enum: Object.values(UserStatus), 
    required: true, 
    default: UserStatus.ACTIVE 
  }
});

// Kiểm tra nếu model đã tồn tại, tránh bị overwrite
export const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
