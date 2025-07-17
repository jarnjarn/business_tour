import { Location } from "@/models/location.model";
import { Types } from "mongoose";
import { PaginationDto } from "@/dto/pagination.dto";
import { v2 as cloudinary } from "cloudinary";
import { Pagination } from "@/common/struct/pagination.struct";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const createLocation = async (name: string, urlImg: string, description: string, address: string) => {
    // Kiểm tra địa điểm đã tồn tại chưa
    const existingLocation = await Location.findOne({ name });
    if (existingLocation) {
        throw new Error("Địa điểm đã tồn tại");
    }
    // Upload ảnh lên Cloudinary
    let imageUrl = "";
    if (urlImg) {
        try {
            const uploadResult = await cloudinary.uploader.upload(urlImg, {
                folder: "uploads", // Thư mục trên Cloudinary
            });
            imageUrl = uploadResult.secure_url; // Lấy URL ảnh sau khi upload
        } catch (error) {
            throw new Error("Lỗi khi upload ảnh lên Cloudinary");
        }
    }
    // Tạo mới location
    const newLocation = new Location({
        name,
        address,
        image: imageUrl,
        description,
    });
    await newLocation.save();
    return newLocation;
};

export const getAllLocations = async (data: PaginationDto & { search?: string }) => {
    const skip = Math.max(0, (data.page - 1) * data.limit);

    // Tạo điều kiện tìm kiếm (nếu có)
    const query: any = {};
    if (data.search) {
        query.name = { $regex: data.search, $options: "i" }; // Tìm kiếm không phân biệt hoa thường
    }

    // Lấy danh sách địa điểm theo điều kiện tìm kiếm
    const locations = await Location.find(query)
        .skip(skip)
        .limit(data.limit)
        .lean();

    // Đếm tổng số địa điểm theo điều kiện tìm kiếm
    const totalLocations = await Location.countDocuments(query);

    // Trả về dữ liệu theo cấu trúc `Pagination`
    return new Pagination(locations, data.page, data.limit, totalLocations, data.search || "");
};

export const getLocationById = async (locationId: string) => {
    if (!Types.ObjectId.isValid(locationId)) throw new Error("Invalid location ID");

    const location = await Location.findById(locationId);
    if (!location) throw new Error("Location not found");

    return location;
};

export const updateLocation = async (
    locationId: string,
    data: Partial<{ name: string; description: string, address: string }>
) => {
    if (!Types.ObjectId.isValid(locationId)) throw new Error("Invalid location ID");
    // Cập nhật location
    const location = await Location.findByIdAndUpdate(locationId, data, { new: true });

    if (!location) throw new Error("Location not found");

    return location;
};

export const deleteLocation = async (locationId: string) => {
    if (!Types.ObjectId.isValid(locationId)) throw new Error("Invalid location ID");

    const location = await Location.findByIdAndDelete(locationId);
    if (!location) throw new Error("Location not found");

    return { message: "Location deleted successfully" };
};

export const updateLocationImg = async (locationId: string, urlImg: string) => {
    if (!Types.ObjectId.isValid(locationId)) throw new Error("Invalid location ID");

    let imageUrl = "";
    if (urlImg) {
        try {
            const uploadResult = await cloudinary.uploader.upload(urlImg, {
                folder: "uploads", // Thư mục trên Cloudinary
            });
            imageUrl = uploadResult.secure_url; // Lấy URL ảnh sau khi upload
        } catch (error) {
            throw new Error("Lỗi khi upload ảnh lên Cloudinary");
        }
    }
    console.log(imageUrl);

    const location = await Location.findByIdAndUpdate(locationId, { image: imageUrl }, { new: true });
    if (!location) throw new Error("Location not found");

    return location;
}