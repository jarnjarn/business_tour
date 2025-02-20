
import { UserLayout } from "@/components/layouts/user.layout";
import RegisterPage from "./content";
export default function Register() {
    return (
        <UserLayout>
            <br />
            <div className="md:max-w-[800px] md:mx-auto ">
                <div className="flex flex-col lg:flex-row">
                    <div className="flex-grow transition-all duration-300 m-auto item-center">
                        <div className="min-w-80">
                            <h1 className="text-center text-2xl">ĐĂNG KÝ</h1>
                            <RegisterPage />
                        </div>
                    </div>

                </div>
            </div>
        </UserLayout>
    );
}