import { Room, useRoomStore } from "@/states/room.state";
import { Button, Modal } from "antd";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function ShowQr({ open, onCancel }: { open: boolean, onCancel: () => void }) {
    const { select } = useRoomStore()
    const router = useRouter()

    const handleCheckIn = () => {
        router.push(`/checkin/${select?._id}`)
    }
    return (
        <Modal open={open} onCancel={onCancel} title="QR Code" footer={null}
            okText="Tạo"
            cancelText="Đóng" >
            <div className="flex justify-center items-center">
                <Image src={select?.QrCode || ""} alt="QR Code" width={500} height={500} className="rounded-md border-2 border-gray-300" />
            </div>
            <br />
            <Button type="primary" onClick={handleCheckIn}>From Check In</Button>
        </Modal>
    )
}


