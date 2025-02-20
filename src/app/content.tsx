'use client'
import { CreateScheduleModal } from "@/components/models/schedules/create.schedule";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const articles = [
    {
        id: 1,
        title: "Khu vực đào tạo và thực hành phân tích của ngành thực phẩm tại LHU",
        image: "/01.jpg",
    },
    {
        id: 2,
        title: "Khu vực đào tạo và thực hành Ngành xây dựng tại LHU",
        image: "/02.jpg",
    },
];

export default function UserContentPage() {
    const [hoveredId, setHoveredId] = useState<number | null>(null);
    const [config, setConfig] = useState<Record<string, boolean>>({
        create: false,
        update: false
    });

    const toggle = (key: string) => {
        return async () => {
            setConfig({
                ...config,
                [key]: !config[key]
            });
        }
    }

    return (
        <div>
            {/* Banner */}
            <CreateScheduleModal open={config.create} onCancel={toggle("create")} />
            <div className="w-full h-auto">
                <Image
                    src="/banner.jpg"
                    alt="Banner"
                    width={1200}
                    height={444}
                    className="w-full h-auto"
                />
            </div>

            <br />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-center font-semibold text-lime-700 text-3xl">TẦM NHÌN - SỨ MỆNH</h1>
                <br />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
                    {/* Hình ảnh */}
                    <div className="flex">
                        <img src="/sumenh.jpg" alt="Sứ Mệnh" className="w-full h-full object-cover rounded-lg shadow-lg" />
                    </div>

                    {/* Nội dung */}
                    <div className="flex flex-col justify-center">
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-xl font-bold">✅ TẦM NHÌN</h2>
                                <p>Đại Học Lạc Hồng mong muốn vươn lên thành một nhà trường mang tầm thế giới.</p>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">✅ SỨ MỆNH</h2>
                                <p>Chúng tôi cung cấp các giải pháp giảng dạy sáng tạo với chất lượng tốt nhất.</p>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">✅ GIÁ TRỊ CỐT LÕI</h2>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li><strong>SÁNG TẠO</strong> - Tìm kiếm những giải pháp vượt mong đợi của khách hàng.</li>
                                    <li><strong>TÔN TRỌNG</strong> - Đảm bảo mối quan hệ hợp tác bình đẳng và có lợi giữa 2 bên.</li>
                                    <li><strong>TẬN TÂM</strong> - Làm việc từ trái tim và nỗ lực hết sức mình.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <br />
            <div>
                <h1 className="text-center font-semibold text-lime-700 text-3xl">DANH SÁCH ĐỊA ĐIỂM THĂM QUAN NỔI BẬT</h1>
            </div>
            <br />

            {/* Articles Section */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                {articles.map((article, index) => (
                    <div key={index}
                        className="relative overflow-hidden rounded-xl shadow-lg group cursor-pointer"
                        onMouseEnter={() => setHoveredId(article.id)}
                        onMouseLeave={() => setHoveredId(null)}
                    >
                        <Image src={article.image} alt={article.title} width={300} height={200} className="w-full h-auto" />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
                            <h3 className="text-sm font-semibold">{article.title}</h3>
                        </div>

                        {/* Hover Buttons */}
                        {hoveredId === article.id && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 transition-opacity duration-300">
                                <Link href={`/tourist/${article.id}`}>
                                    <button className="bg-white text-black px-4 py-2 md:px-6 md:py-3 rounded-lg m-1 text-sm md:text-base">
                                        Xem chi tiết
                                    </button>
                                </Link>
                                <button
                                    onClick={toggle("create")}
                                    className="bg-blue-600 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg m-1 text-sm md:text-base"
                                >
                                    Đăng ký tham quan
                                </button>
                            </div>
                        )}

                    </div>
                ))}
            </div>
        </div>
    );
}