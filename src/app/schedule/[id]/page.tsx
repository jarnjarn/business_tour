import { PageProps } from "@/@types/common.type";
import { UserLayout } from "@/components/layouts/user.layout";
import { Content } from "./content";

export default function ()
{
    return( 
        <div>
            <UserLayout>
                <Content />
            </UserLayout>
        </div>
    )
}