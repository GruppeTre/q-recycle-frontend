import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { accountApi} from "../../../lib/accountApi.js";
import PageContainer from "../../../components/PageContainer";
import SectionCard from "../../../components/SectionCard.jsx";
import {INTERNAL_EMAIL_SUFFIX} from "../../../config/constants.js"
import Button from "../../../components/Button.jsx";
import {ArrowLeft} from "lucide-react";
import Field from "../../../components/Field";

function CreateDriverPage() {
    const navigate = useNavigate();
    const [ saving, setSaving ] = useState(false);
    const [ error, setError ] = useState(null);
    const [ fieldError, setFieldError ] = useState({});

    const [ emailLocal, setEmailLocal ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ firstname, setFirstname ] = useState("");
    const [ surname, setSurname ] = useState("");
    const [ phonenumber, setPhonenumber ] = useState("");

    async function handleSubmit() {
        setSaving(true);
        setError(null);
        setFieldError({});
        try{
            const email = emailLocal + INTERNAL_EMAIL_SUFFIX;
            await accountApi.createDriver({email, password, firstname, surname, phonenumber});
            navigate("/admin/drivers");
        } catch (err) {
            setError(err.message);
            if (err.fieldErrors) setFieldError(err.fieldErrors);
            setSaving(false);
        }
    }

    return (
        <PageContainer>
            <div className="mt-6">
                <SectionCard>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-section-header">Opret chauffør</h2>
                        <Link to="/admin/drivers">
                            <Button
                                className="text-sm text-text-muted hover:text-primary transition"
                                icon={<ArrowLeft />}
                            >
                                Tilbage
                            </Button>
                        </Link>
                    </div>

                    <div className="flex flex-col gap-4">
                        <Field label="Brugernavn" error={fieldError.email}>
                            <input
                                type="text"
                                value={emailLocal}
                                onChange={(e) => setEmailLocal(e.target.value)}
                                className="w-full bg-background border border-border rounded px-3 py-2 text-sm text-text"
                            />
                        </Field>

                        <Field label="Password" error={fieldError.password}>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-background border border-border rounded px-3 py-2 text-sm text-text"
                            />
                        </Field>

                        <Field label="Fornavn" error={fieldError.firstName}>
                            <input
                                type="text"
                                value={firstname}
                                onChange={(e) => setFirstname(e.target.value)}
                                className="w-full bg-background border border-border rounded px-3 py-2 text-sm text-text"
                            />
                        </Field>

                        <Field label="Efternavn" error={fieldError.lastName}>
                            <input
                                type="text"
                                value={surname}
                                onChange={(e) => setSurname(e.target.value)}
                                className="w-full bg-background border border-border rounded px-3 py-2 text-sm text-text"
                            />
                        </Field>

                        <Field label="Telefon" error={fieldError.phone}>
                            <input
                                type="text"
                                value={phonenumber}
                                onChange={(e) => setPhonenumber(e.target.value)}
                                className="w-full bg-background border border-border rounded px-3 py-2 text-sm text-text"

                            />
                        </Field>

                        {error && !Object.keys(fieldError).length && (
                            <p className="text-sm text-danger">{error}</p>
                        )}

                        <div className="flex gap-2 mt-2">
                            <Button onClick={handleSubmit} disabled={saving}>
                                {saving ? "Opretter..." : "Opret Chauffør"}
                            </Button>
                            <button
                                onClick={() => navigate("/admin/drivers")}
                                className="px-4 py-2 rounded bg-surface-hover text-text font-semibold"
                            >
                                Annulér
                            </button>
                        </div>
                    </div>
                </SectionCard>
            </div>
        </PageContainer>
    );
}

export default CreateDriverPage;