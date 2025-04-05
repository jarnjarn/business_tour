'use client'
import { Modal } from "antd";
import type { ModalProps } from "antd"; // ✅ Đúng cách import kiểu dữ liệu
import { Form, Input, message } from "antd";
import { useEffect } from "react";
import { useLocationStore } from "@/states/location.store";

export function UpdateLocationModal(props: ModalProps) {
    const { select, updateLocation } = useLocationStore();
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();


    const onFinish = async (values: any) => {
        if (!select) {
            messageApi.error("Không có địa điểm nào được chọn!");
            return;
        }

        try {
            await updateLocation(select._id, values); // Đảm bảo gọi hàm đúng
            messageApi.success("Cập nhật địa điểm thành công!");

            if (props.onCancel) {
                props.onCancel(null as any);
            }
        } catch (error) {
            messageApi.error("Cập nhập địa điểm thất bại!");
        }
    };


    useEffect(() => {
        if (props.open && select) {
            form.setFieldsValue({
                ...select,
            });
        } else {
            form.resetFields(); // Reset khi đóng modal
        }
    }, [props.open, select]); // ✅ Theo dõi cả select



    return (
        <>
            {contextHolder}
            <Modal
                {...props} // Nếu lỗi, thử sửa thành {...(props as ModalProps)}
                onOk={() => form.submit()}
                title="Cập Nhập thông tin Địa Điểm"
                okText="Cập Nhập"
                cancelText="Đóng"
            >
                <Form
                    form={form}
                    onFinish={onFinish}
                    labelAlign="left"
                    labelCol={{ style: { width: 120 } }}
                >
                    <Form.Item
                        label="Tên địa điểm"
                        name="name"
                        rules={[{ required: true, message: "Vui lòng nhập tên địa điểm" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="địa điểm"
                        name="address"
                        rules={[{ required: true, message: "Vui lòng nhập địa điểm" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Mô tả"
                        name="description"
                        rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
                    >
                        <Input.TextArea />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}
