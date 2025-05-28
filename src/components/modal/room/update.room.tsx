'use client'
import { DatePicker, Modal } from "antd";
import type { ModalProps } from "antd"; // ✅ Đúng cách import kiểu dữ liệu
import { Form, Input, message } from "antd";
import { useEffect } from "react";
import dayjs from "dayjs";
import { useScheduleStore } from "@/states/schedule.state";
import { useRoomStore } from "@/states/room.state";

export function UpdateRoomModal(props: ModalProps) {
    const { select, updateRoom } = useRoomStore();
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();


    const onFinish = async (values: any) => {
        console.log(select)
        if (!select) {
            messageApi.error("Không có lựa chọn được chọn!");
            return;
        }
        try {
            await updateRoom(select._id, values);
            messageApi.success("Cập nhập thành công!");
            if (props.onCancel) {
                props.onCancel(null as any);
            }
        } catch (error) {
            messageApi.error("Không thể cập nhập!");
        }
    };


    useEffect(() => {
        if (props.open && select) {
            form.setFieldsValue({
                ...select,
            });
        } else {
            form.resetFields();
        }
    }, [props.open, select]);



    return (
        <>
            {contextHolder}
            <Modal
                {...props} // Nếu lỗi, thử sửa thành {...(props as ModalProps)}
                onOk={() => form.submit()}
                title="Cập Nhập phòng"
                okText="Cập Nhập"
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
                        rules={[{ required: true, message: "Vui lòng nhập Số lượng tối đa" }]}
                    >
                        <Input />
                    </Form.Item>
                    
                </Form>
            </Modal>

        </>
    );
}
