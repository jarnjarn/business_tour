'use client'

import { useRoomStore } from "@/states/room.state";
import { DatePicker, InputNumber, message, Modal } from "antd";
import type { ModalProps } from "antd"; // ✅ Đúng cách import kiểu dữ liệu
import { Form, Input } from "antd";
import dayjs from "dayjs";
import { useEffect } from "react";

interface CreateRoomModalProps extends ModalProps {
    LocationId: string; // ID của địa điểm
}

export function CreateRoomModal({ LocationId, ...props }: CreateRoomModalProps) {
    const [form] = Form.useForm();
    const { createRoom } = useRoomStore();
    const [messageApi, contextHolder] = message.useMessage();

    const onFinish = async (values: any) => {
        console.log(LocationId)

        const data = {
            location: LocationId,
            ...values
        }

        try {
            await createRoom(data);
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
                title="Thêm phòng mới"
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
                        label="Tên phòng"
                        name="name"
                        rules={[{ required: true, message: "Vui lòng nhập Tên phòng" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Mô tả"
                        name="description"
                        rules={[{ required: true, message: "Vui lòng nhập Mô tả" }]}
                    >
                        <Input.TextArea />
                    </Form.Item>

                    <Form.Item
                        label="Số lượng tối đa"
                        name="capacity"
                        rules={[{ required: true, message: "Vui lòng nhập Số lượng người tối đa" }]}
                    >
                        <InputNumber />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}
