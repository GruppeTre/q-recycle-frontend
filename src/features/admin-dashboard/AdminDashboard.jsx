import Navbar from "../../components/navbar/Navbar.jsx";
import {adminNavItems} from "./adminNavItems.jsx";
import {Outlet} from "react-router";
import { useRequestedBagsCount } from "./hooks/useRequestedBagsCount.js";

function AdminDashboard() {

    const { count } = useRequestedBagsCount();

    return (
        <>
            <title>Q-recycle | Admin</title>
            <Navbar title="Admin" navItems={adminNavItems} pendingBags={count}/>
            <Outlet />
        </>
    );
}

export default AdminDashboard;