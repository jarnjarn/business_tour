import { PageProps } from "@/@types/common.type";
import { UserLayout } from "@/components/layouts/user.layout";
import { Content } from "./content";

export default function Page({ params }: PageProps<{ id: string }>) {
    if (!params?.id) return <p>Đang tải...</p>;

    return (
        <UserLayout>
            <Content id={params.id} />
        </UserLayout>
    );
}
