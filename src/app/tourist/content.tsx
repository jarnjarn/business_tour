"use client";
import { useState } from "react";
import Image from "next/image";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { CreateScheduleModal } from "@/components/models/schedules/create.schedule";
import Link from "next/link";

export function TouristContent() {
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
    const [config, setConfig] = useState<Record<string, boolean>>({
        create: false,
        update: false,
    });

    const toggle = (key: string) => {
        return async () => {
            setConfig({
                ...config,
                [key]: !config[key],
            });
        };
    };

    // Cấu hình cho Carousel
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        adaptiveHeight: true,
    };

    return (
        <div>
            {/* Carousel */}
            <div className="w-full md:w-2/3 mx-auto my-4 mb-3">
                <Slider {...settings}>
                    {articles.map((article, index) => (
                        <div key={index} className="relative w-full h-60 md:h-96 mb-3">
                            <Image
                                src={article.image}
                                alt={article.title}
                                layout="fill"
                                objectFit="cover"
                            />
                        </div>
                    ))}
                </Slider>
            </div>
            <CreateScheduleModal open={config.create} onCancel={toggle("create")} />
            {/* Danh sách địa điểm */}
            <div className="mt-10">
                <h1 className="text-center font-semibold text-lime-700 text-3xl">
                    DANH SÁCH ĐỊA ĐIỂM THĂM QUAN
                </h1>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
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
