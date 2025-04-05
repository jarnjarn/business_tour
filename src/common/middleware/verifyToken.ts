import { Context, Next } from "hono";
import jwt from "jsonwebtoken";
import { UserRole } from "@/@types/users/user.enum";

const SECRET = process.env.JWT_SECRET || "mysecretkey";

interface DecodedUser {
  id: string;
  email: string;
  role: UserRole;
}

export const verifyToken = async (c: Context, next: Next) => {
  try {
    const authHeader = c.req.header("Authorization");
    if (!authHeader) {
      return c.json({ error: "Unauthorized: No token provided" }, 401);
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return c.json({ error: "Unauthorized: Invalid token format" }, 401);
    }

    const decoded = jwt.verify(token, SECRET) as DecodedUser;
    c.set("user", decoded);
    
    await next();
  } catch (error) {
    return c.json({ error: "Unauthorized: Invalid or expired token" }, 401);
  }
};

export const checkAdminOrStaff = async (c: Context, next: Next) => {
  const user = c.get("user");
  if (!user || (user.role !== UserRole.ADMIN && user.role !== UserRole.STAFF)) {
    return c.json({ error: "Forbidden: Insufficient permissions" }, 403);
  }
  await next();
};
