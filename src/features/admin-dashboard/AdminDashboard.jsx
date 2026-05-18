import Navbar from "../../components/navbar/Navbar.jsx";
import {adminNavItems} from "./adminNavItems.jsx";
import {Outlet} from "react-router";

function AdminDashboard() {

    return (
        <>
            <title>Q-recycle | Admin</title>
            <div className="bg-primary-background h-dvh">
                <Navbar title="Admin" navItems={adminNavItems}/>
                <Outlet />
            </div>
        </>
    );
}

export default AdminDashboard;