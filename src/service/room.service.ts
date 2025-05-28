import { Types } from "mongoose";
import { PaginationDto } from "@/dto/pagination.dto";
import { Pagination } from "@/common/struct/pagination.struct";
import { Schedule } from "@/models/shedule.model";
import { Room } from "@/models/room.model";
import { RoomStatus } from "@/@types/room/room.enum";

export const createRoom = async (
    name: string,
    description: string,
    capacity: number,
    location: string
) => {
    if (!Types.ObjectId.isValid(location)) {
        throw new Error("Invalid location ID");
    }

    const newRoom = new Room({
        name,
        description,
        capacity,
        status: RoomStatus.EMPTY,
        location: location
    });

    await newRoom.save();
    return newRoom;
};

export const getAllRooms = async (
    data: PaginationDto & { search?: string }
) => {
    const skip = Math.max(0, (data.page - 1) * data.limit);
    const query: any = {};

    if (data.search) {
        query.title = { $regex: data.search, $options: "i" };
    }

    const rooms = await Room.find(query)
        .populate("location", "name") // Populate tourist nếu cần
        .skip(skip)
        .limit(data.limit)
        .lean();

    const totalRooms = await Room.countDocuments(query);
    return new Pagination(rooms, data.page, data.limit, totalRooms, data.search || "");
};

export const getRoomById = async (roomId: string) => {
    if (!Types.ObjectId.isValid(roomId)) throw new Error("Invalid room ID");

    const room = await Room.findById(roomId).populate("location", "name");
    if (!room) throw new Error("Room not found");

    return room;
};

export const getRoomsByLocationId = async (locationId: string) => {
    if (!Types.ObjectId.isValid(locationId)) {
        throw new Error("Invalid location ID");
    }
    console.log(locationId)
    const rooms = await Room.find({ location: locationId })
        .populate("location", "name") // Lấy thêm thông tin tên của Tourist nếu cần
        .exec();

    return rooms; // Trả về danh sách room (mảng)
};

export const updateRoom = async (
    roomId: string,
    updates: { name?: string; description?: string; capacity?: number; status?: boolean }
) => {
    if (!Types.ObjectId.isValid(roomId)) throw new Error("Invalid room ID");

    const room = await Room.findByIdAndUpdate(roomId, updates, { new: true });
    if (!room) throw new Error("Room not found");

    return room;
};

export const deleteRoom = async (roomId: string) => {
    if (!Types.ObjectId.isValid(roomId)) throw new Error("Invalid room ID");

    const room = await Room.findByIdAndDelete(roomId);
    if (!room) throw new Error("Room not found");

    return { message: "Room deleted successfully" };
};
