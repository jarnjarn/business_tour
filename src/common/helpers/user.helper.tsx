import React, { ReactNode } from "react";
import {  UserRole } from "@/@types/users/user.enum";
import { Avatar, Tag } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";

export class UserHelper {
    private static roles: Array<{ label: ReactNode | string, value: string }> = [
        { label: <Tag color="red">Quản trị viên</Tag>, value: UserRole.ADMIN },
        { label: <Tag color="blue">Người dùng</Tag>, value: UserRole.USER },
        { label: <Tag color="green">Nhân viên</Tag>, value: UserRole.STAFF },
    ];

    static toListRole(isAll: boolean = false) {
        const rolesList = [...this.roles];

        if (isAll) {
            rolesList.unshift({ label: "Tất cả", value: "-1" });
        }

        return rolesList;
    }

    static toRole(role: UserRole) {
        switch (role) {
            case UserRole.ADMIN:
                return <Tag color="red">Quản trị viên</Tag>
            case UserRole.USER:
                return <Tag color="blue">Người dùng</Tag>
            case UserRole.STAFF:
                return <Tag color="green">Nhân Viên</Tag>
            default:
                break;
        }
    }


    static renderNameRole(role: UserRole, name : string) {
        switch (role) {
            case UserRole.USER:
                return <span className="text-lg font-medium">{name}</span>
            case UserRole.ADMIN:
                return <span className="text-lg font-medium text-red-500">{name}</span>
            case UserRole.STAFF:
                return <span className="text-lg font-medium text-green-500">{name}</span>
            default:
                break;
        }
    }
}