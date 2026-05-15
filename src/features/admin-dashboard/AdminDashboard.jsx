import Navbar from "../../components/navbar/Navbar.jsx";
import {adminNavItems} from "../../components/navbar/navItems.jsx";
import {Outlet} from "react-router";

function AdminDashboard() {

    return (
        <div className="bg-primary-background h-dvh">
            <Navbar title="Admin" navItems={adminNavItems}/>
            <Outlet />
        </div>
    );
}

export default AdminDashboard;