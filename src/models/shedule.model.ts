import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISchedule extends Document {
  tourist: mongoose.Types.ObjectId;
  time: Date;
  title:string;
  content: string;
  organizer: string;
}

const ScheduleSchema = new Schema<ISchedule>(
  {
    tourist: { type: Schema.Types.ObjectId, ref: "Tourist", required: true },
    time: { type: Date, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    organizer: { type: String, required: true }
  },
  { timestamps: true }
);

export const Schedule: Model<ISchedule> =
  mongoose.models.Schedule || mongoose.model<ISchedule>("Schedule", ScheduleSchema);
