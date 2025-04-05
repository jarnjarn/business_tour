'use client'
import { Button, Form, Input, message } from "antd";
import { useAuthStore } from "@/states/auth.state"; // Import useAuthStore
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { CookieUtil } from "@/common/utils/cookie.util";
import Link from "next/link";
import { UserRegisterDto } from "@/dto/user.dto"; // Import UserRegisterDto

export default function RegisterPage() {
    const [form] = Form.useForm<any & { repassword: string }>();
    const { register } = useAuthStore(); // Lấy hàm register từ store
    const navigate = useRouter();
    const [messageApi, contextHolder] = message.useMessage(); // Dùng message API
    useEffect(() => {
        const token = CookieUtil.getCookie("token");
        if (token) {
            navigate.push("/");
        }
    }, []);

    const onFinish = (values: any & { repassword: string }) => {
        if (values.password !== values.repassword) {
            form.setFields([
                { name: 'repassword', errors: ['Mật khẩu không khớp'] },
                { name: 'password', errors: ['Mật khẩu không khớp'] }
            ]);
            return;
        }

        // Gọi API đăng ký
        const userData: UserRegisterDto = {
            username: values.username,
            email: values.email,
            phone: values.phone,
            password: values.password,
        };

        try {
            register(userData);
            messageApi.success("Đăng ký thành công!");
        } catch (error) {
            messageApi.error("Đăng ký thất bại");
        }


    };

    return (
        <div className='w-full min-w-60 bg-zinc-800 p-4 rounded-md shadow-md m-2 max-w-full'>
            <Form
                form={form}
                name="register"
                onFinish={onFinish}
                layout="vertical"
            >
                <Form.Item
                    label="Tên tài khoản"
                    name="username"
                    rules={[
                        { required: true, message: 'Vui lòng nhập tên tài khoản' },
                        { type: "string", min: 6, max: 20, message: 'Tên tài khoản phải từ 6 đến 20 ký tự' }
                    ]}
                >
                    <Input placeholder="Nhập tên tài khoản" />
                </Form.Item>

                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        { required: true, message: 'Vui lòng nhập tên hiển thị' },
                        { type: "string", min: 6, max: 50, message: 'Tên hiển thị phải từ 6 đến 50 ký tự' }
                    ]}
                >
                    <Input placeholder="Nhập tên hiển thị" />
                </Form.Item>

                <Form.Item
                    label="Số điện thoại"
                    name="phone"
                    rules={[
                        { required: true, message: 'Vui lòng nhập số điện thoại' },
                        { type: "string", min: 9, max: 12, message: 'Số điện thoại không hợp lệ' }
                    ]}
                >
                    <Input placeholder="Nhập số điện thoại" />
                </Form.Item>

                <Form.Item
                    label="Mật khẩu"
                    name="password"
                    rules={[
                        { required: true, message: 'Vui lòng nhập mật khẩu!' },
                        { type: "string", min: 6, max: 20, message: 'Mật khẩu phải từ 6 đến 20 ký tự' }
                    ]}
                >
                    <Input.Password placeholder="Nhập mật khẩu" />
                </Form.Item>

                <Form.Item
                    label="Nhập lại mật khẩu"
                    name="repassword"
                    rules={[{ required: true, message: 'Vui lòng nhập lại mật khẩu!' }]}
                >
                    <Input.Password placeholder="Nhập lại mật khẩu" />
                </Form.Item>

                <div className="mb-3">
                    <span>Bạn đã có tài khoản? Đăng nhập <Link href={`/login`}>tại đây!</Link></span>
                </div>

                <Form.Item>
                    <Button type="primary" htmlType="submit" block>
                        Đăng Ký
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}
