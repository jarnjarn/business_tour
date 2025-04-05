import { Form, Input, Modal, ModalProps, DatePicker, message } from "antd";
import { useEffect } from "react";
import dayjs from "dayjs";
import { useAuthStore } from "@/states/auth.state";
import { useTouristStore } from "@/states/tourist.state";
import { useLocationStore } from "@/states/location.store";
import { useNotiStore } from "@/states/noti.state";
interface CreateTouristModalProps extends ModalProps {
    locationId: string; // ID của địa điểm
}

export function CreateTouristModal({ locationId, ...prop }: CreateTouristModalProps) {
    const [form] = Form.useForm();
    const { auth,fetchMe } = useAuthStore();
    const { createTourist } = useTouristStore();
    const { location, getById } = useLocationStore()
    const {createNoti} = useNotiStore()
    const [messageApi, contextHolder] = message.useMessage();
    const onFinish = async (values: any) => {
        if (!auth) {
            messageApi.error("Bạn cần đăng nhập để đăng ký!");
            return;
        }


        const payload = {
            locationId: location?._id,
            form: values.form.toISOString(),
            to: values.to.toISOString(),
            totalPeople: Number(values.totalPeople)
        };

        const data = {
            title:`Đăng ký thăm quan`,
            content:`Người dùng ${auth.username} đã đăng ký thăm quan ${location?.name}`
        }

        try {
            await createTourist(payload);
            messageApi.success("Đăng ký thành công!");
            await createNoti(data)
            form.resetFields();
            if (prop.onCancel) prop.onCancel(undefined as any);
        } catch (error) {
            messageApi.error("Đăng ký thất bại! Vui lòng thử lại.");
            console.error(error);
        }
    };

    useEffect(() => {
        if (prop.open) {
            getById(locationId)
            form.resetFields();
        }
    }, [prop.open]);

    return (
        <>{contextHolder}
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
                    <Form.Item label="Người đăng ký" name="name" initialValue={auth?.username}>
                        <Input disabled />
                    </Form.Item>
                    <Form.Item label="Email" name="email" initialValue={auth?.email}>
                        <Input disabled />
                    </Form.Item>
                    <Form.Item label="Địa điểm" name="locationName" initialValue={location?.name}>
                        <Input disabled />
                    </Form.Item>
                    <Form.Item label="Số lượng người thăm quan" name="totalPeople" >
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item
                        label="Ngày & Giờ đến"
                        name="form"
                        rules={[{ required: true, message: "Ngày & giờ đến là bắt buộc!" }]}
                        initialValue={dayjs()}
                    >
                        <DatePicker showTime format="YYYY-MM-DD HH:mm" />
                    </Form.Item>
                    <Form.Item
                        label="Ngày & Giờ rời đi"
                        name="to"
                        rules={[{ required: true, message: "Ngày & giờ rời đi là bắt buộc!" }]}
                        initialValue={dayjs().add(1, "day")}
                    >
                        <DatePicker showTime format="YYYY-MM-DD HH:mm" />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}
