import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import PageContainer from "../../../components/PageContainer.jsx";
import SectionCard from "../../../components/SectionCard.jsx";
import Input from "../../../components/Input.jsx";
import Button from "../../../components/Button.jsx";
import AddressAutocomplete from "../components/AddressAutocomplete.jsx";
import { partners } from "../../../lib/partners.js";

function EditPartnerPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [address, setAddress] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        const fetchPartner = async () => {
            try {
                const data = await partners.get(id);
                if (!isMounted) return;

                setName(data.name ?? "");
                setPhoneNumber(data.phone_number ?? "");

                if (data.address) {
                    setAddress({
                        displayText: `${data.address.street} ${data.address.number ?? ""}, ${data.address.zipcode} ${data.address.city}`,
                        street: data.address.street,
                        number: data.address.number,
                        zipcode: data.address.zipcode,
                        city: data.address.city,
                        lng: data.address.lng,
                        lat: data.address.lat,
                    });
                }
            } catch (e) {
                if (isMounted) setError(e.message ?? "Kunne ikke hente partner");
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        fetchPartner();

        return () => {
            isMounted = false;
        };
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        if (!address) {
            setError("Vælg en adresse fra forslagene");
            return;
        }

        setError(null);
        setIsSubmitting(true);

        try {
            await partners.update(id, {
                name,
                phoneNumber,
                address: {
                    street: address.street,
                    number: address.number,
                    zipcode: address.zipcode,
                    city: address.city,
                    lng: address.lng,
                    lat: address.lat,
                },
            });

            navigate("/admin/partners");
        } catch (e) {
            setError(e.message ?? "Kunne ikke gemme ændringer");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <PageContainer>
            <div className="mt-6 max-w-md mx-auto">
                <SectionCard headerContent={
                    <div className="flex justify-between items-center">
                        <h2 className="text-section-header">Rediger partner</h2>
                        <Link to="/admin/partners">
                            <Button icon={<ArrowLeft />}>Tilbage</Button>
                        </Link>
                    </div>
                }>
                    {isLoading && (
                        <p className="text-sm text-gray-500">Indlæser...</p>
                    )}

                    {!isLoading && (
                        <form onSubmit={handleSubmit} className="flex flex-col gap-gap-md max-w-md">
                            <label className="flex flex-col gap-1">
                                <span className="text-sm">Navn</span>
                                <Input
                                    type="text" value={name} onChange={(e) => setName(e.target.value)}
                                    required minLength={2}
                                />
                            </label>

                            <label className="flex flex-col gap-1">
                                <span className="text-sm">Telefonnummer</span>
                                <Input
                                    type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)}
                                />
                            </label>

                            <AddressAutocomplete
                                selectedAddress={address}
                                onSelect={setAddress}
                            />

                            {error && (
                                <div role="alert" className="text-sm accent-danger px-3 py-2 rounded">
                                    {error}
                                </div>
                            )}

                            <Button
                                type="submit"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Gemmer..." : "Gem ændringer"}
                            </Button>
                        </form>
                    )}
                </SectionCard>
            </div>
        </PageContainer>
    );
}

export default EditPartnerPage;