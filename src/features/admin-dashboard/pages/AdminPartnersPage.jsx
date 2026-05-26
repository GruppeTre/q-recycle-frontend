import {Link, useNavigate} from "react-router";
import PageContainer from "../../../components/PageContainer.jsx";
import Button from "../../../components/Button.jsx";
import SectionCard from "../../../components/SectionCard.jsx";
import PartnerCard from "../components/PartnerCard.jsx";
import { usePartners } from "../hooks/usePartners.js";
import {UserPlus} from "lucide-react";
import { partners as partnersApi } from "../../../lib/partners.js";
import {useState} from "react";

function AdminPartnersPage() {
    const navigate = useNavigate();
    const { partners, error } = usePartners();
    const [deleteError, setDeleteError] = useState(null);

    const handleDelete = async (partner) => {
        const confirmed = window.confirm(
            `Er du sikker på, at du vil slette ${partner.name ?? "denne partner"}? Dette kan ikke fortrydes.`
        );
        if (!confirmed) return;

        try {
            await partnersApi.delete(partner.id);
            setDeleteError(null);
            // Listen opdateres automatisk via real-time subscription i usePartners
        } catch (e) {
            setDeleteError(e.message ?? "Kunne ikke slette partner");
        }
    };

    return (
        <PageContainer>
            <div className="mt-6">
                <SectionCard headerContent={
                    <div className="flex justify-between items-center">
                        <h2 className="text-section-header">Virksomheder</h2>
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

                    {deleteError && (
                        <div role="alert" className="text-sm accent-danger px-3 py-2 rounded">
                            {deleteError}
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
                                    onEdit={(p) => navigate(`${p.id}/edit`)}
                                    onDelete={handleDelete}
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