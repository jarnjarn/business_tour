import { User } from "@/models/user.model";
import { UserRole, UserStatus } from "@/@types/users/user.enum";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Types } from "mongoose"; // Để kiểm tra ObjectId hợp lệ
import { PaginationDto } from "@/dto/pagination.dto";
import { Pagination } from "@/common/struct/pagination.struct";

const SECRET = process.env.JWT_SECRET || "mysecretkey"; // Thay bằng giá trị thực tế

export const registerUser = async (username: string, email: string, password: string, phone: string) => {
  //  Kiểm tra xem email hoặc phone đã tồn tại chưa
  const existingUser = await User.findOne({
    $or: [{ username }, { email }]
  });

  if (existingUser) {
    if (existingUser.email === email) throw new Error("Email đã tồn tại");
    if (existingUser.username === username) throw new Error("Tài khoản đã tồn tại");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    username,
    email,
    phone,
    password: hashedPassword,
    role: UserRole.USER,
    status: UserStatus.ACTIVE,
  });

  await newUser.save();

  // Chuyển về object và xóa password trước khi trả về
  const userWithoutPassword = newUser.toObject();
  delete userWithoutPassword.password;

  return userWithoutPassword;
};


export const loginUser = async (username: string, password: string) => {
  const user = await User.findOne({ username });
  if (!user) throw new Error("Invalid credentials");

  // Kiểm tra xem user có bị khóa không
  if (user.status === UserStatus.LOCK) {
    throw new Error("Your account is locked.");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  const token = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    SECRET,
    { expiresIn: "3h" }
  );

  return { data: { token, user } };
};

export const getUserById = async (userId: string) => {
  if (!Types.ObjectId.isValid(userId)) throw new Error("Invalid user ID");

  const user = await User.findById(userId).select("-password"); // Ẩn password
  if (!user) throw new Error("User not found");

  return user;
};

export const getAllUsers = async (data: PaginationDto & { search?: string }) => {
  const skip = Math.max(0, (data.page - 1) * data.limit);

  // Tạo điều kiện tìm kiếm (nếu có)
  const query: any = {};
  if (data.search) {
    query.$or = [
      { username: { $regex: data.search, $options: "i" } }, // Tìm theo tên (không phân biệt hoa thường)
      { email: { $regex: data.search, $options: "i" } }, // Tìm theo email
    ];
  }

  // Lấy danh sách người dùng theo điều kiện tìm kiếm
  const users = await User.find(query)
    .select("-password") // Ẩn password
    .skip(skip)
    .limit(data.limit)
    .lean();

  // Đếm tổng số user theo điều kiện tìm kiếm
  const totalUsers = await User.countDocuments(query);

  // Trả về dữ liệu theo cấu trúc `Pagination`
  return new Pagination(users, data.page, data.limit, totalUsers, data.search || "");
};


export const deleteUser = async (userId: string) => {
  if (!Types.ObjectId.isValid(userId)) throw new Error("Invalid user ID");

  const user = await User.findByIdAndDelete(userId);
  if (!user) throw new Error("User not found");

  return { message: "User deleted successfully" };
};

export const getMe = async (userId: string) => {
  console.log(userId)
  if (!Types.ObjectId.isValid(userId)) throw new Error("Invalid user ID");

  const user = await User.findById(userId).select("-password");
  if (!user) throw new Error("User not found");

  return user;
};

export const updateUser = async (
  userId: string,
  updates: { email?: string; phone?: string; role?: UserRole }
) => {
  if (!Types.ObjectId.isValid(userId)) throw new Error("Invalid user ID");

  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  // Kiểm tra email đã tồn tại chưa
  if (updates.email && updates.email !== user.email) {
    const existingEmail = await User.findOne({ email: updates.email });
    if (existingEmail) throw new Error("Email đã tồn tại");
  }

  // Cập nhật thông tin
  if (updates.email) user.email = updates.email;
  if (updates.phone) user.phone = updates.phone;
  if (updates.role) user.role = updates.role;

  await user.save();

  return user;
};

export const changePassword = async (
  userId: string,
  oldPassword: string,
  newPassword: string
) => {
  if (!Types.ObjectId.isValid(userId)) throw new Error("Invalid user ID");

  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  // Kiểm tra mật khẩu cũ
  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) throw new Error("Mật khẩu cũ không chính xác");

  // Hash mật khẩu mới
  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  return { message: "Đổi mật khẩu thành công" };
};


