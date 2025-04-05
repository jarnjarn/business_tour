'use client'
import { Button, Input, Modal, ModalProps, Popconfirm, Space, Table } from "antd";
import { useEffect, useState } from "react";
import { UpdateTouristModal } from "../tourist/update.tourist";
import { CreateScheduleModal } from "./create.schedule";
import { useTouristStore } from "@/states/tourist.state";
import { useScheduleStore } from "@/states/schedule.state";
import dayjs from "dayjs";
import { UpdateScheduleModal } from "./update.schedule";

export default function ListSchedule(props: ModalProps) {
    const [config, setConfig] = useState<Record<string, boolean>>({
        create: false,
        update: false
    });
    const { select } = useTouristStore()
    const { list, getByIdTourist, deleteSchedule,setSelect } = useScheduleStore()

    const toggle = (key: string) => {
        return async () => {
            setConfig({
                ...config,
                [key]: !config[key]
            });
        }
    }

    const handleDelete = async (id: string) => {
        await deleteSchedule(id);
    };


    useEffect(() => {
        console.log(select?._id)
        getByIdTourist(select?._id as any);
    }, [select]);

    return (
        <div className={"max-w-[1000px]"}>
            <Modal
                {...props}
                title="Danh sách lịch trình"
                cancelText="Đóng"
                width={1240}
            >
                <div>
                    <CreateScheduleModal TouristId={select?._id as any} open={config.create} onCancel={toggle("create")} />
                    <UpdateScheduleModal open={config.update} onCancel={toggle("update")} />
                    <div className="flex justify-between mb-4 flex-col md:flex-row gap-4">
                        <div className="lg:max-w-[350px] md:min-w-[350px] min-w-[100%] flex gap-2">
                            <Button onClick={toggle("create")} type="primary">
                                Thêm lịch chình mới
                            </Button>
                            <Button onClick={() => {
                                if (select && select._id) {
                                    getByIdTourist(select?._id as any);
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
                    <Table.Column width={150} title="Tiêu đề" dataIndex="title" key="title" />
                    <Table.Column width={150} title="Nội dung" dataIndex="content" key="content" />
                    <Table.Column
                        width={150}
                        title="Ngày bắt đầu"
                        dataIndex="time"
                        key="time"
                        render={(date) => dayjs(date).format("DD/MM/YYYY:HH")}
                    />
                    <Table.Column width={150} title="Người hưỡng dẫn" dataIndex="organizer" key="organizer" />

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