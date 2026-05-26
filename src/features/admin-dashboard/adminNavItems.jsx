import {ChartColumn, Truck, Users} from "lucide-react";

export const adminNavItems = [
    {
        icon: <Truck />,
        label: "Chauffører",
        to: "/admin/drivers"
    },
    {
        icon: <Users />,
        label: "Virksomheder",
        to: "/admin/partners"
    },
    {
        icon: <ChartColumn />,
        label: "Statistik",
        to: "/admin/statistics"
    }
];