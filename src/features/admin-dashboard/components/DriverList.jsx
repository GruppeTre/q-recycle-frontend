import { useEffect, useState } from "react";
import { Link } from "react-router";
import { accountApi} from "../../../lib/accountApi.js";
import SectionCard from "../../../components/SectionCard.jsx";
import {Pencil, Trash2} from "lucide-react";

function DriversList() {
    const [driver, setDriver] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;

        accountApi.fetchAllDrivers()
            .then((data) => {
                if(!cancelled) {
                    setDriver(data);
                    setLoading(false);
                }
            })
            .catch((err) => {
                if(!cancelled) {
                    setError(err.message);
                    setLoading(false);
                }
            });
        return () => { cancelled = true; };
    }, []);

    if (loading) return (
        <SectionCard backgroundColor="surface-secondary">
            <p className="text-text-muted">Indlæser chauffører...</p>
        </SectionCard>
    );
    if (error) return (
        <SectionCard backgroundColor="surface-secondary">
            <p className="text-danger">Fejl: {error}</p>
        </SectionCard>
    );
    if (driver.length === 0) return (
        <SectionCard backgroundColor="surface-secondary">
            <p className="text-text-muted">Ingen chauffører</p>
        </SectionCard>
    );

    return (
        <div className="flex flex-col gap-2">
            {driver.map((d) => (
                <DriverCard key={driver.id} driver={d} />
            ))}
        </div>
    );
}

function DriverCard({driver}) {
    const fullName = [driver.firstname, driver.surname].filter(Boolean).join(" ");

    return (
        <SectionCard backgroundColor="surface-secondary">
            <div className="flex items-center justify-between p-gap-md">
                <div className="flex flex-col">
                    <h3 className="font-semibold text-base mb-gap-sm">{fullName ?? "Uden navn"}</h3>
                    {driver.phonenumber && (
                        <p className="text-muted">Tlf: {driver.phonenumber}</p>
                    )}
                </div>

                <div className="flex gap-2 items-center">
                    <Link
                        to={`/admin/drivers/${driver.id}/edit`}
                        className="p-2 accent-success text-success cursor-pointer"
                    >
                        <Pencil size={18} />
                    </Link>

                    <button
                        //Delete function her!
                        type="button"
                        //onClick={() => onDelete?.(driver)}
                        className="p-2 accent-danger text-danger cursor-pointer"
                        aria-label="Slet partner"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>
        </SectionCard>
    )
}

export default DriversList;