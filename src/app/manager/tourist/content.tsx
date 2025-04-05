'use client'
import { useEffect, useState } from "react";
import { useTouristStore } from "@/states/tourist.state";
import { Button, Popconfirm, Space, Table, Input, Select, Tag, Tooltip, message } from "antd";
import { Tourist } from "@/states/tourist.state";
import dayjs from "dayjs";
import { CiEdit } from "react-icons/ci";
import { MdDeleteForever } from "react-icons/md";
import { AiOutlineSchedule } from "react-icons/ai";
import { UpdateTouristModal } from "@/components/modal/tourist/update.tourist";
import ListSchedule from "@/components/modal/schedule/list.schedule";
import { RequireRole } from "@/components/requireRole/RequireRole";
import { UserRole } from "@/@types/users/user.enum";
import { useNotiStore } from "@/states/noti.state";
export function Content() {
    const { tourists, setSelect, deleteTourist, fetchTourists, updateTourist, isLoading } = useTouristStore();
    const [query, setQuery] = useState({ page: 1, limit: 10, search: "" });
    const [messageApi, contextHolder] = message.useMessage(); // Dùng message API
    const { createNotiByStaff } = useNotiStore()
    const { getById, tourist } = useTouristStore()
    const [config, setConfig] = useState<Record<string, boolean>>({
        list: false,
        create: false,
        update: false
    });
    useEffect(() => {
        fetchTourists(query);
    }, [query]);

    const handleDelete = async (id: string) => {

        try {
            await deleteTourist(id);
            messageApi.success("Xoá thành công!");
        } catch (error) {
            messageApi.error("Xoá thất bại");
        }
    };

    const handleStatusChange = async (id: string, status: string) => {
        try {
            // Lấy thông tin chi tiết của tourist trước
            await getById(id);
            const updatedTourist = useTouristStore.getState().tourist; // Lấy dữ liệu mới nhất

            // Cập nhật trạng thái
            await updateTourist(id, { status });
            messageApi.success("Cập nhật thành công!");

            // Tạo thông báo nếu tourist tồn tại
            if (updatedTourist) {
                await createNotiByStaff({
                    receiverId: updatedTourist.user._id,
                    title: "Cập nhật trạng thái lịch trình",
                    content: `Quản trị viên đã cập nhật trạng thái đăng ký thăm quan của bạn tại ${updatedTourist.location.name} thành "${status === 'approved' ? 'Đã duyệt' : status === 'rejected' ? 'Từ chối' : 'Đang chờ'}"`,
                });
            }
        } catch (error) {
            messageApi.error("Cập nhật thất bại");
        }
    };


    const toggle = (key: string) => () => {
        setConfig((prev) => ({
            ...prev,
            [key]: !prev[key]
        }));
    };


    return (
        <>
            {contextHolder}
            <RequireRole roles={[UserRole.ADMIN, UserRole.STAFF]}>
                <div className="max-w-[100vw]">
                    <br />
                    <h1 className="text-lg text-center font-semibold text-lime-700 md:text-2xl">
                        DANH SÁCH LỊCH TRÌNH
                    </h1>
                    <br />
                    {/* Thanh tìm kiếm */}
                    <ListSchedule open={config.list} onCancel={toggle("list")} />
                    <UpdateTouristModal open={config.update} onCancel={toggle("update")} />

                    <div className="flex justify-between mb-4 flex-col md:flex-row gap-4">
                        <Input.Search
                            placeholder="Tìm kiếm theo địa điểm"
                            enterButton
                            onSearch={(value) => setQuery({ ...query, page: 1, search: value })}
                        />
                    </div>
                    {/* Bảng dữ liệu */}
                    <Table
                        size="small"
                        rowKey="_id"
                        scroll={{ x: 720 }}
                        loading={isLoading}
                        dataSource={tourists?.data}
                        pagination={{
                            current: query.page,
                            pageSize: query.limit,
                            total: tourists?.total,
                            onChange: (page, pageSize) => setQuery({ ...query, page, limit: pageSize }),
                        }}
                        onRow={(record) => {
                            return {
                                onClick: () => {
                                    setSelect(record);
                                }
                            }
                        }}
                    >
                        <Table.Column width={50} align="center" title="STT" render={(_, __, index) => index + 1} />
                        <Table.Column
                            width={150}
                            title="Tên địa điểm"
                            dataIndex="location"
                            key="location"
                            render={(location) => location?.name || "N/A"} // Hiển thị tên hoặc "N/A" nếu không có
                        />
                        <Table.Column
                            width={200}
                            title="Người đăng ký"
                            dataIndex="user"
                            key="user"
                            render={(user) => user?.email || "N/A"} // Hiển thị email hoặc "N/A" nếu không có
                        />

                        <Table.Column width={100} title="Số người" dataIndex="totalPeople" key="totalPeople" />
                        <Table.Column
                            width={150}
                            title="Ngày bắt đầu"
                            dataIndex="form"
                            key="form"
                            render={(date) => dayjs(date).format("DD/MM/YYYY")}
                        />
                        <Table.Column
                            width={150}
                            title="Ngày kết thúc"
                            dataIndex="to"
                            key="to"
                            render={(date) => dayjs(date).format("DD/MM/YYYY")}
                        />
                        <Table.Column
                            width={150}
                            title="Trạng thái"
                            dataIndex="status"
                            key="status"
                            render={(status, record: Tourist) => (
                                <Select
                                    defaultValue={status}
                                    style={{ width: 120 }}
                                    onChange={(value) => handleStatusChange(record._id, value)}>
                                    <Select.Option value="pending">Đang chờ</Select.Option>
                                    <Select.Option value="approved">Đã duyệt</Select.Option>
                                    <Select.Option value="rejected">Từ chối</Select.Option>
                                </Select>
                            )}
                        />
                        <Table.Column width={200} align="center" title="Chức năng" render={(_, record: Tourist) => (
                            <Space>
                                <Tooltip title="Xem lịch trình">
                                    <Button
                                        onClick={() => {
                                            toggle("list")();
                                        }}
                                        type={"primary"}
                                    ><AiOutlineSchedule /></Button>
                                </Tooltip>
                                <Tooltip title="Chỉnh sửa">
                                    <Button onClick={() => {
                                        toggle("update")();
                                    }} type={"primary"} ><CiEdit /></Button>
                                </Tooltip>
                                <Tooltip title="xoá">
                                    <Popconfirm title="Bạn có chắc chắn xóa?" onConfirm={() => handleDelete(record._id)}>
                                        <Button danger ><MdDeleteForever /></Button>
                                    </Popconfirm>
                                </Tooltip>
                            </Space>
                        )} />
                    </Table>
                </div>
            </RequireRole>
        </>

    );
}
