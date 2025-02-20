import React, { ReactNode } from "react";
import { Rank, TagUser, UserRole } from "@/@types/users/user.enum";
import { Avatar, Tag } from "antd";
import { User } from "@/entities/user.entity";
import { CheckCircleOutlined } from "@ant-design/icons";
import Image from "next/image";

export class UserHelper {
    private static roles: Array<{ label: ReactNode | string, value: number }> = [
        { label: <Tag color="red">Quản trị viên</Tag>, value: UserRole.ADMIN },
        { label: <Tag color="blue">Người dùng</Tag>, value: UserRole.USER },
        { label: <Tag color="green">Đại lý</Tag>, value: UserRole.STAFF },
    ];

    private static tags: Array<{ label: ReactNode | string, value: number }> = [
        { label: <Tag color="red">Quản trị viên</Tag>, value: TagUser.ADMIN },
        { label: <Tag color="gold">Nhà cung cấp vip</Tag>, value: TagUser.AGENCY_VIP },
        { label: <Tag color="green">Nhà cung cấp uy tín</Tag>, value: TagUser.AGENCY_SUPPERLIRER },
        { label: <Tag color="blue">Nhà cung cấp thường</Tag>, value: TagUser.AGENCY },
    ];

    private static ranks: Array<{ label: ReactNode | string, value: number }> = [
        { label: <Tag >Không có</Tag>, value: Rank.DEFAULT },
        { label: <Tag color="blue">Bạc</Tag>, value: Rank.SILVER },
        { label: <Tag color="gold">Vàng</Tag>, value: Rank.GOLD },
        { label: <Tag color="purple">Kim Cương</Tag>, value: Rank.DIAMOND },
    ];



    static toListRole(isAll: boolean = false) {
        const rolesList = [...this.roles];

        if (isAll) {
            rolesList.unshift({ label: "Tất cả", value: -1 });
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

    static toRank(rank: Rank) {
        switch (rank) {
            case Rank.DEFAULT:
                return <Tag >Không có</Tag>
            case Rank.SILVER:
                return <Tag color="blue">Bạc</Tag>
            case Rank.GOLD:
                return <Tag color="gold">Vàng</Tag>
            case Rank.DIAMOND:
                return <Tag color="purple">Kim cương</Tag>
            default:
                break;
        }
    }
    static toTag(tag: TagUser) {
        switch (tag) {
            case TagUser.ADMIN:
                return <Tag color="red">Quản trị viên</Tag>
            case TagUser.AGENCY_VIP:
                return <Tag color="gold">Đại lý vip</Tag>
            case TagUser.AGENCY_SUPPERLIRER:
                return <Tag color="green">Đại lý uy tin</Tag>
            case TagUser.AGENCY:
                return <Tag color="blue">Đại lý</Tag>
            default:
                break;
        }
    }

    static renderTags(tags: number[]) {
        return tags.map(tag => {
            return this.toTag(tag);
        });
    }

    static toListTag(isAll: boolean = false) {
        const tagsList = [...this.tags];
        return tagsList;
    }

    static toListRank(isAll: boolean = false) {
        const rankList = [...this.ranks];
        return rankList;
    }

    static getRoleLabel(value: number) {
        const role = this.roles.find(role => role.value === value);
        return role ? role.label : "Không xác định";
    }
    static renderLevel(level: number) {
        return UserHelper.toRank(level);
    }


    static getDisplayName(user: User, limitSizeLength: number = 200) {
        const txt = (user.fullname ? user.fullname : user.username).length > limitSizeLength ? (user.fullname ? user.fullname : user.username).substring(0, limitSizeLength) + "..." : (user.fullname ? user.fullname : user.username);
        if ([UserRole.ADMIN].includes(user.role)) {
            return (
                <span>
                    {txt} <CheckCircleOutlined style={{ color: '#1877F2' }} />
                </span>
            )
        }
        return (
            <span>
                {txt}
            </span>
        )

    }
    static getFirstCharacter(user: User) {
        return (user.fullname ? user.fullname[0] : user.username[0]).toUpperCase();
    }

    static renderImgRank(rank: Rank) {
        switch (rank) {
            case Rank.DEFAULT:
                return <span></span>
            case Rank.SILVER:
                return <img src="/rankbac.png" alt="Logo" className="h-7" />
            case Rank.GOLD:
                return <img src="/rankvang.png" alt="Logo" className="h-7" />
            case Rank.DIAMOND:
                return <img src="/kc.png" alt="Logo" className="h-7" />
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