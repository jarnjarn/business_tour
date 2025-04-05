'use client'
import { CreateTouristModal } from "@/components/modal/tourist/create.tourist";
import { useEvaluateStore } from "@/states/evaluate.state";
import { useLocationStore } from "@/states/location.store";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa"; // Biểu tượng sao
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Link from "next/link";

export default function UserContentPage() {
    const [hoveredId, setHoveredId] = useState<string | null>(null);
    const [locationId, setlocationId] = useState<string>("");
    const [config, setConfig] = useState<Record<string, boolean>>({
        create: false,
        update: false
    });
    const { locations, fetchLocations, deleteLocation, isLoading } = useLocationStore();
    const { evaluates, fetchEvaluates } = useEvaluateStore();

    const toggle = (key: string) => {
        return async () => {
            setConfig({
                ...config,
                [key]: !config[key]
            });
        }
    }

    const [query, setQuery] = useState<Record<string, any>>({
        page: 1,
        limit: 8,
        query: "",
    });

    useEffect(() => {
        loadLocations(query.page, query.limit);
        fetchEvaluates({ page: 1, limit: 10000 })
    }, [query]); // Theo dõi query và search

    const loadLocations = async (page: number, limit: number) => {
        await fetchLocations({ page, limit });
    };

    const getAverageRating = (locationId: string) => {
        if (!evaluates?.data) return 0; // Trả về 0 nếu không có đánh giá
        const reviews = evaluates.data.filter((review) => review.location._id === locationId);
        if (reviews.length === 0) return 0;
        const totalStars = reviews.reduce((sum, review) => sum + review.star, 0);
        return (totalStars / reviews.length).toFixed(1);
    };

    // Intersection Observer để phát hiện khi phần tử vào màn hình
    const [isInViewport, setIsInViewport] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setIsInViewport(true);
                } else {
                    setIsInViewport(false);
                }
            });
        }, {
            threshold: 0.3
        });

        const element = document.getElementById("targetElement");
        if (element) {
            observer.observe(element);
        }

        return () => {
            if (element) {
                observer.unobserve(element);
            }
        };
    }, []);



    return (
        <div>
            {/* Banner */}
            <CreateTouristModal locationId={locationId} open={config.create} onCancel={toggle("create")} />
            <div className="w-full mx-auto my-4 mb-3">
                <Slider dots infinite speed={500} slidesToShow={1} slidesToScroll={1} autoplay autoplaySpeed={3000} adaptiveHeight>
                    <div className="relative w-full h-48  md:h-[420px] mb-3">
                        <Image src="/AI_LHU.jpg" alt="AI_LHU.jpg" layout="fill" objectFit="cover" />
                    </div>
                    <div className="relative w-full h-48  md:h-[420px] mb-3">
                        <Image src="/AUN_QA.jpg" alt="AUN_QA.jpg" layout="fill" objectFit="cover" />
                    </div>
                    <div className="relative w-full h-48  md:h-[420px] mb-3">
                        <Image src="/banner.jpg" alt="banner.jpg" layout="fill" objectFit="cover" />
                    </div><div className="relative w-full h-48  md:h-[420px] mb-3">
                        <Image src="/360Banner.jpg" alt="banner.jpg" layout="fill" objectFit="cover" />
                    </div>
                </Slider>
            </div>

            <div className="container mx-auto px-4 py-8">
                <h1 className="text-center font-semibold text-lime-700 text-3xl">TẦM NHÌN - SỨ MỆNH</h1>
                <br />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
                    {/* Hình ảnh */}
                    <div className="flex">
                        <img src="/sumenh.jpg" alt="Sứ Mệnh" className="w-full h-full object-cover rounded-lg shadow-lg" />
                    </div>

                    {/* Nội dung */}
                    <div id="targetElement" className={`flex flex-col justify-center transition-all duration-1000 transform ${isInViewport ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'}`}>
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
                {locations?.data.map((location, index) => {
                    const averageRating = getAverageRating(location._id);
                    return (
                        <div
                            key={index}
                            className="relative overflow-hidden rounded-xl shadow-lg cursor-pointer"
                            onMouseEnter={() => setHoveredId(location._id)}
                            onMouseLeave={() => setHoveredId(null)}
                        >
                            <Link href={"/location/" + location._id} >
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
                            </Link>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
