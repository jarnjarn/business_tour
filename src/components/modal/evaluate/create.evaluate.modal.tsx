import { useState } from "react";
import { Modal, Form, Input, Rate, message } from "antd";
import { useAuthStore } from "@/states/auth.state";
import { useEvaluateStore } from "@/states/evaluate.state";

interface CreateEvaluateModalProps {
    locationId: string;
    open: boolean;
    onCancel: () => void;
}

export function CreateEvaluateModal({ locationId, open, onCancel }: CreateEvaluateModalProps) {
    const [form] = Form.useForm();
    const { auth } = useAuthStore();
    const { createEvaluate } = useEvaluateStore();
    const [messageApi, contextHolder] = message.useMessage();
    const [star, setStar] = useState(0);

    const onFinish = async (values: any) => {
        if (!auth) {
            messageApi.error("Bạn cần đăng nhập để đánh giá!");
            return;
        }

        const payload = {
            location: locationId,
            star,
            content: values.comment as string,
        };

        try {
            await createEvaluate(payload);
            messageApi.success("Đánh giá thành công!");
            form.resetFields();
            setStar(0);
            onCancel();
        } catch (error) {
            messageApi.error("Đánh giá thất bại! Vui lòng thử lại.");
            console.error(error);
        }
    };

    return (
        <>{contextHolder}
            <Modal
                title="Đánh giá địa điểm"
                open={open}
                onOk={() => form.submit()}
                onCancel={onCancel}
                okText="Gửi đánh giá"
                cancelText="Hủy"
            >
                <Form form={form} onFinish={onFinish} labelAlign="left" labelCol={{ span: 6 }}>
                    <Form.Item label="Số sao">
                        <Rate value={star} onChange={setStar} />
                    </Form.Item>
                    <Form.Item label="Bình luận" name="comment" rules={[{ required: true, message: "Vui lòng nhập bình luận!" }]}> 
                        <Input.TextArea rows={4} />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}
