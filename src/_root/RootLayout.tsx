import { Outlet } from 'react-router-dom';
import LeftSidebar from "@/components/shared/LeftSidebar.tsx";
import Topbar from "@/components/shared/Topbar.tsx";
import Bottombar from "@/components/shared/Bottombar.tsx";
function RootLayout() {
    return (
        <div className="w-full md:flex">
            <Topbar />
            <LeftSidebar />
            <section className="h-full flex flex-1">
                <Outlet />
            </section>
            <Bottombar />
        </div>
    );
}

export default RootLayout;