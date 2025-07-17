import { Hono } from "hono";
import {
  getUserById,
  getAllUsers,
  deleteUser,
  registerUser,
  loginUser,
  getMe,
  updateUser,
  changePassword,
} from "@/service/user.service";
import { checkAdminOrStaff, verifyToken } from "@/common/middleware/verifyToken";
import { EnvWithUser } from "@/@types/hono";

const user = new Hono<EnvWithUser>();

// Đăng ký user
user.post("/register", async (c) => {
  try {
    const { username, email, password, phone } = await c.req.json();
    const result = await registerUser(username, email, password, phone);
    return c.json(result);
  } catch (error: any) {
    console.error("Error in register:", error);
    return c.json({ error: error.message || "Something went wrong" }, 400);
  }
});

// Đăng nhập user
user.post("/login", async (c) => {
  try {
    const { username, password } = await c.req.json();
    const result = await loginUser(username, password);
    return c.json(result);
  } catch (error: any) {
    return c.json({ error: error.message || "Invalid credentials" }, 400);
  }
});

// Lấy danh sách tất cả user (chỉ ADMIN & STAFF)
user.get("/", verifyToken, checkAdminOrStaff, async (c) => {
  const data = {
    page: Number(c.req.query("page") || 1),
    limit: Number(c.req.query("limit") || 10),
    search: c.req.query("search") || "", // Lấy từ query nếu có
  };

  const users = await getAllUsers(data);

  return c.json(users);
});

// Lấy thông tin user hiện tại từ token
user.get("/me", verifyToken, async (c) => {
  try {
    const userId = c.get("user").id; // userId được lấy từ middleware `verifyToken`
    const user = await getMe(userId);
    return c.json(user);
  } catch (error: any) {
    return c.json({ error: error.message }, 400);
  }
});

// Lấy user theo ID
user.get("/:id", verifyToken, async (c) => {
  try {
    const userId = c.req.param("id");
    const user = await getUserById(userId);
    return c.json(user);
  } catch (error: any) {
    return c.json({ error: error.message }, 400);
  }
});

// Cập nhật thông tin user (chỉ chủ tài khoản hoặc ADMIN)
user.put("/:id", verifyToken,checkAdminOrStaff, async (c) => {
  try {
    const userId = c.req.param("id");

    const updates = await c.req.json();
    const updatedUser = await updateUser(userId, updates);
    return c.json(updatedUser);
  } catch (error: any) {
    return c.json({ error: error.message }, 400);
  }
});

// Đổi mật khẩu (chỉ chủ tài khoản)
user.put("/:id/change-password", verifyToken, async (c) => {
  try {
    const userId = c.req.param("id");
    const { oldPassword, newPassword } = await c.req.json();
    const result = await changePassword(userId, oldPassword, newPassword);
    return c.json(result);
  } catch (error: any) {
    return c.json({ error: error.message }, 400);
  }
});

// Xóa user theo ID (chỉ ADMIN & STAFF)
user.delete("/:id", verifyToken, checkAdminOrStaff, async (c) => {
  try {
    const userId = c.req.param("id");
    const result = await deleteUser(userId);
    return c.json(result);
  } catch (error: any) {
    return c.json({ error: error.message }, 400);
  }
});

export default user;
