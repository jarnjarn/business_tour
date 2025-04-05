'use client'

import { useScheduleStore } from "@/states/schedule.state";
import { DatePicker, message, Modal } from "antd";
import type { ModalProps } from "antd"; // ✅ Đúng cách import kiểu dữ liệu
import { Form, Input } from "antd";
import dayjs from "dayjs";
import { useEffect } from "react";

interface CreateScheduleModalProps extends ModalProps {
    TouristId: string; // ID của địa điểm
}

export function CreateScheduleModal({ TouristId, ...props }: CreateScheduleModalProps) {
    const [form] = Form.useForm();
    const { createSchedule } = useScheduleStore();
    const [messageApi, contextHolder] = message.useMessage();

    const onFinish = async (values: any) => {

        const data = {
            touristId: TouristId,
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
        }
    }, [props.open]);

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
                        rules={[{ required: true, message: "Vui lòng nhập Tiêu Đề" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Nội dung"
                        name="content"
                        rules={[{ required: true, message: "Vui lòng nhập Nội dung" }]}
                    >
                        <Input.TextArea />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}
