'use client'

import { useTouristStore } from "@/states/tourist.state"
import { useEffect } from "react"
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from 'recharts'

export default function StatisticsContentPage() {
    const { statistics, compareTouristStatsByLocation } = useTouristStore()

    useEffect(() => {
        compareTouristStatsByLocation()
    }, [])

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Thống kê lượt đăng ký</h1>

            {/* Bảng thống kê */}
            <div className="overflow-x-auto mb-8">
                <table className="min-w-full border border-gray-200">
                    <thead className="bg-gray-100 text-sm">
                        <tr>
                            <th className="border p-2">Địa điểm</th>
                            <th className="border p-2">Tổng lượt đăng ký</th>
                            <th className="border p-2">Tổng người</th>
                            <th className="border p-2">Đã duyệt</th>
                            <th className="border p-2">Đang chờ</th>
                            <th className="border p-2">Từ chối</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {statistics?.map((item, index) => (
                            <tr key={index}>
                                <td className="border p-2">{item.locationName}</td>
                                <td className="border p-2 text-center">{item.totalTourists}</td>
                                <td className="border p-2 text-center">{item.totalPeople}</td>
                                <td className="border p-2 text-center">{item.approvedCount}</td>
                                <td className="border p-2 text-center">{item.pendingCount}</td>
                                <td className="border p-2 text-center">{item.rejectedCount}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Biểu đồ */}
            <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={statistics || []}>
                        <XAxis dataKey="locationName" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="totalTourists" fill="#3b82f6" name="Tổng lượt đăng ký" />
                        <Bar dataKey="pendingCount" fill="#facc15" name="Đang chờ" />
                        <Bar dataKey="approvedCount" fill="#10b981" name="Đã duyệt" />
                        <Bar dataKey="rejectedCount" fill="#ef4444" name="Từ chối" />
                    </BarChart>

                </ResponsiveContainer>
            </div>
        </div>
    )
}
