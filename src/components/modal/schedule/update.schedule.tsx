'use client'
import { DatePicker, Modal, Select } from "antd";
import type { ModalProps } from "antd"; // ✅ Đúng cách import kiểu dữ liệu
import { Form, Input, message } from "antd";
import { useEffect } from "react";
import dayjs from "dayjs";
import { useScheduleStore } from "@/states/schedule.state";
import { UserRole } from "@/@types/users/user.enum";
import { useUserStore } from "@/states/user.state";
import { useRoomStore } from "@/states/room.state";

export function UpdateScheduleModal(props: ModalProps) {
    const { select, updateSchedule } = useScheduleStore();
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const { users } = useUserStore();
    const { list } = useRoomStore();

    const onFinish = async (values: any) => {
        if (!select) {
            messageApi.error("Không có lựa chọn được chọn!");
            return;
        }
        try {
            await updateSchedule(select._id, values);
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
                time: select.time ? dayjs(select.time) : undefined,
                organizer: select.organizer?._id,
                room: select.room?._id,
            });

        } else {
            form.resetFields();
        }
        console.log(select)
    }, [props.open, select]);



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
                    labelCol={{ style: { width: 150 } }}
                >
                    <Form.Item
                        label="Tiêu Đề"
                        name="title"
                        rules={[{ required: true, message: "Vui lòng nhập Tiêu Đề" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Thời gian"
                        name="time"
                        rules={[{ required: true, message: "Ngày & giờ đến là bắt buộc!" }]}
                    >
                        <DatePicker
                            showTime
                            format="YYYY-MM-DD HH:mm"
                            value={form.getFieldValue("time") ? dayjs(form.getFieldValue("time")) : undefined}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Người hưỡng dẫn"
                        name="organizer"
                        rules={[{ required: true, message: "Vui lòng chọn Người hưỡng dẫn" }]}
                    >
                        <Select
                            options={users?.data?.filter((item: any) => item.role === UserRole.STAFF).map((item: any) => ({ label: item.username, value: item.username })) || []}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Nội dung"
                        name="content"
                        rules={[{ required: true, message: "Vui lòng nhập Nội dung" }]}
                    >
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item
                        label="Phòng"
                        name="room"
                    >
                        <Select
                            options={
                                list?.map((item: any) => ({
                                    label: item.name,
                                    value: item._id
                                })) || []
                            }
                            value={form.getFieldValue("room")}
                            onChange={(value) => {
                                form.setFieldsValue({ room: value });
                            }}
                        />
                    </Form.Item>
                </Form>
            </Modal>

        </>
    );
}
