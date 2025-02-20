'use client'
import { CreateScheduleModal } from "@/components/models/schedules/create.schedule";
import Image from "next/image";
import { useState } from "react";

type Commonplace = {
    id: number;
};
const image = "/02.jpg"

export function Content(props: Commonplace) {

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
        
    return (
        <div>
            <CreateScheduleModal open={config.create} onCancel={toggle("create")} />
            <div className="m-3">
                <div>
                    <h1 className="text-xl md:text-2xl mt-6 font-semibold text-lime-700">Chi tiết - Khu vực đào tạo và thực hành phân tích của ngành thực phẩm tại LHU</h1>
                </div>
                <div className="mt-3 md:m-6 text-center">
                    <Image
                        src={image}
                        alt={image}
                        width={600}
                        height={400}
                        className="m-auto rounded-lg shadow-lg"
                    />
                    <p className="italic mt-3">H1. Khu vực đào tạo và thực hành phân tích của ngành thực phẩm tại LHU</p>
                </div>
            </div>
            <div className="p-6 bg-gray-100 rounded-lg shadow-md">
                <h2 className="text-lg font-bold text-lime-700">Giới thiệu về khu vực đào tạo</h2>
                <p className="mt-2 text-gray-700">Tại Đại học Lạc Hồng (LHU), khu vực đào tạo và thực hành phân tích ngành thực phẩm được xây dựng nhằm cung cấp môi trường học tập chuyên sâu, giúp sinh viên tiếp cận với các thiết bị và công nghệ hiện đại trong lĩnh vực công nghệ thực phẩm.</p>

                <h2 className="text-lg font-bold text-lime-700 mt-4">Trang thiết bị hiện đại</h2>
                <ul className="list-disc pl-5 mt-2 text-gray-700">
                    <li>Máy quang phổ UV-Vis, sắc ký lỏng hiệu năng cao (HPLC), và các thiết bị phân tích thành phần dinh dưỡng.</li>
                    <li>Hệ thống vi sinh để kiểm tra chất lượng thực phẩm, đảm bảo tiêu chuẩn an toàn thực phẩm.</li>
                    <li>Khu vực chế biến thử nghiệm giúp sinh viên thực hành phát triển sản phẩm mới.</li>
                </ul>

                <h2 className="text-lg font-bold text-lime-700 mt-4">Cơ hội học tập và nghiên cứu</h2>
                <p className="mt-2 text-gray-700">Sinh viên không chỉ được hướng dẫn về kỹ thuật phân tích thực phẩm mà còn có cơ hội tham gia các dự án nghiên cứu cùng giảng viên và doanh nghiệp đối tác. Điều này giúp nâng cao kỹ năng thực tế và chuẩn bị tốt cho công việc sau khi ra trường.</p>

                <h2 className="text-lg font-bold text-lime-700 mt-4">Ứng dụng thực tế trong ngành công nghiệp thực phẩm</h2>
                <p className="mt-2 text-gray-700">Các kiến thức và kỹ năng thực hành tại đây giúp sinh viên có thể làm việc tại các phòng kiểm nghiệm thực phẩm, công ty sản xuất thực phẩm và cơ quan kiểm định chất lượng.</p>
            </div>
            <div className="mt-3 mb-3">
                <button
                    onClick={toggle("create")}
                    className="bg-blue-600 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg m-1 text-sm md:text-base"
                >
                    Đăng ký tham quan ngay
                </button>
            </div>
        </div>
    )
}
