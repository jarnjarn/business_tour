import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { UserRole } from "./@types/users/user.enum";

interface DecodedUser {
  id: string;
  email: string;
  role: UserRole;
}

// Sử dụng SECRET_KEY dưới dạng Uint8Array
const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "mysecretkey");

async function verifyJWT(token: string): Promise<DecodedUser | null> {
    try {
        const { payload } = await jwtVerify(token, SECRET);
        return payload as any;
    } catch (error) {
        console.error("JWT Decode Error:", error);
        return null;
    }
}

export async function middleware(req: NextRequest) {
    const url = req.nextUrl.pathname;

    // Lấy token từ cookie
    const token = req.cookies.get("token")?.value;

    let auth: DecodedUser | null = null;
    if (token) {
        auth = await verifyJWT(token); // Giải mã JWT với jose
    }


    if (url.startsWith("/manager") && (!auth || ![UserRole.ADMIN, UserRole.STAFF].includes(auth.role))) {
        return NextResponse.redirect(new URL("/", req.url)); // Redirect về trang chủ
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/manager/:path*"], // Áp dụng middleware cho tất cả các route trong `/manager`
};
