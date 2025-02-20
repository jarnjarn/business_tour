
import { UserLayout } from "@/components/layouts/user.layout";
import LoginPage from "./content";
export default function Login() {
    return (
        <UserLayout>
            <br />
            <div className="md:max-w-[800px] md:mx-auto ">
                <div className="flex flex-col lg:flex-row">
                    <div className="flex-grow transition-all duration-300 m-auto item-center">
                        <div className="min-w-80">
                            <h1 className="text-center text-2xl">ĐĂNG NHẬP</h1>
                            <LoginPage />
                        </div>
                    </div>

                </div>
            </div>
        </UserLayout>
    );
}