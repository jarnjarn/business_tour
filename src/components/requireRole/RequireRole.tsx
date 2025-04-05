'use client'

import {UserRole} from "@/@types/users/user.enum";
import React from "react";
import {useAuthStore} from "@/states/auth.state";
import {Button, Result, Spin} from "antd";
import Link from "next/link";

export function RequireRole({ roles, children }:{roles:UserRole[],children:React.ReactNode}) {
    const { auth , isLoading } = useAuthStore();
    if (isLoading) {
        return <Spin spinning={true}>
            {children}
        </Spin>;
    }
    if (auth) {
        if (roles.includes(auth.role)) {
            return <>{children}</>;
        }
        else {
            return <Result
                status="403"
                title="403"
                subTitle="Xin lỗi, bạn không có quyền truy cập trang này."
                extra={<Button type="primary">
                    <Link href={"/"}>
                        Trở về trang chủ
                    </Link>
                </Button>}
            />;
        }
    }
    return null;
}