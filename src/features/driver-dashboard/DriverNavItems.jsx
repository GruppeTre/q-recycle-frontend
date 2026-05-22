import {Map, Wallet} from "lucide-react";

export const driverNavItems = [
    {
        icon: <Map />,
        label: "Rute Oversigt",
        to: "/driver/routes"
    },
    {
        icon: <Wallet />,
        label: "Udgifter",
        to: "/driver/expenses"
    }
];