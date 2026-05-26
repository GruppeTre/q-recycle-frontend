import { useState } from "react";
import { useNavigate } from "react-router";
import { accountApi} from "../../../lib/accountApi.js";
import PageContainer from "../../../components/PageContainer";
import SectionCard from "../../../components/SectionCard.jsx";
import Button from "../../../components/Button.jsx";

function CreateDriverPage() {
    const navigate = useNavigate();
    const [ saving, setSaving ] = React.useState(false);
    const [ error, setError ] = React.useState(null);
    const [ fieldError, setFieldError ] = React.useState({});

    const [ email, setEmail ] = React.useState("");
    const [ password, setPassword ] = React.useState("");
    const [ firstName, setFirstName ] = React.useState("");
    const [ lastName, setLastName ] = React.useState("");
    const [ phone, setPhone ] = React.useState("");

    async function handleSubmit() {
        setSaving(true);
        setError(null);
        setFieldError({});
        try{
            await accountApi.createDriver({email, password, firstName, lastName, phone});
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
                        <h2 className="text-section-header">Opret ny chauffør</h2>
                        <button
                            onClick={() => navigate("/admin/drivers")}
                            className="text-sm text-text-muted hover:text-primary transition"
                        >
                            ← Tilbage
                        </button>
                    </div>

                    <div className="flex flex-col gap-4">
                        <Field label="Email" error={fieldError.email}>
                            <input
                                type="text"
                                value={email}/>
                        </Field>
                    </div>
                </SectionCard>
            </div>
        </PageContainer>
    )

}
