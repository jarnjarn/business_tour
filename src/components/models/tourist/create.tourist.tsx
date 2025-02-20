import { Form,  Input,  Modal,  ModalProps} from "antd";
import { useEffect } from "react";

export function CreateTouristModal(prop: ModalProps) {
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
            title="Cập nhật chủ đề"
            okText="Cập nhật"
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
                    label="Tên địa điểm"
                    name="name"
                    rules={[{ required: true, message: "Tên địa điểm là bắt buộc!" }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Mô tả"
                    name="location"
                    rules={[{ required: true, message: "Mô tả là bắt buộc!" }]}
                >
                    <Input type="text" />
                </Form.Item>
               
            </Form>
        </Modal>
    );
}
