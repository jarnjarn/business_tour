"use client";

import { Menu, Drawer, Button } from "antd";
import { usePathname, useRouter } from "next/navigation"; // Dùng next/navigation
import { useState } from "react";
import { FaComment } from "react-icons/fa";
import {
    UserOutlined,
    EnvironmentOutlined,
    CalendarOutlined,
    MenuOutlined,
    LeftOutlined,
    RightOutlined,
    BarChartOutlined,
} from "@ant-design/icons";
import { ManagerLayout } from "@/components/layouts/manager.layoout";
import { MdOutlineRoomPreferences } from "react-icons/md";

const menuItems = [
    { key: "/manager", icon: <UserOutlined />, label: "Quản lý nhân sự" },
    { key: "/manager/location", icon: <EnvironmentOutlined />, label: "Quản lý khu tham quan" },
    { key: "/manager/tourist", icon: <CalendarOutlined />, label: "Quản lý lịch trình" },
    { key: "/manager/evaluate", icon: <FaComment />, label: "Quản lý đánh giá" },
    { key: "/manager/statistics", icon: <BarChartOutlined />, label: "Thống kê" },
    { key: "/manager/room", icon: <MdOutlineRoomPreferences  />, label: "Quản lý phòng" },
];

export default function ManagerDefaultLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname(); // Lấy đường dẫn hiện tại
    const router = useRouter(); // Dùng để chuyển trang
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false); // Trạng thái mở / thu gọn menu trên PC

    return (
        <ManagerLayout>
            <div className="flex min-h-screen">
                {/* Sidebar menu (PC) */}
                <div
                    className={`hidden md:flex flex-col bg-gray-800 text-white transition-all duration-300 ${collapsed ? "w-16" : "w-64"
                        }`}
                >
                    {/* Nút thu gọn / mở rộng menu */}
                    <div className="p-2 flex justify-end">
                        <Button
                            type="text"
                            icon={collapsed ? <RightOutlined /> : <LeftOutlined />}
                            className="text-white"
                            onClick={() => setCollapsed(!collapsed)}
                        />
                    </div>

                    <Menu
                        mode="inline"
                        theme="dark"
                        selectedKeys={[pathname]}
                        className="flex-1"
                        onClick={({ key }) => router.push(key)} // Gán sự kiện click cho toàn bộ item
                        items={menuItems}
                    />


                </div>

                <div className="w-full">
                    {/* Nội dung bên phải */}
                    <div className="flex-1 m-4">
                        {/* Mobile menu icon */}
                        <div className="md:hidden flex items-center mb-4">
                            <MenuOutlined className="text-2xl cursor-pointer" onClick={() => setDrawerOpen(true)} />
                        </div>

                        {children}
                    </div>

                    {/* Mobile Drawer */}
                    <Drawer
                        title="Menu"
                        placement="left"
                        closable
                        onClose={() => setDrawerOpen(false)}
                        open={drawerOpen}
                    >
                        <Menu
                            mode="vertical"
                            selectedKeys={[pathname]}
                            className="w-full h-full"
                            items={menuItems.map((item, index) => ({
                                key: index,
                                icon: item.icon,
                                label: (
                                    <span
                                        onClick={() => {
                                            router.push(item.key);
                                            setDrawerOpen(false);
                                        }}
                                    >
                                        {item.label}
                                    </span>
                                ),
                            }))}
                        />
                    </Drawer>
                </div>
            </div>
        </ManagerLayout>
    );
}
