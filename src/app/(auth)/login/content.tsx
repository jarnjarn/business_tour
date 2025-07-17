'use client'
import { Button, Checkbox, Form, Input, message } from "antd";
// import {useAuthStore} from "@/states/auth.state";
// import {UserLoginDto} from "@/dto/users/userRegisterDto";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/states/auth.state";
import { CookieUtil } from "@/common/utils/cookie.util";
import { UserLoginDto } from "@/dto/user.dto";

export default function LoginPage() {
    const [form] = Form.useForm<any>();
    const currentPath = usePathname();
    const { login, isLoading } = useAuthStore();
    const [messageApi, contextHolder] = message.useMessage(); // Dùng message API
    const navigate = useRouter();
    useEffect(() => {
        const token = CookieUtil.getCookie("token");
        if (token && currentPath == "/login") {
            navigate.push("/");
        }
    }, []);

    const onFinish = async (values: UserLoginDto) => {
        try {
            await login(values);
            messageApi.success("Đăng nhập thành công!");
        } catch (error: any) {
            messageApi.error("Sai tài khoản hoặc mật khẩu");
        }
    };

    return (
        <>
            {contextHolder}
            <div className='bg-zinc-800 p-4 rounded-md shadow-md m-2'>
                <Form<any>
                    name="login"
                    form={form}
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    layout="vertical"
                >
                    <Form.Item
                        label="Tên tài khoản"
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập tên tài khoản'
                            },
                            {
                                type: "string",
                                min: 2,
                                max: 50,
                                message: 'Tên tài khoản phải từ 6 đến 20 ký tự'
                            }
                        ]}
                    >
                        <Input placeholder="Nhập tên tài khoản" />
                    </Form.Item>

                    <Form.Item
                        label="Mật khẩu"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập mật khẩu!',
                            },
                            {
                                type: "string",
                                min: 2,
                                max: 50,
                                message: 'Mật khẩu phải từ 6 đến 20 ký tự'
                            }
                        ]}
                    >
                        <Input.Password placeholder="Nhập mật khẩu" />
                    </Form.Item>
                    <Form.Item name="remember" valuePropName="checked" className="mb-4">
                        <Checkbox>Duy trì đăng nhập</Checkbox>
                    </Form.Item>
                    <div className="mb-3">
                        <span>Bạn chưa có tài khoản? Đăng ký <Link href={`/register`}>tại đây!</Link></span>
                    </div>
                    <Form.Item>
                        {isLoading ? <Button type="primary" htmlType="submit" block>
                            Đang đăng nhập...
                        </Button> : <Button type="primary" htmlType="submit" block>
                            Đăng nhập
                        </Button>}
                    </Form.Item>
                </Form>
            </div>
        </>
    );
}