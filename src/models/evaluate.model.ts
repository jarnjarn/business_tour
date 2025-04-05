import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISevaluate extends Document {
  location: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  star: number;
  content: string;
}

const evaluateSchema = new Schema<ISevaluate>(
  {
    location: { type: Schema.Types.ObjectId, ref: "Location", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    star: { type: Number, required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);
const Evaluate: Model<ISevaluate> =
  mongoose.models.Evaluate || mongoose.model<ISevaluate>("Evaluate", evaluateSchema);

export default Evaluate;
