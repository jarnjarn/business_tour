import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISchedule extends Document {
  tourist: mongoose.Types.ObjectId;
  room: mongoose.Types.ObjectId;
  time: Date;
  title:string;
  content: string;
  organizer: mongoose.Types.ObjectId;
}

const ScheduleSchema = new Schema<ISchedule>(
  {
    tourist: { type: Schema.Types.ObjectId, ref: "Tourist", required: true },
    room: { type: Schema.Types.ObjectId, ref: "Room", required: true },
    time: { type: Date, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    organizer: { type: Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

export const Schedule: Model<ISchedule> =
  mongoose.models.Schedule || mongoose.model<ISchedule>("Schedule", ScheduleSchema);
