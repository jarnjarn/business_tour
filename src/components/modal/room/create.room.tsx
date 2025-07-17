'use client'

import { useLocationStore } from "@/states/location.store";
import { useRoomStore } from "@/states/room.state";
import { message, Modal, Select } from "antd";
import type { ModalProps } from "antd"; // ✅ Đúng cách import kiểu dữ liệu
import { Form, Input, InputNumber } from "antd";
import { useEffect } from "react";
import { CreateRoomDto } from "@/clients/room.client";  

export function CreateRoomModal(props: ModalProps) {
    const [form] = Form.useForm();
    const { createRoom } = useRoomStore();
    const [messageApi, contextHolder] = message.useMessage();

    const {fetchLocations,locations} = useLocationStore()

    const onFinish = async (values: CreateRoomDto) => {

        try {
            await createRoom(values);
            messageApi.success("Tạo thành công!");
            form.resetFields();
            if (props.onCancel) props.onCancel(undefined as any);
        } catch (error:any) {
            messageApi.error(error.response.data.error);
        }

    };

    useEffect(() => {
        if (props.open) {
            form.resetFields();
            fetchLocations({page:1,limit:100,search:""});
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
                        label="Địa điểm"
                        name="location"
                    >
                        <Select
                            options={locations?.data?.map((location) => ({
                                label: location.name,
                                value: location._id
                            }))}
                        />
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
