import Header from "../components/Header/Header";
import Navbar from "../components/Navbar/Navbar";
import { Outlet } from "react-router";

const MainLayout = () => {
    return (
        <div id="layout-wrapper">
            <div className="bg-black text-white text-center p-4">
                <p>This is the main layout of the application.</p>
            </div>

            <Header />
            
            <Navbar />
            <main>
                <Outlet />
            </main>

        </div>
    );
};

export default MainLayout;
