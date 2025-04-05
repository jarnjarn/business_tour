import { Hono } from "hono";
import { createLocation, getAllLocations, getLocationById, updateLocation, deleteLocation } from "@/service/location.service";
import { checkAdminOrStaff, verifyToken } from "@/common/middleware/verifyToken";

const location = new Hono();


// Tạo mới địa điểm
location.post("/", verifyToken,checkAdminOrStaff, async (c) => {
  try {
    const body = await c.req.parseBody(); // Lấy dữ liệu từ FormData

    const name = body.name as string;
    const description = body.description as string;
    const image = body.image as File; // Nhận file ảnh
    const address = body.address as string;

    if (!name || !description || !image) {
      return c.json({ error: "Thiếu thông tin bắt buộc" }, 400);
    }

    // Chuyển file thành Base64 để upload lên Cloudinary
    const buffer = await image.arrayBuffer();
    const base64Image = Buffer.from(buffer).toString("base64");
    const cloudinaryUrl = `data:${image.type};base64,${base64Image}`;

    // Gửi ảnh đã encode lên Cloudinary
    const result = await createLocation(name, cloudinaryUrl, description, address);
    return c.json(result);
  } catch (error: any) {
    return c.json({ error: error.message }, 400);
  }
});



location.get("/", async (c) => {
  const data = {
      page: Number(c.req.query("page") || 1),
      limit: Number(c.req.query("limit") || 10),
      search: c.req.query("search") || "", // Lấy từ query nếu có
  };

  const locations = await getAllLocations(data);
  return c.json(locations);
});

// Lấy chi tiết địa điểm
location.get("/:id", async (c) => {
  try {
    const locationId = c.req.param("id");
    const location = await getLocationById(locationId);
    return c.json(location);
  } catch (error: any) {
    return c.json({ error: error.message }, 400);
  }
});

// Cập nhật địa điểm
location.put("/:id", verifyToken,checkAdminOrStaff, async (c) => {
  try {
    const locationId = c.req.param("id");
    const data = await c.req.json();
    const updatedLocation = await updateLocation(locationId, data);
    return c.json(updatedLocation);
  } catch (error: any) {
    return c.json({ error: error.message }, 400);
  }
});

// Xóa địa điểm
location.delete("/:id", verifyToken,checkAdminOrStaff, async (c) => {
  try {
    const locationId = c.req.param("id");
    const result = await deleteLocation(locationId);
    return c.json(result);
  } catch (error: any) {
    return c.json({ error: error.message }, 400);
  }
});

export default location;
