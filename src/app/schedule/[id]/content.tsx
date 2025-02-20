'use client'
import Image from "next/image";

const image = "/02.jpg";

export function Content() {
    const schedules = [
        { time: "8:00 AM", title: "Đón đoàn đến thăm", person: "Hoàng Thị Thanh Thảo" },
        { time: "8:20 AM", title: "Thăm quan khu vực thực hành cơ điện", person: "Nguyễn Văn A" },
        { time: "9:00 AM", title: "Thăm quan khu vực thực hành ô tô", person: "Trần Văn B" },
        { time: "9:30 AM", title: "Thăm quan khu vực tự động hoá", person: "Lê Thị C" },
        { time: "10:00 AM", title: "Về phòng hội nghị chơi trò chơi", person: "Hoàng Thị Thanh Thảo" },
    ];

    return (
        <div className="p-3 md:p-6 bg-gray-100 rounded-lg shadow-md mt-6">
            <h1 className="text-xl md:text-2xl mt-6 font-semibold text-lime-700 text-center">
                Lịch Trình - Khu vực đào tạo và thực hành phân tích của ngành thực phẩm tại LHU
            </h1>

            {/* Hình ảnh */}
            <div className="mt-3 md:m-6 text-center">
                <Image
                    src={image}
                    alt="LHU Training Area"
                    width={600}
                    height={400}
                    className="m-auto rounded-lg shadow-lg"
                />
                <p className="italic mt-3">H1. Khu vực đào tạo và thực hành phân tích của ngành thực phẩm tại LHU</p>
            </div>

            {/* Timeline Dọc */}
            <div className="w-full">
                <div className="relative mt-8 flex flex-col items-center md:w-[700px] m-auto">
                    {/* Đường thẳng của timeline */}
                    <div className="absolute w-1 bg-gray-300 h-full top-0 left-1/2 transform -translate-x-1/2"></div>

                    {/* Các mốc thời gian */}
                    {schedules.map((item, index) => (
                        <div key={index} className="relative flex items-center w-full mb-8">
                            {/* Chấm tròn */}
                            <div className="hidden md:block w-6 h-6 bg-blue-500 rounded-full border-4 border-white shadow-md absolute left-1/2 transform -translate-x-1/2"></div>

                            {/* Nội dung */}
                            <div className={`p-4 rounded-lg shadow-md w-56 bg-purple-100 ${index % 2 === 0 ? "ml-auto mr-6" : "mr-auto ml-6"
                                }`}>
                                <p className="text-lg font-bold text-gray-700">{item.time}</p>
                                <p className="text-sm font-semibold">{item.title}</p>
                                <p className="text-xs text-gray-500">{item.person}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
