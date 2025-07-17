'use client'
import { UserRole } from "@/@types/users/user.enum";
import { CreateRoomModal } from "@/components/modal/room/create.room";
import ShowQr from "@/components/modal/room/showQr";
import { UpdateRoomModal } from "@/components/modal/room/update.room";
import { RequireRole } from "@/components/requireRole/RequireRole";
import { PaginationDto } from "@/dto/pagination.dto";
import { useRoomStore } from "@/states/room.state";
import { Button, Input, Popconfirm, Space, Table, Tooltip, Upload } from "antd";
import Image from "next/image";
import { useEffect, useState } from "react";
import { AiOutlinePicture, AiOutlineEdit, AiOutlineQrcode } from "react-icons/ai";

export default function RoomContent() {
    const { fetchRooms, rooms, isLoading, deleteRoom, updateRoomImg, setSelect } = useRoomStore()

    const [search, setSearch] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    const [config, setConfig] = useState<Record<string, boolean>>({
        create: false,
        update: false,
        show: false
    });
    const [query, setQuery] = useState<Record<string, any>>({
        page: 1,
        limit: 10,
        query: "",
    });
    useEffect(() => {
        loadLocations(query.page, query.limit, search);
    }, [query, search]); // Theo dõi query và search

    const loadLocations = async (page: number, limit: number, search: string) => {
        await fetchRooms({ page, limit, search });
    };

    const toggle = (key: string) => () => {
        setConfig((prev) => ({
            ...prev,
            [key]: !prev[key]
        }));
    };
    const handleUpload = (file: File) => {
        setFile(file);
        const previewUrl = URL.createObjectURL(file);
        setImageUrl(previewUrl);

        return false; // Ngăn Upload tự động
    };

    const handleUpdateImg = async (entity: any, file: File) => {
        try {
            handleUpload(file);
            const formData = new FormData();
            formData.append("image", file); // file là object kiểu File từ <Upload>
            await updateRoomImg(entity._id, formData);
            // Cập nhật lại dữ liệu sau khi upload thành công
            await loadLocations(query.page, query.limit, search);
        } catch (err) {
            console.error("Lỗi cập nhật ảnh:", err);
        }
    };


    return (
        <RequireRole roles={[UserRole.ADMIN, UserRole.STAFF]}>

            <div className="max-w-[100vw]">
                <CreateRoomModal open={config.create} onCancel={toggle("create")} />
                <UpdateRoomModal open={config.update} onCancel={toggle("update")} />
                <ShowQr open={config.show} onCancel={toggle("show")} />
                <br />
                <h1 className="text-lg text-center font-semibold text-lime-700 md:text-2xl">
                    DANH SÁCH PHÒNG
                </h1>
                <br />
                <div className="flex justify-between mb-4 flex-col md:flex-row gap-4">
                    <div className="lg:max-w-[350px] md:min-w-[350px] min-w-[100%] flex gap-2">
                        <Button onClick={toggle("create")} type="primary">
                            Tạo phòng mới
                        </Button>
                        <Input.Search
                            size="middle"
                            placeholder="Tìm kiếm theo tên"
                            enterButton
                            onSearch={(value) => {
                                setQuery((prev) => ({ ...prev, page: 1 })); // Reset về trang 1 khi tìm kiếm
                                setSearch(value);
                            }}
                        />
                    </div>
                </div>
                <Table
                    size="small"
                    dataSource={rooms?.data}
                    rowKey="_id"
                    scroll={{ x: 720 }}
                    loading={isLoading}
                    pagination={{
                        size: "default",
                        total: rooms?.total, // Tổng số địa điểm
                        pageSize: query.limit,
                        current: query.page,
                        showSizeChanger: true,
                        onChange: (page, pageSize) => {
                            setQuery({ ...query, page, limit: pageSize });
                        },
                        onShowSizeChange: (current, size) => {
                            setQuery({ ...query, page: current, limit: size });
                        },
                    }}>
                    <Table.Column width={50} align="center" title="STT" render={(_, __, index) => index + 1} />
                    <Table.Column width={150} title="Tên địa điểm" dataIndex="name" key="name" />
                    <Table.Column width={150} title="Địa điểm" dataIndex="location" key="location" render={(_, record) => record.location.name} />
                    <Table.Column width={150} title="Trạng thái" dataIndex="status" key="status" render={(_, record) => record.status ? "Phòng Trống " : "Phòng Đã Được Sử Dụng"} />
                    <Table.Column
                        width={150}
                        title="Hình ảnh"
                        dataIndex="QrCode"
                        key="QrCode"
                        render={(record, _) => (
                            <Image src={record} alt="Hình ảnh" layout="fill" objectFit="cover" className="rounded-md" />
                        )}
                    />

                    <Table.Column
                        width={150}
                        align="center"
                        title="Chức năng"
                        render={(_, entity) => (
                            <Space>
                                <Tooltip title="Cập nhật ảnh QrCode">
                                    <Upload
                                        accept="image/*"
                                        showUploadList={false}
                                        beforeUpload={(file) => {
                                            handleUpdateImg(entity, file);
                                            return false; // Quan trọng!
                                        }}
                                    >
                                        <Button type="primary">
                                            <AiOutlinePicture />
                                        </Button>
                                    </Upload>

                                </Tooltip>

                                <Tooltip title="Xem QR Code">
                                    <Button type="primary" onClick={() => {
                                        setSelect(entity as any);
                                        toggle("show")();
                                    }}>
                                        <AiOutlineQrcode />
                                    </Button>
                                </Tooltip>


                                <Button
                                    onClick={() => {
                                        useRoomStore.getState().setSelect(entity as any);
                                        toggle("update")();
                                    }}
                                    type="primary"
                                >
                                    <AiOutlineEdit />
                                </Button>

                                <Popconfirm
                                    title="Bạn có chắc chắn xóa phòng này?"
                                    okText="Có"
                                    cancelText="Không"
                                    onConfirm={() => deleteRoom(entity._id)}
                                >
                                    <Button type="primary" danger>Xóa</Button>
                                </Popconfirm>
                            </Space>
                        )}
                    />
                </Table>
            </div>
        </RequireRole>

    );
}