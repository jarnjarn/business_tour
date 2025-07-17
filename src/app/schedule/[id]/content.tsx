'use client'
import { useScheduleStore } from "@/states/schedule.state";
import { useTouristStore } from "@/states/tourist.state";
import dayjs from "dayjs";
import Image from "next/image";
import { useEffect } from "react";
import { useParams } from "next/navigation";

export function Content() {
    const { id } = useParams();
    const { list, getByIdTourist } = useScheduleStore();
    const { getById, tourist } = useTouristStore();

    useEffect(() => {
        getByIdTourist(id as string);
        getById(id as string);
    }, [id]);
    return (
        <div className="p-3 md:p-6 bg-gray-100 rounded-lg shadow-md mt-6">
            <h1 className="text-xl md:text-2xl mt-6 font-semibold text-lime-700 text-center">
                Lịch Trình - {tourist?.location?.name}
            </h1>

            {/* Hình ảnh */}
            <div className="mt-3 md:m-6 text-center">
                <Image
                    src={tourist?.location?.image || '/sumenh.jpg'}
                    alt="Ảnh"
                    width={600}
                    height={400}
                    className="m-auto rounded-lg shadow-lg"
                />
                <p className="italic mt-3">H1. {tourist?.location?.name}</p>
            </div>

            {/* Timeline Dọc */}
            <div className="w-full">
                { !list || list.length === 0 ? (
                    <div className="text-center text-gray-600 mt-4">
                        <h2 className="text-lg font-semibold">Hiện chưa có lịch trình nào.</h2>
                    </div>
                ) : (
                    <div className="relative mt-8 flex flex-col items-center md:w-[700px] m-auto">
                        {/* Đường thẳng của timeline */}
                        <div className="absolute w-1 bg-gray-300 h-full top-0 left-1/2 transform -translate-x-1/2"></div>

                        {/* Các mốc thời gian */}
                        {list.map((item, index) => (
                            <div key={index} className="relative flex items-center w-full mb-8">
                                {/* Chấm tròn */}
                                <div className="hidden md:block w-6 h-6 bg-blue-500 rounded-full border-4 border-white shadow-md absolute left-1/2 transform -translate-x-1/2"></div>

                                {/* Nội dung */}
                                <div className={`p-4 rounded-lg shadow-md w-56 bg-purple-100 ${index % 2 === 0 ? "ml-auto mr-6" : "mr-auto ml-6"
                                    }`}>
                                    <p className="text-lg font-bold text-gray-700">{dayjs(item.time).format("DD/MM/YYYY:HH")}</p>
                                    <p className="text-lg font-semibold">{item.title}</p>
                                    <p className="text-sm">Nội dung: {item.content}</p>
                                    <p className="text-xs text-gray-500">Người hưỡng dẫn: {item.organizer.username}</p>
                                    <p className="text-xs text-gray-500">Phòng: {item.room.name}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
