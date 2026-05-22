import { Link } from "react-router";
import PageContainer from "../../../components/PageContainer.jsx";
import Button from "../../../components/Button.jsx";
import SectionCard from "../../../components/SectionCard.jsx";
import PartnerCard from "../components/PartnerCard.jsx";
import { usePartners } from "../hooks/usePartners.js";
import {UserPlus} from "lucide-react";

function AdminPartnersPage() {
    const { partners, error } = usePartners();

    return (
        <PageContainer>
            <div className="mt-6">
                <SectionCard headerContent={
                    <div className="flex justify-between items-center">
                        <h2 className="text-section-header">Partnere</h2>
                        <Link to="new">
                            <Button icon={<UserPlus />}>Opret Virksomhed</Button>
                        </Link>
                    </div>
                }>
                    {error && (
                        <div role="alert" className="text-sm accent-danger px-3 py-2 rounded">
                            Kunne ikke hente partnere: {error.message}
                        </div>
                    )}

                    {partners === null && !error && (
                        <p className="text-sm text-gray-500">Indlæser partnere...</p>
                    )}

                    {partners && partners.length === 0 && (
                        <p className="text-sm text-gray-500">
                            Ingen partnere endnu. Klik "+ Add Partner" for at oprette den første.
                        </p>
                    )}

                    {partners && partners.length > 0 && (
                        <div className="flex flex-col gap-gap-sm">
                            {partners.map((partner) => (
                                <PartnerCard
                                    key={partner.id}
                                    partner={partner}
                                    onEdit={(p) => console.log("Edit", p.id)}
                                    onDelete={(p) => console.log("Delete", p.id)}
                                />
                            ))}
                        </div>
                    )}
                </SectionCard>
            </div>
        </PageContainer>
    );
}

export default AdminPartnersPage;