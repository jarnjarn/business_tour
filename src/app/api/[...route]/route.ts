import { Hono } from "hono";
import { handle } from "hono/vercel";
import { connectDB } from "@/providers/db";
import user from "@/api/user/userapi"; // Import đúng
import location from "@/api/location/locationApi"; // Import đúng
import tourist from "@/api/tourist/touristApi";
import schedule from "@/api/schedule/scheduleApi";
import noti from "@/api/noti/notiApi";
import evaluate from "@/api/evaluate/evaluateApi";

export const runtime = "nodejs";

connectDB(); // Kết nối MongoDB khi API khởi động

const app = new Hono().basePath('/api')

app.route("/evaluate", evaluate);
app.route("/user",user)
app.route("/location", location);
app.route("/tourist", tourist);
app.route("/schedule", schedule);
app.route("/noti", noti);



export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
