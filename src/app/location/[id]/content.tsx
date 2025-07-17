"use client";
import { CreateTouristModal } from "@/components/modal/tourist/create.tourist";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useLocationStore } from "@/states/location.store";
import { CreateEvaluateModal } from "@/components/modal/evaluate/create.evaluate.modal";
import { useEvaluateStore } from "@/states/evaluate.state";
import { Avatar } from "antd";
import { FaStar } from "react-icons/fa"; // Biểu tượng sao
import { useParams } from "next/navigation";


export function Content() {
    const { id } = useParams();
    const { location, isLoading, getById } = useLocationStore();
    const [config, setConfig] = useState<Record<string, boolean>>({
        create: false,
        update: false,
        createValuate: false,
    });

    const { list, getByIdTourist } = useEvaluateStore();

    useEffect(() => {
        getById(id as string);
        getByIdTourist(id as string);
    }, [id, getById]);

    const toggle = (key: string) => () => {
        setConfig((prev) => ({
            ...prev,
            [key]: !prev[key]
        }));
    };
    const getAverageRating = () => {
        if (!list) return 0; // Trả về 0 nếu không có đánh giá

        const totalStars = list.reduce((sum, review) => sum + review.star, 0);
        return (totalStars / list.length).toFixed(1);
    };
    const averageRating = getAverageRating();

    return (
        <div>
            <CreateTouristModal locationId={id as string} open={config.create} onCancel={toggle('create')} />
            <CreateEvaluateModal locationId={id as string} open={config.createValuate} onCancel={toggle('createValuate')} />
            <div className="m-3">
                {isLoading ? (
                    <p>Đang tải dữ liệu...</p>
                ) : location ? (
                    <>
                        <div>
                            <h1 className="text-xl md:text-2xl mt-6 font-semibold text-lime-700 flex ">
                                Chi tiết - {location.name}
                            </h1>
                        </div>
                        <div className="mt-3 md:m-6 text-center">
                            <Image
                                src={location.image}
                                alt={location.name}
                                width={600}
                                height={400}
                                className="m-auto rounded-lg shadow-lg"
                            />
                            <p className="italic mt-3">H1. {location.name}</p>
                        </div>
                        <div className="p-6 bg-gray-100 rounded-lg shadow-md">
                            <h2 className="text-lg font-bold text-lime-700">Giới thiệu</h2>
                            <p className="mt-2 text-gray-700">{location.description}</p>

                            <h2 className="text-lg font-bold text-lime-700 mt-4">Địa chỉ</h2>
                            <p className="mt-2 text-gray-700">{location.address}</p>
                        </div>
                    </>
                ) : (
                    <p>Không tìm thấy địa điểm!</p>
                )}
            </div>
            <div className="mt-3 mb-3">
                <button
                    onClick={() =>
                        setConfig({ ...config, create: true })}
                    className="bg-blue-600 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg m-1 text-sm md:text-base"
                >
                    Đăng ký tham quan ngay
                </button>

                <button
                    onClick={() =>
                        setConfig({ ...config, createValuate: true })}
                    className="bg-blue-600 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg m-1 text-sm md:text-base"
                >
                    Đánh giá
                </button>
            </div>
            <div>
                <h1 className="text-xl md:text-2xl mt-6 font-semibold text-lime-700 mb-[20px] flex ">Danh sách đánh giá <span className="flex items-center text-yellow-400 text-sm mt-1 ml-2">
                    {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className={i < Math.round(Number(averageRating)) ? "text-yellow-500" : "text-gray-400"} />
                    ))}
                </span>
                </h1>
                {
                    list.map((item, index) => {
                        return (
                            <div key={index} className="mb-4 p-4 border rounded-lg shadow-md">
                                <div className="flex items-center">
                                    <Avatar size={64} src="/avatar.png" alt="">
                                    </Avatar>
                                    <div className="ml-4">
                                        <p className="font-semibold flex">{item.user?.username} - <span className="flex items-center text-yellow-400 text-sm mt-1 ml-2">
                                            {[...Array(5)].map((_, i) => (
                                                <FaStar key={i} className={i < Math.round(Number(item.star)) ? "text-yellow-500" : "text-gray-400"} />
                                            ))}
                                        </span></p>
                                        <p className="text-sm text-gray-600">{item.content}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                }
            </div>
        </div>
    );
}
