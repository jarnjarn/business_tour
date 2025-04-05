import { PaginationDto } from "@/common/dto/pagination.dto";
import { Pagination } from "@/common/struct/pagination.struct";
import { EvaluateCreateDto } from "@/dto/evaluate.dto";
import Evaluate from "@/models/evaluate.model";
import { Types } from "mongoose";

export const createEvaluate = async (data:EvaluateCreateDto) => {
    console.log("evaluate" ,data)
    if (!Types.ObjectId.isValid(data.location)) {
        throw new Error("Invalid location ID");
    }
    if (!Types.ObjectId.isValid(data.user)) {
        throw new Error("Invalid user ID");
    }
    const newevaluate = new Evaluate({
        location:data.location,
        user:data.user,
        star:data.star,
        content:data.content
    });
    await newevaluate.save();
    return newevaluate;
};

export const getAllEvaluates = async (
    data: PaginationDto & { search?: string }
) => {
    const skip = Math.max(0, (data.page - 1) * data.limit);
    const query: any = {};

    if (data.search) {
        query.title = { $regex: data.search, $options: "i" };
    }

    const evaluates = await Evaluate.find(query)
        .populate("location", "name")
        .populate("user", "username email phone")
        .skip(skip)
        .limit(data.limit)
        .sort({ createdAt: -1 })
        .lean();

    const totalEvaluate = await Evaluate.countDocuments(query);
    return new Pagination(evaluates, data.page, data.limit, totalEvaluate, data.search || "");
};

export const getEvaluateById = async (evaluateId: string) => {
    if (!Types.ObjectId.isValid(evaluateId)) throw new Error("Invalid evaluate ID");

    const evaluate = await Evaluate.findById(evaluateId).populate("tourist", "name");
    if (!evaluate) throw new Error("evaluate not found");

    return evaluate;
};

export const getEvaluateByIdLocation = async (locationId: string) => {
    if (!Types.ObjectId.isValid(locationId)) {
        throw new Error("Invalid location ID");
    }
    console.log(locationId)
    const evaluates = await Evaluate.find({ location: locationId })
        .populate("location", "name") 
        .populate("user") 
        .exec();

    return evaluates; // Trả về danh sách evaluate (mảng)
};

export const updateEvaluate = async ( EvaluateById : string, data: EvaluateCreateDto) => {
    if (!Types.ObjectId.isValid(EvaluateById)) throw new Error("Invalid schedule ID");

    const schedule = await Evaluate.findByIdAndUpdate(EvaluateById, data, { new: true });
    if (!schedule) throw new Error("Schedule not found");

    return schedule;
};

export const deleteEvaluate = async (EvaluateById: string) => {
    if (!Types.ObjectId.isValid(EvaluateById)) throw new Error("Invalid schedule ID");

    const schedule = await Evaluate.findByIdAndDelete(EvaluateById);
    if (!schedule) throw new Error("Schedule not found");

    return { message: "Schedule deleted successfully" };
};
