import mongoose, { Schema, Document, Model } from "mongoose";

export interface ILocation extends Document {
  name: string;
  image: string;
  description: string;
  address: string; // Địa chỉ
  capacity?: number; // Sức chứa tối đa
}

const LocationSchema = new Schema<ILocation>(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    address: { type: String, required: true }, // Địa chỉ chi tiết
    capacity: { type: Number } // Giới hạn số người tham quan
  },
  { timestamps: true }
);

export const Location: Model<ILocation> =
  mongoose.models.Location || mongoose.model<ILocation>("Location", LocationSchema);
