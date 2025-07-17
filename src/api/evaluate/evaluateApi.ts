import { Hono } from "hono";
import { checkAdminOrStaff, verifyToken } from "@/common/middleware/verifyToken";
import { createEvaluate, deleteEvaluate, getAllEvaluates, getEvaluateById, getEvaluateByIdLocation, updateEvaluate } from "@/service/evaluate.service";
import { EvaluateCreateDto } from "@/dto/evaluate.dto";
import { EnvWithUser } from "@/@types/hono";

const evaluate = new Hono<EnvWithUser>();
// 🟢 Thêm lịch trình mới
evaluate.post("/", verifyToken, async (c) => {
    try {
        const { location ,star, content } = await c.req.json();
        const user = (c.get("user") as { id: string }).id;

        if (!location || !star || !content) {
            return c.json({ error: "Thiếu thông tin bắt buộc" }, 400);
        }
        const data : EvaluateCreateDto= {
            location, user, star, content
        }

        const newEvaluate = await createEvaluate(data);
        return c.json(newEvaluate);
    } catch (error: unknown) {
            return c.json({ error: error as Error }, 400);
    }
});

evaluate.get("/", async (c) => {
    const data = {
        page: Number(c.req.query("page") || 1),
        limit: Number(c.req.query("limit") || 10),
        query: c.req.query("query") || "",
    };

    const Evaluates = await getAllEvaluates(data);
    return c.json(Evaluates);
});

evaluate.get("/:id", async (c) => {
    try {
        const EvaluateId = c.req.param("id");
        const Evaluate = await getEvaluateById(EvaluateId);
        return c.json(Evaluate);
    } catch (error: unknown) {
        return c.json({ error: error as Error }, 400);
    }
});

evaluate.get("/location/:locationID", async (c) => {
    try {
        const locationID = c.req.param("locationID");
        const Evaluates = await getEvaluateByIdLocation(locationID);
        return c.json(Evaluates);
    } catch (error: unknown) {
        return c.json({ error: error as Error }, 400);
    }
});

evaluate.put("/:id", verifyToken, async (c) => {
    try {
        const EvaluateId = c.req.param("id");
        const updates = await c.req.json();

        const updatedEvaluate = await updateEvaluate(EvaluateId, updates);
        return c.json(updatedEvaluate);
    } catch (error: unknown) {
        return c.json({ error: error as Error }, 400);
    }
});

evaluate.delete("/:id", verifyToken, checkAdminOrStaff, async (c) => {
    try {
        const EvaluateId = c.req.param("id");
        const result = await deleteEvaluate(EvaluateId);
        return c.json(result);
    } catch (error: unknown) {
        return c.json({ error: error as Error }, 400);
    }
});

export default evaluate;
