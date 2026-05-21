import Navbar from "../../components/navbar/Navbar.jsx"
import {Outlet} from "react-router";
import { driverNavItems } from "./DriverNavItems.jsx";

function DriverDashboard() {

    return (
        <>
            <div>
                <Navbar title="Driver" navItems={driverNavItems} />
                <Outlet />
            </div>
        </>
    )
}

export default DriverDashboard;