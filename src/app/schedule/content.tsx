'use client'
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";

export function ScheduleContent() {

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
        }
    ];

    const [hoveredId, setHoveredId] = useState<number | null>(null);

    return (
        <div>
            <div className="mt-10">
                <h1 className="text-center font-semibold text-lime-700 text-3xl">
                    DANH SÁCH LỊCH TRÌNH THĂM QUAN
                </h1>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 p-4">
                {articles.map((article, index) => (
                    <div
                        key={index}
                        className="relative overflow-hidden rounded-xl shadow-lg group cursor-pointer"
                        onMouseEnter={() => setHoveredId(article.id)}
                        onMouseLeave={() => setHoveredId(null)}
                    >
                        <Image
                            src={article.image}
                            alt={article.title}
                            width={300}
                            height={200}
                            className="w-full h-auto"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
                            <h3 className="text-sm font-semibold">{article.title}</h3>
                        </div>

                        {/* Hover Buttons */}
                        {hoveredId === article.id && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 transition-opacity duration-300">
                                <Link href={`/schedule/${article.id}`}>
                                    <button className="bg-white text-black px-4 py-2 md:px-6 md:py-3 rounded-lg m-1 text-sm md:text-base">
                                        Xem lịch trình
                                    </button>
                                </Link>
                            </div>
                        )}

                    </div>
                ))}
            </div>
        </div>
    )
}