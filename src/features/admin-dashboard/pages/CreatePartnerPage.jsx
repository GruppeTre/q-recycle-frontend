import { useState } from "react";
import { useNavigate } from "react-router";
import PageContainer from "../../../components/PageContainer.jsx";
import AddressAutocomplete from "../components/AddressAutocomplete.jsx";
import { partners } from "../../../lib/partners.js";
import Button from "../../../components/Button.jsx";
import Input from "../../../components/Input.jsx";

function CreatePartnerPage() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [address, setAddress] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [generatedPin, setGeneratedPin] = useState(null);

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
            const { pin } = await partners.create({
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
            setGeneratedPin(pin);
        } catch (e) {
            setError(e.message ?? "Kunne ikke oprette partner");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (generatedPin) {
        return (
            <PageContainer>
                <div className="mt-8 p-6 rounded-lg">
                    <h2 className="text-section-header accent-success">Partner oprettet</h2>
                    <p className="mt-2 text-sm accent-success">Giv denne PIN til partneren:</p>
                    <div className="mt-4 text-4xl font-mono font-bold tracking-wider accent-success">
                        {generatedPin}
                    </div>
                    <Button
                        onClick={() => navigate("/admin/partners")}>
                        Tilbage til partneroversigt
                    </Button>
                </div>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            <h1 className="text-section-header mt-4">Opret partner</h1>
            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-gap-md max-w-md">
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
                    {isSubmitting ? "Opretter..." : "Opret partner"}
                </Button>
            </form>
        </PageContainer>
    );
}

export default CreatePartnerPage;