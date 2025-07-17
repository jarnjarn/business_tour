import { Hono } from "hono";
import { createNotification, getNotifications, markNotificationAsRead, markAllNotificationsAsRead, createNotificationByStaff } from "@/service/noti.service";
import { verifyToken } from "@/common/middleware/verifyToken";
import { EnvWithUser } from "@/@types/hono";
const noti = new Hono<EnvWithUser>();

// 🟢 Tạo thông báo mới
noti.post("/", verifyToken, async (c) => {
    try {
        const userId = c.get("user").id;
        const {  title, content } = await c.req.json();
        if (!userId || !title || !content) return c.json({ error: "Thiếu thông tin bắt buộc" }, 400);

        const newNoti = await createNotification(userId, title, content);
        return c.json(newNoti);
    } catch (error: unknown) {
        return c.json({ error: error as Error }, 400);
    }
});

noti.post("/staff", verifyToken, async (c) => {
    try {
        const userId = c.get("user").id;
        const {  title, content,receiverId } = await c.req.json();
        if (!userId || !title || !content) return c.json({ error: "Thiếu thông tin bắt buộc" }, 400);

        const newNoti = await createNotificationByStaff(userId,receiverId, title, content);
        return c.json(newNoti);
    } catch (error: unknown) {
        return c.json({ error: error as Error }, 400);
    }
});

// 🟡 Lấy danh sách thông báo (mặc định lấy 10 cái mới nhất)
noti.get("/", verifyToken, async (c) => {
    const userId = c.get("user").id;
    const page = Number(c.req.query("page") || 1);
    const limit = Number(c.req.query("limit") || 1);
    const notifications = await getNotifications(userId as string, page,limit);
    return c.json(notifications);
});

// 🔵 Cập nhật trạng thái thông báo đã đọc
// 🟠 Đánh dấu tất cả thông báo đã đọc
noti.put("/readall", verifyToken, async (c) => {
    try {
        const userId = c.get("user").id;
        await markAllNotificationsAsRead(userId as string);
        return c.json({ message: "Tất cả thông báo đã được đánh dấu là đã đọc" });
    } catch (error: unknown) {
        return c.json({ error: error as Error }, 400);
    }
});
noti.put("read/:id", verifyToken, async (c) => {
    try {
        const notificationId = c.req.param("id");
        const updatedNoti = await markNotificationAsRead(notificationId);
        return c.json(updatedNoti);
    } catch (error: unknown) {
        return c.json({ error: error as Error }, 400);
    }
});

export default noti;
