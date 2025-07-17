import { Hono } from "hono";
import { 
    createSchedule, 
    getAllSchedules, 
    getScheduleById, 
    getSchedulesByTouristId,  // 🟢 Thêm hàm mới để lấy danh sách theo touristId
    updateSchedule, 
    deleteSchedule, 
} from "@/service/schedule.service";
import { checkAdminOrStaff, verifyToken } from "@/common/middleware/verifyToken";
const schedule = new Hono();

// 🟢 Thêm lịch trình mới
schedule.post("/", verifyToken,checkAdminOrStaff, async (c) => {
    try {
        const { touristId, roomId, time, title, content, organizer } = await c.req.json();

        if (!touristId || !roomId || !time || !title || !content || !organizer) {
            return c.json({ error: "Thiếu thông tin bắt buộc" }, 400);
        }

        const newSchedule = await createSchedule(touristId, roomId, time, title, content, organizer);
        return c.json(newSchedule);
    } catch (error: unknown) {
        return c.json({ error: error as Error }, 400);
    }
});

// 🟡 Lấy danh sách lịch trình (phân trang, tìm kiếm)
schedule.get("/", async (c) => {
    const data = {
        page: Number(c.req.query("page") || 1),
        limit: Number(c.req.query("limit") || 10),
        search: c.req.query("search") || "",
    };

    const schedules = await getAllSchedules(data);
    return c.json(schedules);
});

// 🔵 Lấy chi tiết lịch trình theo ID
schedule.get("/:id", async (c) => {
    try {
        const scheduleId = c.req.param("id");
        const schedule = await getScheduleById(scheduleId);
        return c.json(schedule);
    } catch (error: unknown) {
        return c.json({ error: error as Error }, 400);
    }
});

// 🟢 Lấy danh sách lịch trình theo touristId
schedule.get("/tourist/:touristId", async (c) => {
    try {
        const touristId = c.req.param("touristId");
        const schedules = await getSchedulesByTouristId(touristId);
        return c.json(schedules);
    } catch (error: unknown) {
        return c.json({ error: error as Error }, 400);
    }
});

// 🟠 Cập nhật lịch trình
schedule.put("/:id", verifyToken,checkAdminOrStaff, async (c) => {
    try {
        const scheduleId = c.req.param("id");
        const updates = await c.req.json();

        const updatedSchedule = await updateSchedule(scheduleId, updates);
        return c.json(updatedSchedule);
    } catch (error: unknown) {
        return c.json({ error: error as Error }, 400);
    }
});

// 🔴 Xóa lịch trình
schedule.delete("/:id", verifyToken,checkAdminOrStaff, async (c) => {
    try {
        const scheduleId = c.req.param("id");
        const result = await deleteSchedule(scheduleId);
        return c.json(result);
    } catch (error: unknown) {
        return c.json({ error: error as Error }, 400);
    }
});

export default schedule;
