'use client';

import { useEffect, useState } from "react";
import { CreateLocationModal } from "@/components/modal/location/create.modal";
import { UpdateLocationModal } from "@/components/modal/location/update.model";
import { Input, Button, Popconfirm, Space, Table, Tooltip } from "antd";
import Image from "next/image";
import { useLocationStore } from "@/states/location.store";
import { RequireRole } from "@/components/requireRole/RequireRole";
import { UserRole } from "@/@types/users/user.enum";
import { AiOutlineSchedule } from "react-icons/ai";
import ListRoom from "@/components/modal/room/listRoom.location";
export function ManagerTourContentPage() {
    const { locations, fetchLocations, deleteLocation, isLoading } = useLocationStore();
    const [search, setSearch] = useState("");
    const [config, setConfig] = useState<Record<string, boolean>>({
        create: false,
        update: false,
        list: false
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
        await fetchLocations({ page, limit, search });
    };

    const toggle = (key: string) => () => {
        setConfig((prev) => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    return (
        <RequireRole roles={[UserRole.ADMIN, UserRole.STAFF]}>
            <div className="max-w-[100vw]">
                <br />
                <h1 className="text-lg text-center font-semibold text-lime-700 md:text-2xl">
                    DANH SÁCH ĐỊA ĐIỂM
                </h1>
                <br />
                <CreateLocationModal open={config.create} onCancel={toggle("create")} />
                <ListRoom open={config.list} onCancel={toggle("list")} />
                <UpdateLocationModal open={config.update} onCancel={toggle("update")} />
                <div className="flex justify-between mb-4 flex-col md:flex-row gap-4">
                    <div className="lg:max-w-[350px] md:min-w-[350px] min-w-[100%] flex gap-2">
                        <Button onClick={toggle("create")} type="primary">
                            Tạo địa điểm mới
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
                    dataSource={locations?.data}
                    rowKey="_id"
                    scroll={{ x: 720 }}
                    loading={isLoading}
                    pagination={{
                        size: "default",
                        total: locations?.total, // Tổng số địa điểm
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
                    <Table.Column
                        width={150}
                        title="Hình ảnh"
                        dataIndex="image"
                        key="image"
                        render={(img) => (
                            <div className="relative w-16 h-16">
                                <Image src={img} alt="Hình ảnh" layout="fill" objectFit="cover" className="rounded-md" />
                            </div>
                        )}
                    />
                    <Table.Column
                        width={250}
                        title="Mô tả"
                        key="description"
                        render={(_, record) => (
                            <div className="line-clamp-3 break-words">{record.description}</div>
                        )}
                    />

                    <Table.Column
                        width={150}
                        align="center"
                        title="Chức năng"
                        render={(_, entity) => (
                            <Space>
                                <Tooltip title="Xem danh sách phòng">
                                    <Button
                                        onClick={() => {
                                            useLocationStore.getState().setSelect(entity as any);
                                            toggle("list")();
                                        }}
                                        type={"primary"}
                                    ><AiOutlineSchedule /></Button>
                                </Tooltip>
                                <Button
                                    onClick={() => {
                                        useLocationStore.getState().setSelect(entity as any);
                                        toggle("update")();
                                    }}
                                    type="primary"
                                >
                                    Cập nhật
                                </Button>

                                <Popconfirm
                                    title="Bạn có chắc chắn xóa địa điểm này?"
                                    okText="Có"
                                    cancelText="Không"
                                    onConfirm={() => deleteLocation(entity._id)}
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