import Navbar from "../../components/navbar/Navbar.jsx"
import {Outlet} from "react-router";
import { driverNavItems } from "./DriverNavItems.jsx";
import {useRequestedBagsCount} from "../admin-dashboard/hooks/useRequestedBagsCount.js";

function DriverDashboard() {

    const { count } = useRequestedBagsCount();

    return (
        <>
            <div>
                <Navbar title="Chauffør" navItems={driverNavItems} pendingBags={count}/>
                <Outlet />
            </div>
        </>
    )
}

export default DriverDashboard;