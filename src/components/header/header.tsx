'use client'
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiAlignJustify, FiBell } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";
import { User } from "@/entities/user.entity";
import { usePathname } from "next/navigation";
import { UserRole, UserStatus } from "@/@types/users/user.enum";

export function HeaderComponent() {
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isUserDropdownOpen, setUserDropdownOpen] = useState(false);
    const pathname = usePathname();
    // Giả định có user đăng nhập hay chưa
    const user: User | null = {
        id:1,
        username:"adminx",
        fullname:'admin',
        phone:'022335345',
        role:UserRole.ADMIN,
        status:UserStatus.ACTIVE,

    }

    const commonMenuItems = [
        { name: "Trang chủ", path: "/" },
        { name: "Khu vực tham quan", path: "/tourist" },
        { name: "Dịch vụ", path: "/service" },
        { name: "Giới thiệu", path: "/about" },
    ];

    const staffMenuItems = [
        { name: "Quản lý hệ thống", path: "/manager" },
        { name: "Lịch trình của tôi", path: "/schedule" },
    ];

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
                    {user ? (
                        <>
                            {/* Thông báo */}
                            <button className="text-2xl text-gray-700 hover:text-blue-500">
                                <FiBell />
                            </button>

                            {/* Avatar + Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setUserDropdownOpen(!isUserDropdownOpen)}
                                    className="flex items-center space-x-2 text-gray-700 hover:text-blue-500"
                                >
                                    <FaUserCircle className="text-2xl" />
                                </button>

                                {isUserDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg border p-2 z-10">
                                        {staffMenuItems.map((item) => (
                                            <Link
                                                key={item.path}
                                                href={item.path}
                                                className="block px-4 py-2 hover:bg-gray-100"
                                            >
                                                {item.name}
                                            </Link>
                                        ))}
                                        <hr className="my-2" />
                                        <Link href="/logout" className="block px-4 py-2 hover:bg-gray-100">
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
                <button onClick={() => setMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden text-3xl">
                    <FaUserCircle className="text-2xl" />
                </button>
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
                    {user ? (
                        <Link href="/logout" className="block px-4 py-3 text-gray-700 hover:bg-gray-100">
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
