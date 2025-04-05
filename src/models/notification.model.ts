import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISNoti extends Document {
  sender: mongoose.Types.ObjectId;
  receiver: mongoose.Types.ObjectId[]; // Chuyển thành mảng
  title: string;
  content: string;
  status: boolean;
}

const NotiSchema = new Schema<ISNoti>(
  {
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    receiver: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
    title: { type: String, required: true },
    content: { type: String, required: true },
    status: { type: Boolean, default: false },
  },
  { timestamps: true }
);
export const Notification: Model<ISNoti> =
  mongoose.models.notification || mongoose.model<ISNoti>("notification", NotiSchema);

