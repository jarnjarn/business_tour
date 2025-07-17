import { Types } from "mongoose";
import { PaginationDto } from "@/dto/pagination.dto";
import { Pagination } from "@/common/struct/pagination.struct";
import { Schedule } from "@/models/shedule.model";
import { Room } from "@/models/room.model";
import { RoomStatus } from "@/@types/room/room.enum";
import { v2 as cloudinary } from "cloudinary";


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

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
        location: location,
        QrCode:"",
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
export const updateRoomImg = async (roomId: string, urlImg: string) => {
    console.log(roomId);
    if (!Types.ObjectId.isValid(roomId)) throw new Error("Invalid room ID");

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

    const room = await Room.findByIdAndUpdate(roomId, { QrCode: imageUrl }, { new: true });
    console.log(room);
    if (!room) throw new Error("Room not found");

    return room;
}
