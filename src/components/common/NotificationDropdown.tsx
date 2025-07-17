'use client';
import { useAuthStore } from '@/states/auth.state';
import { useNotiStore } from '@/states/noti.state';
import { useEffect, useState } from 'react';
import { FiBell } from 'react-icons/fi';

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(10); // Hiển thị ban đầu 10 thông báo
  const limit = 1000; // Lấy tối đa 1000 thông báo
  const { auth } = useAuthStore()

  const { list, getNoti, updateStatusNoti, updateStatusAllNoti } = useNotiStore();

  // Lấy thông báo khi component được mount
  useEffect(() => {
    if (auth) {
      getNoti({ page: 1, limit });
    }
  }, []);

// Đếm số thông báo chưa đọc
const unreadCount = list.filter((notif) => notif.status === false).length;

return (
  <div className="relative">
    {/* Nút bấm hiển thị thông báo */}
    <button
      className="text-2xl text-gray-700 hover:text-blue-500 relative"
      onClick={() => setIsOpen(!isOpen)}
    >
      <FiBell className="text-3xl" />
      {/* Dấu chấm thông báo chưa đọc */}
      {unreadCount > 0 && (
        <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
          {unreadCount}
        </span>
      )}
    </button>

    {/* Dropdown thông báo */}
    {isOpen && (
      <div
        className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg border p-2 z-10 overflow-hidden"
        style={{ maxHeight: '100vh', overflowY: 'auto' }} // Giới hạn chiều cao 100vh và có scroll
      >
        {/* Nút đọc tất cả */}
        <div className="flex justify-between items-center px-2 py-1 border-b">
          <span className="font-semibold">Thông báo</span>
          <button
            className="text-blue-500 text-sm hover:underline"
            onClick={() => updateStatusAllNoti()}
          >
            Đọc tất cả
          </button>
        </div>

        {/* Danh sách thông báo */}
        {list.length > 0 ? (
          list.slice(0, visibleCount).map((notif, index) => (
            <div
              key={index}
              className="flex items-center justify-between px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
            >
              <div className="max-w-[280px] break-words">
                <p className="font-semibold">{notif.title}</p>
                <p className="text-sm text-gray-500 whitespace-normal break-words">{notif.content}</p>
              </div>
              {!notif.status && (
                <span className="w-[0.7rem] h-2 bg-red-500 rounded-full"></span>
              )}
            </div>
          ))
        ) : (
          <p className="px-4 py-2 text-gray-500 text-sm">Không có thông báo</p>
        )}

        {/* Nút xem thêm */}
        {list.length > visibleCount && (
          <button
            className="w-full text-center text-blue-500 text-sm py-2 hover:bg-gray-100"
            onClick={() => setVisibleCount(visibleCount + 10)}
          >
            Xem thêm
          </button>
        )}
      </div>
    )}
  </div>
);
}
