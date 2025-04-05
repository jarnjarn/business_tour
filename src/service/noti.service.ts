import { User } from "@/models/user.model";
import { Notification } from "@/models/notification.model";
import { UserRole } from "@/@types/users/user.enum";

export async function createNotification(senderId: string, title: string, content: string) {
    // Lấy danh sách tất cả nhân viên có role Staff
    const staffUsers = await User.find({ role: UserRole.STAFF }).select("_id");

    console.log(senderId, title, content)

    if (staffUsers.length === 0) return null;

    const notification = new Notification({
        sender: senderId,
        receiver: staffUsers.map(user => user._id),
        title,
        content,
        status: false // Mặc định là chưa đọc
    });

    return await notification.save();
}

export async function createNotificationByStaff(senderId: string,receiverId:string, title: string, content: string) {

    const notification = new Notification({
        sender: senderId,
        receiver: receiverId,
        title,
        content,
        status: false // Mặc định là chưa đọc
    });

    return await notification.save();
}

export async function getNotifications(userId: string, page: number, limit: number) {
    const skip = (page - 1) * limit; // Tính offset để phân trang

    console.log(page,limit)

    const notifications = await Notification.find({ receiver: userId })
        .populate("sender", "username email phone")
        .populate("receiver", "username email phone")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    return {
        data: notifications,
        total: notifications.length
    }
}

export async function markNotificationAsRead(notificationId: string) {
    return await Notification.findByIdAndUpdate(notificationId, { status: true }, { new: true });
}

export async function markAllNotificationsAsRead(userId: string) {
    console.log(userId)
    return await Notification.updateMany({ receiver: userId, status: false }, { status: true });
}
