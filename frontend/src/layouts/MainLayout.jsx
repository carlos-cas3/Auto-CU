import Header from "../components/Header/Header";
import Navbar from "../components/Navbar/Navbar";
import { Outlet } from "react-router";

const MainLayout = () => {
    return (
        <div id="layout-wrapper">

            <Header />
            
            <Navbar />
            <main>
                <Outlet />
            </main>

        </div>
    );
};

export default MainLayout;
