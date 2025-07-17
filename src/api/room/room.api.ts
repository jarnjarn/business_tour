import { Hono } from "hono";
import { checkAdminOrStaff, verifyToken } from "@/common/middleware/verifyToken";
import { createRoom, deleteRoom, getAllRooms, getRoomById, getRoomsByLocationId, updateRoom, updateRoomImg } from "@/service/room.service";

const room = new Hono();

// 🟢 Thêm lịch trình mới
room.post("/", verifyToken, checkAdminOrStaff, async (c) => {
    try {
        const { name, description, capacity, location } = await c.req.json();

        if (!name || !description || !capacity || !location) {
            return c.json({ error: "Thiếu thông tin bắt buộc" }, 400);
        }

        const newRoom = await createRoom(name, description, capacity, location);
        return c.json(newRoom);
    } catch (error: unknown) {
        return c.json({ error: error as Error }, 400);
    }
});

// 🟡 Lấy danh sách lịch trình (phân trang, tìm kiếm)
room.get("/", async (c) => {
    const data = {
        page: Number(c.req.query("page") || 1),
        limit: Number(c.req.query("limit") || 10),
        search: c.req.query("search") || "",
    };

    const rooms = await getAllRooms(data);
    return c.json(rooms);
});

// 🔵 Lấy chi tiết lịch trình theo ID
room.get("/:id", async (c) => {
    try {
        const roomId = c.req.param("id");
        const room = await getRoomById(roomId);
        return c.json(room);
    } catch (error: unknown) {
        return c.json({ error: error as Error }, 400);
    }
});

// 🟢 Lấy danh sách lịch trình theo touristId
room.get("/location/:locationId", async (c) => {
    try {
        const locationId = c.req.param("locationId");
        if (!locationId) {
            return c.json({ error: "Thiếu thông tin bắt buộc" }, 400);
        }
        const rooms = await getRoomsByLocationId(locationId);
        return c.json(rooms);
    } catch (error: unknown) {
        return c.json({ error: error as Error }, 400);
    }
});

// 🟠 Cập nhật lịch trình
room.put("/:id", verifyToken, checkAdminOrStaff, async (c) => {
    try {
        const roomId = c.req.param("id");
        const updates = await c.req.json();

        const updatedRoom = await updateRoom(roomId, updates);
        return c.json(updatedRoom);
    } catch (error: unknown) {
        return c.json({ error: error as Error }, 400);
    }
});

// 🔴 Xóa lịch trình
room.delete("/:id", verifyToken, checkAdminOrStaff, async (c) => {
    try {
        const roomId = c.req.param("id");
        const result = await deleteRoom(roomId);
        return c.json(result);
    } catch (error: unknown) {
        return c.json({ error: error as Error }, 400);
    }
});

// 🟠 Cập nhật ảnh QrCode
room.put("/:id/image", verifyToken, checkAdminOrStaff, async (c) => {
    try {
        const roomId = c.req.param("id");
        const formData = await c.req.formData(); // ✅ Lấy FormData đúng cách
        const image = formData.get("image") as File;
        if (!image) throw new Error("Không có ảnh được gửi lên");

        const buffer = await image.arrayBuffer();
        const base64Image = Buffer.from(buffer).toString("base64");
        const cloudinaryUrl = `data:${image.type};base64,${base64Image}`;

        const updatedRoom = await updateRoomImg(roomId, cloudinaryUrl);
        return c.json(updatedRoom);
    } catch (error: unknown) {
        return c.json({ error: error as Error }, 400);
    }
});

export default room;
