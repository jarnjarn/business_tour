'use client'
import { Button, Input, Modal, ModalProps, Popconfirm, Select, Space, Table, Tag } from "antd";
import { useEffect, useState } from "react";
import { Room, useRoomStore } from "@/states/room.state";
import { useLocationStore } from "@/states/location.store";
import { CreateRoomModal } from "./create.room";
import { UpdateRoomModal } from "./update.room";
import { RoomStatus } from "@/@types/room/room.enum";
export default function ListRoom(props: ModalProps) {
    const [config, setConfig] = useState<Record<string, boolean>>({
        create: false,
        update: false
    });
    const { select } = useLocationStore()
    const { list, getByLocationId, deleteRoom,setSelect,updateRoom } = useRoomStore()

    const toggle = (key: string) => {
        return async () => {
            setConfig({
                ...config,
                [key]: !config[key]
            });
        }
    }

    const handleDelete = async (id: string) => {
        await deleteRoom(id);
    };

    const handleChangeStatus = async (id: string, status: string) => {
        await updateRoom(id, { status: status as RoomStatus });
    }
    useEffect(() => {
        if (select && select._id) {
            getByLocationId(select?._id as any);
        }
    }, [select]);

    return (
        <div className={"max-w-[1000px]"}>
            <Modal
                {...props}
                title="Danh sách phòng" 
                cancelText="Đóng"
                width={1240}
            >
                <div>
                    <CreateRoomModal open={config.create} onCancel={toggle("create")} />
                    <UpdateRoomModal open={config.update} onCancel={toggle("update")} />
                    <div className="flex justify-between mb-4 flex-col md:flex-row gap-4">
                        <div className="lg:max-w-[350px] md:min-w-[350px] min-w-[100%] flex gap-2">
                            <Button onClick={toggle("create")} type="primary">
                                Thêm phòng mới
                            </Button>
                            <Button onClick={() => {
                                if (select && select._id) {
                                    getByLocationId(select?._id as any);
                                }
                            }} type="primary">
                                Tải lại
                            </Button>
                            <Input.Search
                                size="middle"
                                placeholder="Tìm kiếm theo tên"
                                enterButton
                                onSearch={(value) => {
                                    // setQuery((prev) => ({ ...prev, page: 1 }));
                                    // setSearch(value);
                                }}
                            />
                        </div>
                    </div>
                </div>

                <Table size={"small"} dataSource={list} rowKey="id" scroll={{ x: 720 }}
                    onRow={(record) => ({
                        onClick: () => {
                            setSelect(record);
                        }
                    })}
                >
                    <Table.Column width={50} align={"center"} title="STT" render={(_, __, index) => index + 1} />
                    <Table.Column width={150} title="Tên phòng" dataIndex="name" key="name" />
                    <Table.Column width={150} title="Mô tả" dataIndex="description" key="description" />
                    <Table.Column width={150} title="Số lượng tối đa" dataIndex="capacity" key="capacity" />
                    <Table.Column
                        width={150}
                        title="Trạng thái"
                        dataIndex="status"
                        key="status"
                        render={(status, record: Room) => (
                            <Select
                                defaultValue={status}
                                style={{ width: 120 }}
                                onChange={(value) => handleChangeStatus(record._id, value)}>
                                <Select.Option value={RoomStatus.EMPTY}>Phòng Trống</Select.Option>
                                <Select.Option value={RoomStatus.BUSY}>Phòng Bận</Select.Option>
                            </Select>
                        )}
                    />

                    <Table.Column width={150} align={"center"} title="Chức năng" render={(_, entity: any) => (
                        <Space>
                            <Button type={"primary"} onClick={toggle("update")}>Cập nhật</Button>
                            <Popconfirm title={"Bạn có chắc chắn xóa người dùng này ?"} okText={"Có"} cancelText={"Không"}
                                onConfirm={() => handleDelete(entity._id)}>
                                <Button type={"primary"} danger>Xóa</Button>
                            </Popconfirm>
                        </Space>
                    )} />
                </Table>
            </Modal>

        </div>
    );
}