import { UserLayout } from "@/components/layouts/user.layout";
import UserContentPage from "./content";


export default function Home() {
  return (
    <div>
      <UserLayout>
        <UserContentPage></UserContentPage>
      </UserLayout>
    </div>
  );
}
