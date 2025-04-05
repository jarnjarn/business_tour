import { TouristStatus } from "@/@types/tourist/tourist.enum";
import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITourist extends Document {
  location: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  staff?: mongoose.Types.ObjectId; // Nhân viên duyệt yêu cầu
  totalPeople:number;
  form: Date;
  to: Date;
  status: TouristStatus;
  note?: string; // Ghi chú của nhân viên
}

const TouristSchema = new Schema<ITourist>(
  {
    location: { type: Schema.Types.ObjectId, ref: "Location", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    staff: { type: Schema.Types.ObjectId, ref: "User" }, // Nhân viên xử lý
    totalPeople:{type:Number,required:true},
    form: { type: Date, required: true },
    to: { type: Date, required: true },
    status: {
      type: String,
      enum: Object.values(TouristStatus),
      default: TouristStatus.PENDING
    },
    note: { type: String } // Lưu ghi chú nếu cần
  },
  { timestamps: true }
);

export const Tourist: Model<ITourist> =
  mongoose.models.Tourist || mongoose.model<ITourist>("Tourist", TouristSchema);
