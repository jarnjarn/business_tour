'use client'

import { useRoomStore } from "@/states/room.state";
import { useTouristStore } from "@/states/tourist.state";
import { useScheduleStore } from "@/states/schedule.state";
import { DatePicker, message, Modal, Select } from "antd";
import type { ModalProps } from "antd"; // ✅ Đúng cách import kiểu dữ liệu
import { Form, Input } from "antd";
import dayjs from "dayjs";
import { useEffect } from "react";
import { useAuthStore } from "@/states/auth.state";
import { useUserStore } from "@/states/user.state";
import { UserRole } from "@/@types/users/user.enum";
import { RoomStatus } from "@/@types/room/room.enum";

interface CreateScheduleModalProps extends ModalProps {
    TouristId: string; // ID của địa điểm
}

export function CreateScheduleModal({ TouristId, ...props }: CreateScheduleModalProps) {
    const [form] = Form.useForm();
    const { createSchedule } = useScheduleStore();
    const { fetchUsers, users } = useUserStore()
    const [messageApi, contextHolder] = message.useMessage();
    const { list, getByLocationId } = useRoomStore()
    const { getById, tourist } = useTouristStore()
    const onFinish = async (values: any) => {
        const data = {
            touristId: TouristId,
            roomId: values.room,
            ...values
        }

        try {
            await createSchedule(data);
            messageApi.success("Tạo thành công!");
            form.resetFields();
            if (props.onCancel) props.onCancel(undefined as any);
        } catch (error) {
            messageApi.error("lỗi không thể tạo");
        }

    };

    useEffect(() => {
        if (props.open) {
            form.resetFields();
            getById(TouristId);
            fetchUsers({ page: 1, limit: 1000 });
        }
    }, [props.open]);

    useEffect(() => {
        if (tourist?.location?._id) {
            getByLocationId(tourist.location._id);
        }
    }, [tourist]);

    return (
        <>{contextHolder}

            <Modal
                {...props} // Nếu lỗi, thử sửa thành {...(props as ModalProps)}
                onOk={() => form.submit()}
                title="Thêm Lịch trình mới"
                okText="Tạo"
                cancelText="Đóng"
            >
                <Form
                    form={form}
                    onFinish={onFinish}
                    labelAlign="left"
                    labelCol={{ style: { width: 150 } }}
                >
                    <Form.Item
                        label="Tiêu Đề"
                        name="title"
                        rules={[{ required: true, message: "Vui lòng nhập Tiêu Đề" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Thời gian"
                        name="time"
                        rules={[{ required: true, message: "Ngày & giờ đến là bắt buộc!" }]}
                        initialValue={dayjs()}
                    >
                        <DatePicker showTime format="YYYY-MM-DD HH:mm" />
                    </Form.Item>
                    <Form.Item
                        label="Người hưỡng dẫn"
                        name="organizer"
                        rules={[{ required: true, message: "Vui lòng chọn Người hưỡng dẫn" }]}
                    >
                        <Select
                            options={users?.data?.filter((item: any) => item.role === UserRole.STAFF).map((item: any) => ({ label: item.username, value: item._id })) || []}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Nội dung"
                        name="content"
                        rules={[{ required: true, message: "Vui lòng nhập Nội dung" }]}
                    >
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item
                        label="Phòng"
                        name="room"
                        rules={[{ required: true, message: "Vui lòng chọn phòng" }]}
                    >
                        <Select
                            options={
                                list
                                    ?.filter((item: any) => item.status === RoomStatus.EMPTY)
                                    .map((item: any) => ({
                                        label: item.name,
                                        value: item._id,
                                    })) || []
                            }
                        />
                    </Form.Item>

                </Form>
            </Modal>
        </>
    );
}
