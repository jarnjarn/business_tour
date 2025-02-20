'use client'

import { UserRole, UserStatus } from "@/@types/users/user.enum";
import { Tourist } from "@/entities/tourist.entity";
import { User } from "@/entities/user.entity";
import { Button, Popconfirm, Space, Table } from "antd/lib";
import { useState } from "react";

const mockUsers: Tourist[] = [
    Tourist.fromJSON({
        id: 1,
        name: 'Khu Thực Hành cơ khí LHU',
        img: '01.png',
        discription: 'hảo hảo chua cay'
    }),
];

export function ManagerTourContentPage() {
    const [config, setConfig] = useState<Record<string, boolean>>({
        updateRole: false,
    });

    const [data, setData] = useState<Tourist[]>(mockUsers); // Gán data mặc định từ mockUsers

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
                <h1 className=" text-lg text-center font-semibold text-lime-700 md:text-2xl">DANH SÁCH ĐỊA ĐIỂM</h1>
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
                <Table.Column width={150} title="Tên địa điểm" dataIndex="name" key="name" />
                <Table.Column
                    width={150}
                    title="Hình ảnh"
                    dataIndex="img"
                    key="img"
                    render={(img) => <img src={img} alt="Hình ảnh" className="w-16 h-16 object-cover rounded-md" />}
                />

                <Table.Column width={150} title="Mô tả" dataIndex="discription" key="discription" />
                <Table.Column width={150} align={"center"} title="Chức năng" render={(_, entity: User) => (
                    <Space>
                        <Button type={"primary"} onClick={toggle("updateRole")}>Cập thông tin</Button>
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