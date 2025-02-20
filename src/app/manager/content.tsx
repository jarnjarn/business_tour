'use client'
import { UserHelper } from "@/common/helpers/user.helper";
import { NumberUtil } from "@/common/utils/number.util";
import { User } from "@/entities/user.entity";
import { Button, Popconfirm, Space, Table } from "antd";
import { useState } from "react";
import { UserRole, UserStatus } from "@/@types/users/user.enum";

// Dữ liệu mẫu
const mockUsers: User[] = [
    User.fromJSON({
        id: 1,
        deletedAt: null,
        username: "john_doe",
        fullname: "John Doe",
        role: UserRole.USER,
        status: UserStatus.ACTIVE,
        password: "hashedpassword123",
        phone: "0123456789"
    }),
];

export function ManagerContentPage() {
    const [config, setConfig] = useState<Record<string, boolean>>({
        updateRole: false,
    });

    const [data, setData] = useState<User[]>(mockUsers); // Gán data mặc định từ mockUsers

    const toggle = (key: string) => {
        return () => {
            setConfig({
                ...config,
                [key]: !config[key]
            });
        };
    };

    return (
        <div className={"max-w-[100vw]"}>
            <br />
            <div>
                <h1 className=" text-lg text-center font-semibold text-lime-700 md:text-2xl">DANH SÁCH NGƯỜI DÙNG</h1>
            </div>
            <br />
            <Table size={"small"} dataSource={data} rowKey="id" scroll={{ x: 720 }}
                onRow={(record) => ({
                    onClick: () => {
                        console.log("Selected user:", record);
                    }
                })}
            >
                <Table.Column width={50} align={"center"} title="STT" render={(_, __, index) => index + 1} />
                <Table.Column width={150} title="Tài khoản" dataIndex="username" key="username" />
                <Table.Column width={150} title="Tên đầy đủ" dataIndex="fullname" key="fullname" />
                <Table.Column width={150} align={"center"} title="Quyền" dataIndex="role" key="role" render={UserHelper.toRole} />
                <Table.Column width={150} align={"center"} title="Chức năng" render={(_, entity: User) => (
                    <Space>
                        <Button type={"primary"} onClick={toggle("updateRole")}>Cập nhật quyền</Button>
                        <Popconfirm title={"Bạn có chắc chắn xóa người dùng này ?"} okText={"Có"} cancelText={"Không"}
                            onConfirm={() => {
                                setData(prev => prev.filter(user => user.id !== entity.id)); // Xóa user
                            }}>
                            <Button type={"primary"} danger>Xóa</Button>
                        </Popconfirm>
                    </Space>
                )} />
            </Table>
        </div>
    )
}
