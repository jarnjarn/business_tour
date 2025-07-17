"use client";
import { UserRegisterTourist } from "@/@types/userRegisytourt";
import { useTouristStore } from "@/states/tourist.state";
import { Button, Form, Input } from "antd";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function CheckinContent() {
    const { id } = useParams();
    const searchParams = useSearchParams();
    const type = searchParams.get("type") as UserRegisterTourist || UserRegisterTourist.REGISTER;

    const { getById, tourist, updateUserRegister } = useTouristStore();

    const [form] = Form.useForm();

    useEffect(() => {
        getById(id as string);
    }, [id]);

    const handleSubmit = async (values: any) => {
        if (!id) return;

        const user = {
            name: values.name,
            phone: values.phone,
            group: values.group,
            type: type === UserRegisterTourist.UNREGISTER ? UserRegisterTourist.UNREGISTER : UserRegisterTourist.REGISTER
        };

        await updateUserRegister(id as string, user);
        await getById(id as string); 
        form.resetFields();
    };

    return (
        <div className="p-3 md:p-6 bg-gray-100 rounded-lg shadow-md mt-6">
            <h1 className="text-center text-2xl font-bold text-lime-700">
                {type === "REGISTER" ? "Đăng ký tham dự" : "Xác nhận rời đi"} chuyến tham quan {tourist?.location?.name}
            </h1>
            <Form layout="vertical" form={form} onFinish={handleSubmit}>
                <Form.Item name="name" className="mt-3" label="Họ và tên">
                    <Input />
                </Form.Item>
                <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="group" className="mt-3" label="Nhóm" rules={[{ required: true, message: "Vui lòng nhập nhóm" }]}>
                    <Input />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        {type === "REGISTER" ? "Check in" : "Check out"}
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}
