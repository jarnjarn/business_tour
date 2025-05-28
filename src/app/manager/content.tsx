'use client'
import { UserHelper } from "@/common/helpers/user.helper";
import { Button, Input, message, Popconfirm, Space, Table, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { UserRole, UserStatus } from "@/@types/users/user.enum";
import { RequireRole } from "@/components/requireRole/RequireRole";
import { useUserStore } from "@/states/user.state";
import { User } from "@/@types/users/user.type";
import { RiDeleteBin6Line } from "react-icons/ri";
import { CiEdit } from "react-icons/ci";
import { FaExpeditedssl } from "react-icons/fa6";
import { UpdateUserModal } from "@/components/modal/user/updateUser.modal";
import { ChangePasswordModal } from "@/components/modal/user/changePassword";
// Dữ liệu mẫu

export function ManagerContentPage() {
    const [query, setQuery] = useState({ page: 1, limit: 10, search: "" });
    const { users, setSelect, fetchUsers, deleteUser } = useUserStore()
    const [messageApi, contextHolder] = message.useMessage(); // Dùng message API
    const [config, setConfig] = useState<Record<string, boolean>>({
        update: false,
        change: false
    });
    useEffect(() => {
        fetchUsers(query)
    }, [query]);

    const handleDelete = async (id: string) => {
        try {
            await deleteUser(id);
            messageApi.success("Xoá thành công!");
        } catch (error) {
            messageApi.error("Xoá thất bại");
        }
    };

    const toggle = (key: string) => {
        return () => {
            setConfig({
                ...config,
                [key]: !config[key]
            });
        };
    };

    return (
        <>
            {contextHolder}
            <RequireRole roles={[UserRole.ADMIN, UserRole.STAFF]}>
                <div className={"max-w-[100vw]"}>
                    <br />
                    <div>
                        <h1 className=" text-lg text-center font-semibold text-lime-700 md:text-2xl">DANH SÁCH NGƯỜI DÙNG</h1>
                    </div>
                    <br />
                    {config.update && (
                        <UpdateUserModal open={true} onCancel={toggle("update")} />
                    )}

                    {config.change && (
                        <ChangePasswordModal open={true} onCancel={toggle("change")} />
                    )}

                    {/* <UpdateUserModal open={config.update} onCancel={toggle("update")} /> */}
                    <div className="flex justify-between mb-4 flex-col md:flex-row gap-4">
                        <div className="lg:max-w-[350px] md:min-w-[350px] min-w-[100%] flex gap-2">
                            <Input.Search
                                placeholder="Tìm kiếm theo tên hoặc email"
                                enterButton
                                onSearch={(value) => setQuery({ ...query, page: 1, search: value })}
                            />
                        </div>
                    </div>
                    <Table size={"small"} rowKey="id" scroll={{ x: 720 }}
                        onRow={(record) => ({
                            onClick: () => {
                                setSelect(record)
                            }
                        })}
                        dataSource={users?.data}
                        pagination={{
                            current: query.page,
                            pageSize: query.limit,
                            total: users?.total,
                            onChange: (page, pageSize) => setQuery({ ...query, page, limit: pageSize }),
                        }}
                    >
                        <Table.Column width={50} align={"center"} title="STT" render={(_, key, index) => index + 1} />
                        <Table.Column width={150} title="Tài khoản" dataIndex="username" key="username" />
                        <Table.Column width={150} title="Tên đầy đủ" dataIndex="email" key="email" />
                        <Table.Column width={150} title="Tên đầy đủ" dataIndex="phone" key="phone" />
                        <Table.Column width={150} align={"center"} title="Quyền" dataIndex="role" key="role" render={UserHelper.toRole} />

                        <Table.Column width={200} align="center" title="Chức năng" render={(_, record: User) => (
                            <Space>
                                <Tooltip title="Đổi mật khẩu" key="change">
                                    <Button
                                        onClick={() => toggle("change")()}
                                        type="primary"
                                        icon={<FaExpeditedssl />}
                                    />
                                </Tooltip>
                                <Tooltip title="Chỉnh sửa" key="edit">
                                    <Button onClick={() => toggle("update")()} type="primary" icon={<CiEdit />} />
                                </Tooltip>
                                <Tooltip title="Xoá" key="delete">
                                    <Popconfirm title="Bạn có chắc chắn xóa?" onConfirm={() => handleDelete(record._id)}>
                                        <Button danger icon={<RiDeleteBin6Line />} />
                                    </Popconfirm>
                                </Tooltip>
                            </Space>

                        )} />
                    </Table>
                </div>
            </RequireRole>
        </>

    )
}
