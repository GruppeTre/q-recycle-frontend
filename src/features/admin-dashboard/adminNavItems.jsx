import {ChartColumn, Truck, Users} from "lucide-react";

export const adminNavItems = [
    {
        icon: <Truck />,
        label: "Drivers",
        to: "/admin/drivers"
    },
    {
        icon: <Users />,
        label: "Partners",
        to: "/admin/partners"
    },
    {
        icon: <ChartColumn />,
        label: "Statistics",
        to: "/admin/statistics"
    }
];