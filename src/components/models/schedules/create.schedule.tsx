import { Form, Input, Modal, ModalProps, DatePicker } from "antd";
import { useEffect } from "react";
import dayjs from "dayjs";

export function CreateScheduleModal(prop: ModalProps) {
    const [form] = Form.useForm();

    const onFinish = (values: any) => {
        if (prop.onCancel) {
            prop.onCancel(undefined as any);
        }
    };

    useEffect(() => {
        if (prop.open) {
            form.resetFields();
        }
    }, [prop.open]);
    return (
        <Modal
            {...prop}
            title="Đăng ký tham quan"
            okText="Đăng ký"
            cancelText="Đóng"
            onOk={() => form.submit()}
        >
            <Form
                form={form}
                onFinish={onFinish}
                labelAlign="left"
                labelCol={{ style: { width: 200 } }}
            >
                <Form.Item
                    label="Người đăng ký"
                    name="name"
                    rules={[{ required: true, message: "Người đăng ký là bắt buộc!" }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        { required: true, message: "Email là bắt buộc!" },
                        { type: "email", message: "Email không hợp lệ!" }
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Số điện thoại"
                    name="phone"
                    rules={[{ required: true, message: "Số điện thoại là bắt buộc!" }]}
                >
                    <Input type="text" />
                </Form.Item>
                <Form.Item
                    label="Số lượng người thăm quan"
                    name="quantity"
                    rules={[{ required: true, message: "Số lượng là bắt buộc!" }]}
                >
                    <Input type="number" />
                </Form.Item>
                <Form.Item
                    label="Địa điểm thăm quan"
                    name="location"
                    rules={[{ required: true, message: "Địa điểm thăm quan là bắt buộc!" }]}
                >
                    <Input type="text" />
                </Form.Item>
                <Form.Item
                    label="Ngày & Giờ đến"
                    name="arrival"
                    rules={[{ required: true, message: "Ngày & giờ đến là bắt buộc!" }]}
                    initialValue={dayjs()} // 👈 Đặt giá trị mặc định
                >
                    <DatePicker showTime format="YYYY-MM-DD HH:mm" />
                </Form.Item>

                <Form.Item
                    label="Ngày & Giờ rời đi"
                    name="departure"
                    rules={[{ required: true, message: "Ngày & giờ rời đi là bắt buộc!" }]}
                    initialValue={dayjs().add(1, "day")} // 👈 Đặt giá trị mặc định (1 ngày sau)
                >
                    <DatePicker showTime format="YYYY-MM-DD HH:mm" />
                </Form.Item>
            </Form>
        </Modal>
    );
}
