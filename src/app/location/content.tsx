"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { CreateTouristModal } from "@/components/modal/tourist/create.tourist";
import Link from "next/link";
import { LocationClient } from "@/clients/location.client";
import { FaStar } from "react-icons/fa"; // Biểu tượng sao
import { useEvaluateStore } from "@/states/evaluate.state";

const locationClient = new LocationClient();

export function LocationContent() {
    const [hoveredId, setHoveredId] = useState<number | null>(null);
    const [locationId, setlocationId] = useState<string>("");

    const [config, setConfig] = useState<Record<string, boolean>>({
        create: false,
        update: false,
    });

    const [locations, setLocations] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const { evaluates, fetchEvaluates } = useEvaluateStore(); // Lấy hàm fetch đánh giá

    useEffect(() => {
        fetchLocations(1, true);
    }, []);

    const fetchLocations = async (page: number, reset: boolean = false) => {
        if (isLoading) return;
        setIsLoading(true);

        const limit = reset ? 100 : 10;
        const res = await locationClient.getAllLocations({ page, limit });

        if (res?.data) {
            setLocations((prev) => (reset ? res.data : [...prev, ...res.data]));
        }
        const evaluate = fetchEvaluates({ page, limit })

        setIsLoading(false);
    };

    // Hàm tính số sao trung bình
    const getAverageRating = (locationId: string) => {
        if (!evaluates?.data) return 0; // Trả về 0 nếu không có đánh giá
        const reviews = evaluates.data.filter((review) => review.location._id === locationId);
        if (reviews.length === 0) return 0;
        const totalStars = reviews.reduce((sum, review) => sum + review.star, 0);
        return (totalStars / reviews.length).toFixed(1);
    };



    return (
        <div>
            <div className="w-full mx-auto my-4 mb-3">
                <Slider dots infinite speed={500} slidesToShow={1} slidesToScroll={1} autoplay autoplaySpeed={3000} adaptiveHeight>
                    <div className="relative w-full h-48  md:h-[420px] mb-3">
                        <Image src="/NghiencuuKH.jpg" alt="NghiencuuKH.jpg" layout="fill" objectFit="cover" />
                    </div>

                    <div className="relative w-full h-48  md:h-[420px] mb-3">
                        <Image src="/NghiencuuKH.jpg" alt="NghiencuuKH.jpg" layout="fill" objectFit="cover" />
                    </div>
                </Slider>
            </div>

            <CreateTouristModal locationId={locationId} open={config.create} onCancel={() => setConfig({ ...config, create: false })} />

            <div className="mt-10">
                <h1 className="text-center font-semibold text-lime-700 text-xl md:text-3xl">
                    DANH SÁCH ĐỊA ĐIỂM THĂM QUAN
                </h1>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                {locations.map((location, index) => {
                    const averageRating = getAverageRating(location._id);
                    return (
                        <div
                            key={index}
                            className="relative overflow-hidden rounded-xl shadow-lg cursor-pointer"
                            onMouseEnter={() => setHoveredId(location._id)}
                            onMouseLeave={() => setHoveredId(null)}
                        >
                            <Image src={location.image} alt={location.name} width={300} height={200} className="w-full h-[260px]" />
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
                                <h3 className="text-sm font-semibold">{location.name}</h3>
                                <div className="flex items-center text-yellow-400 text-sm mt-1">
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar key={i} className={i < Math.round(Number(averageRating)) ? "text-yellow-500" : "text-gray-400"} />
                                    ))}
                                    <span className="ml-2">({averageRating})</span>
                                </div>
                            </div>

                            <div className={`absolute inset-0 flex flex-col items-center justify-center bg-black/50 transition-opacity duration-300 ${hoveredId === location._id ? "opacity-100 visible" : "opacity-0 invisible"
                                }`}>
                                <Link href={`/location/${location._id}`}>
                                    <button className="bg-white text-black px-4 py-2 md:px-6 md:py-3 rounded-lg m-1 text-sm md:text-base">
                                        Xem chi tiết
                                    </button>
                                </Link>
                                <button
                                    onClick={() => {
                                        setConfig({ ...config, create: true });
                                        setlocationId(location._id);
                                    }}
                                    className="bg-blue-600 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg m-1 text-sm md:text-base"
                                >
                                    Đăng ký tham quan
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
