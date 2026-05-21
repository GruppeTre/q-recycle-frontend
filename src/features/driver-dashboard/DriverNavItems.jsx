import { Truck, DollarSign } from "lucide-react";

export const driverNavItems = [
    {
        icon: <Truck />,
        label: "Rute Oversigt",
        to: "/driver/routes"
    },
    {
        icon: <DollarSign />,
        label: "Udgifter",
        to: "/driver/expenses"
    }
];