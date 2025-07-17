import { RoomStatus } from "@/@types/room/room.enum";
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IRoom extends Document {
  name: string;
  description: string;
  capacity?: number; // Sức chứa tối đa'
  status: string;
  location: mongoose.Types.ObjectId;
  QrCode?: string;
}

const RoomSchema = new Schema<IRoom>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    capacity: { type: Number } ,
    status: { type: String, default: RoomStatus.EMPTY, required: true},
    location: { type: Schema.Types.ObjectId, ref: "Location", required: true },
    QrCode: { type: String },
  },
  { timestamps: true }
);

export const Room: Model<IRoom> =
  mongoose.models.Room || mongoose.model<IRoom>("Room", RoomSchema);