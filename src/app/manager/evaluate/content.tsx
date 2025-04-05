'use client'
import { UserRole } from "@/@types/users/user.enum";
import { RequireRole } from "@/components/requireRole/RequireRole";
import { useEvaluateStore } from "@/states/evaluate.state";
import { Button, Input, Popconfirm, Space, Table } from "antd";
import { useEffect, useState } from "react";

export  function ManagerEvaluateContent() {
    const { evaluates, fetchEvaluates, deleteEvaluate, isLoading } = useEvaluateStore()

    const [query, setQuery] = useState<Record<string, any>>({
        page: 1,
        limit: 10,
        query: "",
    });

    useEffect(() => {
        fetchEvaluates({page:query.page, limit:query.limit, query:query.query});
    }, [query]);

    return (
        <RequireRole roles={[UserRole.ADMIN, UserRole.STAFF]}>
            <div className="max-w-[100vw]">
                <br />
                <h1 className="text-lg text-center font-semibold text-lime-700 md:text-2xl">
                    DANH SÁCH ĐỊA ĐIỂM
                </h1>
                <br />
                <div className="flex justify-between mb-4 flex-col md:flex-row gap-4">
                    <div className="lg:max-w-[350px] md:min-w-[350px] min-w-[100%] flex gap-2">
                        <Input.Search
                            size="middle"
                            placeholder="Tìm kiếm theo tên"
                            enterButton
                            onSearch={(value) => {
                                setQuery((prev) => ({ ...prev, page: 1, query: value })); // Reset về trang 1 khi tìm kiếm
                            }}
                        />
                    </div>
                </div>
                <Table
                    size="small"
                    dataSource={evaluates?.data}
                    rowKey="_id"
                    scroll={{ x: 720 }}
                    loading={isLoading}
                    pagination={{
                        size: "default",
                        total: evaluates?.total, // Tổng số địa điểm
                        pageSize: query.limit,
                        current: query.page,
                        showSizeChanger: true,
                        onChange: (page, pageSize) => {
                            setQuery({ ...query, page, limit: pageSize });
                        },
                        onShowSizeChange: (current, size) => {
                            setQuery({ ...query, page: current, limit: size });
                        },
                    }}>
                    <Table.Column width={50} align="center" title="STT" render={(_, __, index) => index + 1} />
                    <Table.Column width={150} title="Tên người đánh giá" dataIndex="user" key="name" render={(user) => user?.username || "N/A"} />
                    <Table.Column width={150} title="Đánh giá" dataIndex="content" key="name" />
                    <Table.Column width={150} title="Số điểm" dataIndex="star" key="name" />
                    <Table.Column
                        width={150}
                        align="center"
                        title="Chức năng"
                        render={(_, entity) => (
                            <Space>
                                <Popconfirm
                                    title="Bạn có chắc chắn xóa địa điểm này?"
                                    okText="Có"
                                    cancelText="Không"
                                    onConfirm={() => {
                                        deleteEvaluate(entity._id)
                                    }}
                                >
                                    <Button type="primary" danger>Xóa</Button>
                                </Popconfirm>
                            </Space>
                        )}
                    />
                </Table>
            </div>
        </RequireRole>

    );
}