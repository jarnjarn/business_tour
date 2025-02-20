'use client'
import "@/styles/globals.css";
import { usePathname, useRouter } from "next/navigation";
import { HeaderComponent } from "../header/header";
import { FooterComponent } from "../footer/footer";
export function UserLayout({ children }: { children: React.ReactNode }) {
    const path = usePathname();
    const router = useRouter();
    const mainHeightStyle = 'calc(100vh - 7rem)';

    return (
        <div>
            <HeaderComponent></HeaderComponent>
            <div className="md:max-w-[1200px] md:mx-auto font-sans">
                <div className="" style={{ minHeight: mainHeightStyle }}>
                    {children}
                </div>
            </div>
            {/* footer */}
            <FooterComponent />
        </div>
    )
}