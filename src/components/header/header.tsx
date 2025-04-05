'use client'
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiAlignJustify, FiBell } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";
import { usePathname, useRouter } from "next/navigation";
import { UserRole, UserStatus } from "@/@types/users/user.enum";
import { useAuthStore } from "@/states/auth.state";
import { CookieUtil } from "@/common/utils/cookie.util";
import { NotificationDropdown } from "../common/NotificationDropdown";

export function HeaderComponent() {
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isUserDropdownOpen, setUserDropdownOpen] = useState(false);
    const pathname = usePathname();
    const { auth, logout, fetchMe,isLoading } = useAuthStore();
    const router = useRouter();
    const commonMenuItems = [
        { name: "Trang chủ", path: "/" },
        { name: "Khu vực tham quan", path: "/location" },
        { name: "Dịch vụ", path: "/company_services" },
        { name: "Giới thiệu", path: "/about" },
    ];

    const staffMenuItems = [
        { name: "Quản lý hệ thống", path: "/manager" }
    ];
    const scheduleMenuItem = { name: "Lịch trình của tôi", path: "/schedule" };


    const handleLogout = () => {
        logout();
        router.push("/login");
    };

    useEffect(() => {
        const token = CookieUtil.getCookie("token")
        if (token) {
            fetchMe()
        }

    }, []);

    return (
        <header className="bg-white shadow-md">
            <div className="max-w-[1200px] mx-auto flex items-center justify-between px-4 h-20">
                {/* Logo */}
                <Link href="/">
                    <Image src="/logoG.png" alt="Logo" width={160} height={56} />
                </Link>

                {/* 🖥️ PC MENU */}
                <nav className="hidden md:flex items-center space-x-8">
                    {commonMenuItems.map((item) => {
                        const isActive = pathname === item.path; // Kiểm tra xem có phải trang hiện tại không

                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`relative text-lg font-medium transition-all duration-300 ${isActive ? "text-blue-600 font-semibold" : "text-gray-800 hover:text-blue-600"
                                    }`}
                            >
                                {item.name}
                                {isActive && (
                                    <span className="absolute left-0 bottom-[-2px] w-full h-[2px] bg-blue-600"></span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* PC - User / Login Section */}
                <div className="hidden md:flex items-center space-x-4">
                    {auth ? (
                        <>
                            {/* Thông báo */}
                            <NotificationDropdown />

                            {/* Avatar + Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setUserDropdownOpen(!isUserDropdownOpen)}
                                    className="flex items-center space-x-2 text-gray-700 hover:text-blue-500"
                                >
                                    <FaUserCircle className="text-3xl" />
                                </button>

                                {isUserDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg border p-2 z-10">
                                        {/* Hiển thị lịch trình của tôi cho mọi user đã đăng nhập */}
                                        {auth && (
                                            <Link key={scheduleMenuItem.path} href={scheduleMenuItem.path} className="block px-4 py-2 hover:bg-gray-100">
                                                {scheduleMenuItem.name}
                                            </Link>
                                        )}

                                        {/* Chỉ hiển thị staff menu nếu user là staff hoặc admin */}
                                        {auth && (auth.role === UserRole.STAFF || auth.role === UserRole.ADMIN) && (
                                            <>
                                                {staffMenuItems.map((item) => (
                                                    <Link key={item.path} href={item.path} className="block px-4 py-2 hover:bg-gray-100">
                                                        {item.name}
                                                    </Link>
                                                ))}
                                                <hr className="my-2" />
                                            </>
                                        )}

                                        <Link href="/login" onClick={handleLogout} className="block px-4 py-2 hover:bg-gray-100">
                                            Đăng xuất
                                        </Link>
                                    </div>
                                )}

                            </div>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                                Đăng nhập
                            </Link>
                        </>
                    )}
                </div>

                {/* 📱 MOBILE MENU BUTTON */}
                <div className="flex items-center space-x-4">
                    <div className="block md:hidden">
                        <NotificationDropdown />

                    </div>
                    <button onClick={() => setMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden text-3xl">
                        <FaUserCircle className="text-3xl" />
                    </button>
                </div>
            </div>

            {/* 📱 MOBILE DROPDOWN MENU */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white shadow-lg border-t">
                    {commonMenuItems.map((item) => (
                        <Link key={item.path} href={item.path} className="block px-4 py-3 text-gray-700 hover:bg-gray-100">
                            {item.name}
                        </Link>
                    ))}
                    {staffMenuItems.map((item) => (
                        <Link key={item.path} href={item.path} className="block px-4 py-3 text-gray-700 hover:bg-gray-100">
                            {item.name}
                        </Link>
                    ))}
                    <hr className="my-2" />
                    {auth ? (
                        <Link href="/logout" onClick={handleLogout} className="block px-4 py-3 text-gray-700 hover:bg-gray-100">
                            Đăng xuất
                        </Link>
                    ) : (
                        <>
                            <Link href="/login" className="block px-4 py-3 text-gray-700 hover:bg-gray-100">
                                Đăng nhập
                            </Link>
                            <Link href="/register" className="block px-4 py-3 text-gray-700 hover:bg-gray-100">
                                Đăng ký
                            </Link>
                        </>
                    )}
                </div>
            )}
        </header>
    );
}
