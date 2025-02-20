import { PageProps } from "@/@types/common.type";
import { UserLayout } from "@/components/layouts/user.layout";
import { Content } from "./content";

export default function (props:PageProps<{id:number}>)
{
    return( 
        <div>
            <UserLayout>
                <Content id={props.params.id}></Content>
            </UserLayout>
        </div>
    )
}