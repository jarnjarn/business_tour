'use client'
import {Button, Form, Input} from "antd";
// import {UserRegisterDto} from "@/dto/users/userRegisterDto";
// import {useAuthStore} from "@/states/auth.state";
import {usePathname, useRouter} from "next/navigation";
import {useEffect} from "react";
import {CookieUtil} from "@/common/utils/cookie.util";
import Link from "next/link";

export default function RegisterPage() {
    const [form] = Form.useForm<any & {
        repassword: string;
    }>();
    // const {register ,isLoading} = useAuthStore();
    const currentPath = usePathname();
    const navigate = useRouter();
    useEffect(() => {
        const token = CookieUtil.getCookie("token");
        // if (token && currentPath =="/register") {
        //     navigate.push("/");
        // }
    }, []);

    const onFinish = (values: any & {
        repassword: string;
        }) => {
        if (values.password !== values.repassword) {
            form.setFields([
                {
                    name: 'repassword',
                    errors: ['Mật khẩu không khớp']
                },
                {
                    name: 'password',
                    errors: ['Mật khẩu không khớp']
                }
            ])
            return;
        }
        // register(values)
    };

    return (
        <div className='w-full min-w-60 bg-zinc-800 p-4 rounded-md shadow-md m-2 max-w-full'>
            <Form<any & {
            repassword: string;
            }>
                form={form}
                name="register"
                onFinish={onFinish}
                layout="vertical"

            >
                <Form.Item
                    label="Tên tài khoản "
                    name="username"
                    rules={[
                        { required: true, message: 'Vui lòng nhập tên tài khoản' },
                        { type:"string", min:6,max:20 , message: 'Tên tài khoản phải từ 6 đến 20 ký tự'}
                    ]}
                >
                    <Input placeholder="Nhập tên tài khoản" />
                </Form.Item>
                
                <Form.Item
                    label="Tên hiển thị"
                    name="fullname"
                    rules={[
                        { required: true, message: 'Vui lòng nhập tên hiển thị' },
                        { type:"string", min:6,max:20 , message: 'Tên hiển thị phải từ 6 đến 20 ký tự'}
                    ]}
                >
                    <Input placeholder="Nhập tên hiển thị" />
                </Form.Item>
                <Form.Item
                    label="Số điện thoại "
                    name="phone"
                    rules={[
                        { required: true, message: 'Vui lòng nhập Số điện thoại' },
                        { type:"string", min:9,max:12 , message: 'Số điện thoại phải đúng số việt nam'}
                    ]}
                >
                    <Input placeholder="Nhập số điện thoại" />
                </Form.Item>
                <Form.Item
                    label="Mật khẩu"
                    name="password"
                    rules={[
                        { required: true, message: 'Vui lòng nhập mật khẩu!' },
                        { type:"string", min:6,max:20 , message: 'Mật khẩu phải từ 6 đến 20 ký tự'}
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