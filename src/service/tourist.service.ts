import { Tourist } from "@/models/tourist.model";
import { Types } from "mongoose";
import { PaginationDto } from "@/dto/pagination.dto";
import { Pagination } from "@/common/struct/pagination.struct";

export const createTouristRequest = async (
    userId: string,
    locationId: string,
    totalPeople: number,
    form: Date,
    to: Date
) => {
    if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(locationId)) {
        throw new Error("Invalid user or location ID");
    }

    const newTouristRequest = new Tourist({
        user: userId,
        location: locationId,
        totalPeople,
        form,
        to
    });

    await newTouristRequest.save();
    return newTouristRequest;
};

export const getAllTouristRequests = async (
    data: PaginationDto & { search?: string }
) => {
    const skip = Math.max(0, (data.page - 1) * data.limit);
    const query: any = {};

    if (data.search) {
        query.note = { $regex: data.search, $options: "i" };
    }

    const tourists = await Tourist.find(query)
        .populate("user", "name email")
        .populate("location", "name address image")
        .skip(skip)
        .limit(data.limit)
        .lean();

    const totalTourists = await Tourist.countDocuments(query);
    return new Pagination(tourists, data.page, data.limit, totalTourists, data.search || "");
};

export const getTouristById = async (touristId: string) => {
    if (!Types.ObjectId.isValid(touristId)) throw new Error("Invalid tourist ID");

    const tourist = await Tourist.findById(touristId)
        .populate("user", "username email")
        .populate("location", "name image");
    if (!tourist) throw new Error("Tourist request not found");

    return tourist;
};

export const updateTouristStatus = async (
    touristId: string,
    status: string,
    totalPeople: number,
    staffId?: string,
    note?: string
) => {
    if (!Types.ObjectId.isValid(touristId)) throw new Error("Invalid tourist ID");

    const updateData: any = { status };
    if (staffId) updateData.staff = staffId;
    if (note) updateData.note = note;
    if (totalPeople) updateData.totalPeople = totalPeople;

    const tourist = await Tourist.findByIdAndUpdate(touristId, updateData, { new: true });
    if (!tourist) throw new Error("Tourist request not found");

    return tourist;
};

export const deleteTouristRequest = async (touristId: string) => {
    if (!Types.ObjectId.isValid(touristId)) throw new Error("Invalid tourist ID");
    console.log(touristId)
    const tourist = await Tourist.findByIdAndDelete(touristId);
    console.log(tourist)
    if (!tourist) throw new Error("Tourist request not found");

    return { message: "Tourist request deleted successfully" };
};
export const getTouristIdUser = async (userId: string) => {
    if (!Types.ObjectId.isValid(userId)) {
        throw new Error("Invalid user ID");
    }

    // Tìm tất cả schedule có touristId tương ứng
    const schedules = await Tourist.find({ user: userId })
        .populate("user", "username") // Lấy thêm thông tin tên của Tourist nếu cần
        .exec();

    return schedules; // Trả về danh sách schedule (mảng)
};