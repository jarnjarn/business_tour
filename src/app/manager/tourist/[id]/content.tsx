'use client'

import { useParams } from "next/navigation";
import { useTouristStore } from "@/states/tourist.state";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Button, DatePicker, message } from "antd";
import { useScheduleStore } from "@/states/schedule.state";
import dayjs from "dayjs";
import QRCode from 'qrcode';
import { IUserRegister } from "@/models/tourist.model";
import { CreateScheduleModal } from "@/components/modal/schedule/create.schedule";
import { UpdateScheduleModal } from "@/components/modal/schedule/update.schedule";
import { EditOutlined } from "@ant-design/icons";

export default function TouristDetail() {
    const [fromDate, setFromDate] = useState<dayjs.Dayjs | null>(null);
    const [toDate, setToDate] = useState<dayjs.Dayjs | null>(null);
    const [qrRegisterUrl, setQrRegisterUrl] = useState<string | null>(null);
    const [qrUnregisterUrl, setQrUnregisterUrl] = useState<string | null>(null);
    const [config, setConfig] = useState<Record<string, boolean>>({
        create: false,
        update: false
    });
    const qrRef = useRef<HTMLDivElement | null>(null);

    const { id } = useParams();
    const { getById, tourist } = useTouristStore();
    const { list, getByIdTourist, } = useScheduleStore();

    useEffect(() => {
        const fetchData = async () => {
            getById(id as string);
            getByIdTourist(id as string);
            const qrRegisterUrl = localStorage.getItem(`qrRegisterUrl-${id}`);
            const qrUnregisterUrl = localStorage.getItem(`qrUnregisterUrl-${id}`);
            if (qrRegisterUrl) {
                const qr = await QRCode.toDataURL(qrRegisterUrl);
                setQrRegisterUrl(qr);
            }
            if (qrUnregisterUrl) {
                const qr = await QRCode.toDataURL(qrUnregisterUrl);
                setQrUnregisterUrl(qr);
            }
        };
        fetchData();
    }, [id]);

    useEffect(() => {
        const interval = setInterval(() => {
            getByIdTourist(id as string);
            getById(id as string);
        }, 10000);
        return () => clearInterval(interval);
    }, [id]);

    const handleCreateQR = async () => {
        if (!fromDate || !toDate) {
            message.warning("Vui lòng chọn ngày bắt đầu và ngày kết thúc!");
            return;
        }

        const baseUrl = "https://business-tour.duckdns.org/";

        const registerUrl = `${baseUrl}/checkin/${tourist?._id}?from=${encodeURIComponent(fromDate.format('YYYY-MM-DD HH:mm'))}&to=${encodeURIComponent(toDate.format('YYYY-MM-DD HH:mm'))}&type=REGISTER`;
        const unregisterUrl = `${baseUrl}/checkin/${tourist?._id}?from=${encodeURIComponent(fromDate.format('YYYY-MM-DD HH:mm'))}&to=${encodeURIComponent(toDate.format('YYYY-MM-DD HH:mm'))}&type=UNREGISTER`;

        try {
            const registerQR = await QRCode.toDataURL(registerUrl);
            const unregisterQR = await QRCode.toDataURL(unregisterUrl);

            setQrRegisterUrl(registerQR);
            setQrUnregisterUrl(unregisterQR);

            localStorage.setItem(`qrRegisterUrl-${tourist?._id}`, registerUrl);
            localStorage.setItem(`qrUnregisterUrl-${tourist?._id}`, unregisterUrl);

            setTimeout(() => {
                qrRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 200);

        } catch (err) {
            message.error("Tạo ảnh QR thất bại");
            console.error(err);
        }
    };

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
            <div className="flex flex-col gap-4 items-center justify-center bg-gray-100 p-4 rounded-lg mb-2">
                <h1 className="text-2xl font-bold">Thông tin chuyến tham quan - {tourist?.location?.name}</h1>
            </div>

            <div className="flex flex-col gap-4 items-center justify-center">
                {tourist?.location?.image && (
                    <div className="w-full h-full max-w-[500px] max-h-[500px] mx-auto rounded-lg overflow-hidden">
                        <Image
                            src={tourist.location.image}
                            alt={tourist.location.name || "Ảnh địa điểm"}
                            width={500}
                            height={500}
                            className="object-cover"
                        />
                    </div>
                )}
            </div>

            <div className="flex flex-row gap-4 items-center justify-center max-w-[600px] m-auto mt-6">
                <DatePicker
                    showTime
                    placeholder="Ngày có hiệu lực"
                    value={fromDate}
                    onChange={(value) => setFromDate(value)}
                    className="w-full"
                />
                <DatePicker
                    showTime
                    placeholder="Ngày hết hiệu lực"
                    value={toDate}
                    onChange={(value) => setToDate(value)}
                    className="w-full"
                />
                <Button type="primary" onClick={handleCreateQR}>
                    Tạo QR
                </Button>
            </div>

            <div ref={qrRef} className="container mx-auto mt-6">
                <div className="flex flex-col md:flex-row gap-6 items-start justify-center w-full p-4">
                    <div className="flex flex-row gap-6 items-center w-1/2">
                        <div className="flex flex-col items-center gap-3">
                            <h2 className="text-lg font-semibold text-green-600">QR Check in</h2>
                            {qrRegisterUrl ? (
                                <>
                                    <Image src={qrRegisterUrl} alt="QR Register" width={200} height={200} />
                                    <Button type="primary" onClick={() => {
                                        const a = document.createElement('a');
                                        a.href = qrRegisterUrl;
                                        a.download = 'qr-register.png';
                                        a.click();
                                    }}>
                                        Tải về
                                    </Button>
                                </>
                            ) : <p>Chưa có QR</p>}
                        </div>

                        <div className="flex flex-col items-center gap-3">
                            <h2 className="text-lg font-semibold text-red-600">QR Check out</h2>
                            {qrUnregisterUrl ? (
                                <>
                                    <Image src={qrUnregisterUrl} alt="QR Unregister" width={200} height={200} />
                                    <Button type="primary" danger onClick={() => {
                                        const a = document.createElement('a');
                                        a.href = qrUnregisterUrl;
                                        a.download = 'qr-unregister.png';
                                        a.click();
                                    }}>
                                        Tải về
                                    </Button>
                                </>
                            ) : <p>Chưa có QR</p>}
                        </div>
                    </div>

                    <div className="flex-1 w-1/2">
                        <h1 className="text-xl font-bold mb-4">Danh sách người tham dự</h1>
                        <div className="flex flex-col gap-2 h-[250px] overflow-y-auto">
                            {tourist?.userRegister?.length ? (
                                tourist.userRegister.map((item: IUserRegister, index: number) => (
                                    <div key={index} className="flex items-center justify-between px-4 py-2 rounded-md border bg-white shadow-sm">
                                        <div className="text-sm">
                                            <p className="font-medium">{item.name}</p>
                                            <p className="text-gray-500 text-xs">{item.phone} - {item.group}</p>
                                        </div>
                                        <span className={`text-sm font-semibold px-2 py-1 rounded-full w-24 text-center ${item.type === "REGISTER" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                            {item.type === "REGISTER" ? "Check in" : "Check out"}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <p>Chưa có ai tham gia</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto mt-6">
                <div className="relative flex flex-col items-center md:w-[700px] m-auto bg-gray-100 p-4 rounded-lg">
                    <h1 className="text-2xl font-bold mb-4">Lịch trình chuyến tham quan</h1>
                    <Button className="m-2" onClick={toggle("create")}>Thêm Lịch trình mới</Button>
                    {tourist?._id && (
                        <CreateScheduleModal
                            TouristId={tourist._id}
                            open={config.create}
                            onCancel={toggle("create")}
                        />
                    )}

                    {config.update && (
                        <UpdateScheduleModal open={true} onCancel={toggle("update")} />
                    )}

                    {list?.map((item: any, index: number) => (
                        <div key={index} className="relative flex items-center w-full mb-8">
                            <div className="hidden md:block w-6 h-6 bg-blue-500 rounded-full border-4 border-white shadow-md absolute left-1/2 transform -translate-x-1/2" />

                            <div className={`relative p-4 rounded-lg shadow-md w-56 bg-purple-100 ${index % 2 === 0 ? "ml-auto mr-6" : "mr-auto ml-6"}`}>
                                <EditOutlined
                                    className="absolute top-2 right-2 text-gray-600 hover:text-blue-600 cursor-pointer"
                                    onClick={toggle("update")}
                                />
                                <p className="text-lg font-bold text-gray-700">{dayjs(item.time).format("DD/MM/YYYY HH:mm")}</p>
                                <p className="text-lg font-semibold">{item.title}</p>
                                <p className="text-sm">Nội dung: {item.content}</p>
                                <p className="text-xs text-gray-500">Người hướng dẫn: {item.organizer?.username || "Không rõ"}</p>
                                <p className="text-xs text-gray-500">Phòng: {item.room?.name || "Không rõ"}</p>
                            </div>
                        </div>
                    ))}

                </div>
            </div>


        </div>
    );
}
