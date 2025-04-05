import { Types } from "mongoose";
import { PaginationDto } from "@/dto/pagination.dto";
import { Pagination } from "@/common/struct/pagination.struct";
import { Schedule } from "@/models/shedule.model";

export const createSchedule = async (
    touristId: string,
    time: Date,
    title: string,
    content: string,
    organizer: string
) => {
    console.log(touristId,time,title,content,organizer)
    if (!Types.ObjectId.isValid(touristId)) {
        throw new Error("Invalid tourist ID");
    }

    const newSchedule = new Schedule({
        tourist: touristId,
        time,
        title,
        content,
        organizer
    });
    console.log(newSchedule)

    await newSchedule.save();
    return newSchedule;
};

export const getAllSchedules = async (
    data: PaginationDto & { search?: string }
) => {
    const skip = Math.max(0, (data.page - 1) * data.limit);
    const query: any = {};

    if (data.search) {
        query.title = { $regex: data.search, $options: "i" };
    }

    const schedules = await Schedule.find(query)
        .populate("tourist", "name") // Populate tourist nếu cần
        .skip(skip)
        .limit(data.limit)
        .lean();

    const totalSchedules = await Schedule.countDocuments(query);
    return new Pagination(schedules, data.page, data.limit, totalSchedules, data.search || "");
};

export const getScheduleById = async (scheduleId: string) => {
    if (!Types.ObjectId.isValid(scheduleId)) throw new Error("Invalid schedule ID");

    const schedule = await Schedule.findById(scheduleId).populate("tourist", "name");
    if (!schedule) throw new Error("Schedule not found");

    return schedule;
};

export const getSchedulesByTouristId = async (touristId: string) => {
    if (!Types.ObjectId.isValid(touristId)) {
        throw new Error("Invalid tourist ID");
    }

    // Tìm tất cả schedule có touristId tương ứng
    const schedules = await Schedule.find({ tourist: touristId })
        .populate("tourist", "name") // Lấy thêm thông tin tên của Tourist nếu cần
        .exec();

    return schedules; // Trả về danh sách schedule (mảng)
};

export const updateSchedule = async (
    scheduleId: string,
    updates: { time?: string; title?: string; content?: string; organizer?: string }
) => {
    if (!Types.ObjectId.isValid(scheduleId)) throw new Error("Invalid schedule ID");

    const schedule = await Schedule.findByIdAndUpdate(scheduleId, updates, { new: true });
    if (!schedule) throw new Error("Schedule not found");

    return schedule;
};

export const deleteSchedule = async (scheduleId: string) => {
    if (!Types.ObjectId.isValid(scheduleId)) throw new Error("Invalid schedule ID");

    const schedule = await Schedule.findByIdAndDelete(scheduleId);
    if (!schedule) throw new Error("Schedule not found");

    return { message: "Schedule deleted successfully" };
};
