import { Modal } from "antd";
import type { ModalProps } from "antd"; // ✅ Đúng cách import kiểu dữ liệu
import { Form, Input, Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useLocationStore } from "@/states/location.store";

export function CreateLocationModal(props: ModalProps) {
    const [form] = Form.useForm();
    const createLocation = useLocationStore((state) => state.createLocation);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const [file, setFile] = useState<File | null>(null);

    const handleUpload = (file: File) => {
        setFile(file);
        const previewUrl = URL.createObjectURL(file);
        setImageUrl(previewUrl);

        return false; // Ngăn Upload tự động
    };

    const onFinish = async (values: { name: string; description: string; address: string }) => {
        if (!file) {
            messageApi.error("Vui lòng chọn hình ảnh!");
            return;
        }

        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("address", values.address);
        formData.append("description", values.description);
        formData.append("image", file);

        try {
            await createLocation(formData);
            messageApi.success("Tạo địa điểm thành công!");

            // ✅ Reset form fields
            form.resetFields();
            setFile(null);
            setImageUrl(null);

            // ✅ Đóng modal (gọi `props.onCancel` nếu có)
            if (props.onCancel) {
                props.onCancel(null as any);
            }
        } catch (error) {
            messageApi.error("Tạo địa điểm thất bại!");
        }
    };


    return (
        <>
            {contextHolder}
            <Modal
                {...props} // Nếu lỗi, thử sửa thành {...(props as ModalProps)}
                onOk={() => form.submit()}
                title="Tạo Địa Điểm Mới"
                okText="Tạo"
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
                    <Form.Item label="Hình ảnh">
                        <Upload
                            beforeUpload={handleUpload}
                            showUploadList={false}
                            accept="image/*"
                        >
                            <Button icon={<UploadOutlined />} loading={uploading}>Chọn ảnh</Button>
                        </Upload>
                        {imageUrl && (
                            <img src={imageUrl} alt="preview" style={{ width: "100%", marginTop: 10 }} />
                        )}
                    </Form.Item>

                </Form>
            </Modal>

        </>
    );
}
