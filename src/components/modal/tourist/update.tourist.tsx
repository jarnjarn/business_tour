'use client'
import { Modal } from "antd";
import type { ModalProps } from "antd"; // ✅ Đúng cách import kiểu dữ liệu
import { Form, Input, message } from "antd";
import { useEffect } from "react";
import { useTouristStore } from "@/states/tourist.state";

export function UpdateTouristModal(props: ModalProps) {
    const { select, updateTourist } = useTouristStore();
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();

    const onFinish = async (values: any) => {
        console.log(select)
        if (!select) {
            messageApi.error("Không có lựa chọn được chọn!");
            return;
        }
        
        try {
            await updateTourist(select._id, values);
            messageApi.success("Cập nhật thành công!");
            
            if (props.onCancel) {
                props.onCancel(null as any);
            }
        } catch (error) {
            messageApi.error("Cập nhập thất bại!");
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
                title="Cập Nhập thông tin"
                okText="Cập Nhập"
                cancelText="Đóng"
            >
                <Form
                    form={form}
                    onFinish={onFinish}
                    labelAlign="left"
                    labelCol={{ style: { width: 180 } }}
                >
                    <Form.Item
                        label="Số người tham quan"
                        name="totalPeople"
                        rules={[{ required: true, message: "Vui lòng điền số lượng người tham gia" }]}
                    >
                        <Input type="number" />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}
