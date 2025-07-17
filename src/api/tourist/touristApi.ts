import { Hono } from "hono";
import { 
    createTouristRequest, 
    getAllTouristRequests, 
    getTouristById, 
    updateTouristStatus, 
    deleteTouristRequest, 
    compareTouristStatsByLocation,
    updateUserRegister
} from "@/service/tourist.service";
import { checkAdminOrStaff, verifyToken } from "@/common/middleware/verifyToken";
import { EnvWithUser } from "@/@types/hono";

const tourist = new Hono<EnvWithUser>();


// 🟢 Tạo yêu cầu du lịch mới
tourist.post("/", verifyToken, async (c) => {
    try {
        const { locationId,totalPeople, form, to } = await c.req.json();
        const userId = c.get("user").id; // Lấy user từ token

        if (!locationId || !form || !to) {
            return c.json({ error: "Thiếu thông tin bắt buộc" }, 400);
        }

        const newRequest = await createTouristRequest(userId, locationId,totalPeople, new Date(form), new Date(to));
        return c.json(newRequest);
    } catch (error: any) {
        return c.json({ error: error.message }, 400);
    }
});
tourist.get("/compare", verifyToken,checkAdminOrStaff, async (c) => {
    const result = await compareTouristStatsByLocation();
    return c.json(result);
});

// 🟡 Lấy danh sách yêu cầu du lịch (phân trang, tìm kiếm)
tourist.get("/", async (c) => {
    const data = {
        page: Number(c.req.query("page") || 1),
        limit: Number(c.req.query("limit") || 10),
        search: c.req.query("search") || "",
    };

    const tourists = await getAllTouristRequests(data);
    return c.json(tourists);
});

// 🔵 Lấy chi tiết một yêu cầu du lịch
tourist.get("/:id", async (c) => {
    try {
        const touristId = c.req.param("id");
        const tourist = await getTouristById(touristId);
        return c.json(tourist);
    } catch (error: any) {
        return c.json({ error: error.message }, 400);
    }
});

// 🟠 Cập nhật trạng thái yêu cầu du lịch (chỉ Admin/Staff có thể duyệt)
tourist.put("/:id", verifyToken,checkAdminOrStaff, async (c) => {
    try {
        const touristId = c.req.param("id");
        const { status,totalPeople, note } = await c.req.json();
        const staffId = c.get("user").id; // Lấy ID nhân viên duyệt từ token

        const updatedTourist = await updateTouristStatus(touristId, status, totalPeople,staffId, note);
        return c.json(updatedTourist);
    } catch (error: any) {
        return c.json({ error: error.message }, 400);
    }
});

// 🔴 Xóa yêu cầu du lịch
tourist.delete("/:id", verifyToken,checkAdminOrStaff, async (c) => {
    try {
        const touristId = c.req.param("id");
        const result = await deleteTouristRequest(touristId);
        return c.json(result);
    } catch (error: any) {
        return c.json({ error: error.message }, 400);
    }
});


// 🟢 Đăng ký lịch trình
tourist.post("/register/:id", verifyToken, async (c) => {
    try {
        const touristId = c.req.param("id");
        const user = await c.req.json();
        const result = await updateUserRegister(touristId, user);
        return c.json(result);
    } catch (error: any) {
        return c.json({ error: error.message }, 400);
    }
});


export default tourist;
