'use client'
import { Modal, Select } from "antd";
import type { ModalProps } from "antd"; // ✅ Đúng cách import kiểu dữ liệu
import { Form, Input, message } from "antd";
import { useEffect } from "react";
import { useLocationStore } from "@/states/location.store";
import { UserHelper } from "@/common/helpers/user.helper";
import { useUserStore } from "@/states/user.state";

export function UpdateUserModal(props: ModalProps) {
    const { select, updateUser } = useUserStore();
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();

    const onFinish = async (values: any) => {
        if (!select) {
            messageApi.error("Không có địa điểm nào được chọn!");
            return;
        }

        try {
            await updateUser(select._id, values); // Đảm bảo gọi hàm đúng
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

        <>{
            contextHolder
        }
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
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: "Vui lòng nhập Email" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Số điện thoại"
                        name="phone"
                        rules={[{ required: true, message: "Vui lòng nhập Số điện thoại" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Quyền"
                        name="role"
                        rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
                    >
                        <Select
                            size={"middle"}
                            className={"md:min-w-[350px] min-w-[100%]"}
                            options={UserHelper.toListRole()}
                            onChange={(value) => {
                                //@ts-ignore
                                setSelect({
                                    ...select,
                                    role: value
                                });
                            }}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}
