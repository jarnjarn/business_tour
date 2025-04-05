"use client";
import { Modal, Form, Input, message } from "antd";
import type { ModalProps } from "antd";
import { useEffect } from "react";
import { useUserStore } from "@/states/user.state";

export function ChangePasswordModal(props: ModalProps) {
    const { select, changePassword } = useUserStore();
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage(); // Dùng message API

    const onFinish = async (values: any) => {
        if (!select) return;

        if (values.newPassword !== values.confirmPassword) {
            messageApi.error("Mật khẩu mới không khớp!");
            return;
        }
        const data = {
            oldPassword: values.oldPassword,
            newPassword: values.newPassword,
        }

        try {
            await changePassword(select._id, data);

            messageApi.success("Đổi mật khẩu thành công!");

            if (props.onCancel) props.onCancel(null as any);
        } catch (error) {
            messageApi.error("Đổi mật khẩu thất bại, vui lòng thử lại!");
            console.error("Lỗi khi đổi mật khẩu:", error);
        }
    };

    useEffect(() => {
        if (!props.open) {
            form.resetFields(); // Reset khi đóng modal
        }
    }, [props.open]);

    return (
        <>
            {contextHolder} {/* Để hiển thị message */}
            <Modal
                {...props}
                onOk={() => form.submit()}
                title="Đổi Mật Khẩu"
                okText="Đổi"
                cancelText="Đóng"
            >
                <Form
                    form={form}
                    onFinish={onFinish}
                    labelAlign="left"
                    labelCol={{ style: { width: 120 } }}
                >
                    <Form.Item
                        label="Mật khẩu cũ"
                        name="oldPassword"
                        rules={[{ required: true, message: "Vui lòng nhập Mật khẩu cũ" }]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        label="Mật khẩu mới"
                        name="newPassword"
                        rules={[{ required: true, message: "Vui lòng nhập Mật khẩu mới" }]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        label="Nhập lại mật khẩu"
                        name="confirmPassword"
                        dependencies={["newPassword"]}
                        rules={[
                            { required: true, message: "Vui lòng nhập lại Mật khẩu mới" },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue("newPassword") === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error("Mật khẩu mới không khớp!"));
                                },
                            }),
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}
