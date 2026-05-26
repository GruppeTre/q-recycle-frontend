import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import PageContainer from "../../../components/PageContainer.jsx";
import SectionCard from "../../../components/SectionCard.jsx";
import Input from "../../../components/Input.jsx";
import Button from "../../../components/Button.jsx";
import { accountApi } from "../../../lib/accountApi.js";

function EditDriverPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [firstname, setFirstname] = useState("");
    const [surname, setSurname] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        const fetchDriver = async () => {
            try {
                const data = await accountApi.fetchDriverById(id);
                if (!isMounted) return;

                setFirstname(data.firstname ?? "");
                setSurname(data.surname ?? "");
                setPhoneNumber(data.phonenumber ?? "");
            } catch (e) {
                if (isMounted) setError(e.message ?? "Kunne ikke hente chauffør");
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        fetchDriver();

        return () => {
            isMounted = false;
        };
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        if (!firstname.trim() || !surname.trim()) {
            setError("Udfyld både fornavn og efternavn");
            return;
        }

        setError(null);
        setIsSubmitting(true);

        try {
            await accountApi.updateDriver(id, {
                firstname: firstname.trim(),
                surname: surname.trim(),
                phoneNumber: phoneNumber.trim() || null,
            });

            navigate("/admin/drivers");
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
                        <h2 className="text-section-header">Rediger chauffør</h2>
                        <Link to="/admin/drivers">
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
                                <span className="text-sm">Fornavn</span>
                                <Input
                                    type="text" value={firstname} onChange={(e) => setFirstname(e.target.value)}
                                    required minLength={1}
                                />
                            </label>

                            <label className="flex flex-col gap-1">
                                <span className="text-sm">Efternavn</span>
                                <Input
                                    type="text" value={surname} onChange={(e) => setSurname(e.target.value)}
                                    required minLength={1}
                                />
                            </label>

                            <label className="flex flex-col gap-1">
                                <span className="text-sm">Telefonnummer</span>
                                <Input
                                    type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)}
                                />
                            </label>

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

export default EditDriverPage;