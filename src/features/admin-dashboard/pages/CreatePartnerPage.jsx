import { useState } from "react";
import { useNavigate } from "react-router";
import PageContainer from "../../../components/PageContainer.jsx";
import AddressAutocomplete from "../components/AddressAutocomplete.jsx";
import { partners } from "../../../lib/partners.js";

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
                <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-lg">
                    <h2 className="text-section-header text-green-800">Partner oprettet!</h2>
                    <p className="mt-2 text-sm text-green-700">Giv denne PIN til partneren:</p>
                    <div className="mt-4 text-4xl font-mono font-bold tracking-wider text-green-900">
                        {generatedPin}
                    </div>
                    <button
                        onClick={() => navigate("/admin/partners")}
                        className="mt-6 px-4 py-2 bg-primary text-white rounded-md"
                    >
                        Tilbage til partneroversigt
                    </button>
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
                    <input
                        type="text" value={name} onChange={(e) => setName(e.target.value)}
                        required minLength={2}
                        className="bg-gray-200 p-3 rounded-md"
                    />
                </label>

                <label className="flex flex-col gap-1">
                    <span className="text-sm">Telefonnummer (valgfrit)</span>
                    <input
                        type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)}
                        className="bg-gray-200 p-3 rounded-md"
                    />
                </label>

                <AddressAutocomplete
                    selectedAddress={address}
                    onSelect={setAddress}
                />

                {error && (
                    <div role="alert" className="text-sm text-red-500 bg-red-100 px-3 py-2 rounded">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="p-3 bg-blue-400 text-white rounded-md disabled:opacity-50"
                >
                    {isSubmitting ? "Opretter..." : "Opret partner"}
                </button>
            </form>
        </PageContainer>
    );
}

export default CreatePartnerPage;