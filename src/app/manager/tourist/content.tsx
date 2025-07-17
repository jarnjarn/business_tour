'use client'
import { useEffect, useState } from "react";
import { useTouristStore } from "@/states/tourist.state";
import { Button, Popconfirm, Input, Select, Tooltip, message } from "antd";
import { Tourist } from "@/states/tourist.state";
import dayjs from "dayjs";
import { CiEdit } from "react-icons/ci";
import { MdDeleteForever } from "react-icons/md";
import { AiOutlineSchedule } from "react-icons/ai"; 
import { UpdateTouristModal } from "@/components/modal/tourist/update.tourist";
import ListSchedule from "@/components/modal/schedule/list.schedule";
import { RequireRole } from "@/components/requireRole/RequireRole";
import { UserRole } from "@/@types/users/user.enum";
import { useNotiStore } from "@/states/noti.state";
import Link from "next/link";
export function Content() {
    const { tourists, setSelect, deleteTourist, fetchTourists, updateTourist, isLoading } = useTouristStore();
    const [query, setQuery] = useState({ page: 1, limit: 10, search: "" });
    const [messageApi, contextHolder] = message.useMessage(); // Dùng message API
    const { createNotiByStaff } = useNotiStore()
    const { getById } = useTouristStore()
    const [config, setConfig] = useState<Record<string, boolean>>({
        list: false,
        create: false,
        update: false
    });
    useEffect(() => {
        fetchTourists(query);
    }, [query]);

    const handleDelete = async (id: string) => {

        try {
            await deleteTourist(id);
            messageApi.success("Xoá thành công!");
        } catch (error) {
            messageApi.error("Xoá thất bại");
        }
    };

    const handleStatusChange = async (id: string, status: string) => {
        try {
            // Lấy thông tin chi tiết của tourist trước
            await getById(id);
            const updatedTourist = useTouristStore.getState().tourist; // Lấy dữ liệu mới nhất

            // Cập nhật trạng thái
            await updateTourist(id, { status });
            messageApi.success("Cập nhật thành công!");

            // Tạo thông báo nếu tourist tồn tại
            if (updatedTourist) {
                await createNotiByStaff({
                    receiverId: updatedTourist.user._id,
                    title: "Cập nhật trạng thái lịch trình",
                    content: `Quản trị viên đã cập nhật trạng thái đăng ký thăm quan của bạn tại ${updatedTourist.location.name} thành "${status === 'approved' ? 'Đã duyệt' : status === 'rejected' ? 'Từ chối' : 'Đang chờ'}"`,
                });
            }
        } catch (error) {
            messageApi.error("Cập nhật thất bại");
        }
    };


    const toggle = (key: string) => () => {
        setConfig((prev) => ({
            ...prev,
            [key]: !prev[key]
        }));
    };


    return (
        <>
            {contextHolder}
            <RequireRole roles={[UserRole.ADMIN, UserRole.STAFF]}>
                <div className="max-w-[100vw]">
                    <h1 className="text-lg text-center font-semibold text-lime-700 md:text-2xl">
                        DANH SÁCH LỊCH TRÌNH
                    </h1>

                    {/* MODAL */}
                    <ListSchedule open={config.list} onCancel={toggle("list")} />
                    <UpdateTouristModal open={config.update} onCancel={toggle("update")} />

                    {/* Thanh tìm kiếm */}
                    <div className="flex justify-between mb-4 flex-col md:flex-row gap-4">
                        <Input.Search
                            placeholder="Tìm kiếm theo địa điểm"
                            enterButton
                            onSearch={(value) => setQuery({ ...query, page: 1, search: value })}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {tourists?.data?.map((tourist: Tourist, index) => (
                            <div key={tourist._id} className="rounded-lg shadow overflow-hidden border hover:shadow-lg transition-all duration-200">
                                {/* Ảnh nền */}
                                <div
                                    className="h-32 bg-cover bg-center"
                                    style={{
                                        backgroundImage: `url(${tourist.location?.image || '/default-image.jpg'})`
                                    }}
                                />

                                {/* Thông tin dưới */}
                                <div className="bg-white p-4 space-y-2">
                                    <h2 className="text-lime-700 font-semibold text-base">{index + 1}. {tourist.location?.name || "N/A"}</h2>
                                    <p><strong>Người đăng ký:</strong> {tourist.user?.email || "N/A"}</p>
                                    <p><strong>Số người:</strong> {tourist.totalPeople}</p>
                                    <p><strong>Thời gian:</strong> {dayjs(tourist.form).format("DD/MM/YYYY")} - {dayjs(tourist.to).format("DD/MM/YYYY")}</p>
                                    <div>
                                        <Select
                                            defaultValue={tourist.status}
                                            className="w-full"
                                            onChange={(val) => handleStatusChange(tourist._id, val)}
                                        >
                                            <Select.Option value="pending">Đang chờ</Select.Option>
                                            <Select.Option value="approved">Đã duyệt</Select.Option>
                                            <Select.Option value="rejected">Từ chối</Select.Option>
                                        </Select>
                                    </div>
                                    <div className="flex justify-end gap-2 pt-2">
                                        <Tooltip title="Xem chi tiết">
                                            <Link href={`/manager/tourist/${tourist._id}`}>
                                                <Button size="small" type="primary">
                                                <AiOutlineSchedule />
                                                </Button>
                                            </Link>
                                        </Tooltip>
                                        
                                        <Tooltip title="Xoá">
                                            <Popconfirm title="Bạn có chắc muốn xoá?" onConfirm={() => handleDelete(tourist._id)}>
                                                <Button size="small" danger>
                                                    <MdDeleteForever />
                                                </Button>
                                            </Popconfirm>
                                        </Tooltip>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>


                </div>
            </RequireRole>
        </>
    );

}
