import {useState, useEffect} from "react";
import Button from "../../components/Button.jsx";
import PickupRequestForm from "./components/PickupRequestForm.jsx";
import ConfirmationMessage from "./components/ConfirmationMessage.jsx";
import {supabaseClient} from "../../lib/supabaseClient";
import {useAuth} from "../../context/useAuth.js";
import PageContainer from "../../components/PageContainer.jsx";
import {pickupRequest} from "../../lib/pickupRequest.js";
import {pickupStatus} from "../../config/constants.js";

function PartnerDashboardPage() {

    const [bags, setBags] = useState("")
    const [message, setMessage] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [hasActiveRequest, setHasActiveRequest] = useState(false)

    const {session} = useAuth();
    const user = session.user;

    useEffect(() => {
        async function checkActiveRequest() {
            try {
                const data = await pickupRequest.getActive(user.id);

                if (!data || data.length === 0) {
                    setHasActiveRequest(false);
                    return;
                }

                if (data.length > 1) {
                    console.error("Fejl: Der findes flere aktive anmodninger");
                }

                setHasActiveRequest(true);

            } catch (err) {
                console.log("Fejl ved hentning af aktive anmodninger", err);
                setHasActiveRequest(false);
            }
        }

        void checkActiveRequest()
    }, [user.id])

    const handleSubmit = async (event) => {
        event.preventDefault()

        console.log("handleSubmit kaldt")

        console.log("user data:", JSON.stringify(user));

        const {error} = await supabaseClient.from("pickup").insert({
            partner_id: user.id,
            bags: Number(bags),
            status: pickupStatus.REQUESTED,
            created_at: new Date(),
        })

        console.log("error:", error)

        if (error) {
            setMessage("Noget gik galt, prøv igen")
            return
        }

        setMessage("Din anmodning er sendt")
        setBags("")
        setIsModalOpen(false)
        setHasActiveRequest(true)
    };

    const handleCancel = async () => {
        try {
            await pickupRequest.cancelActive(user.id);
            setHasActiveRequest(false);
            setMessage("Din anmodning er blevet annulleret")
        } catch{
            setMessage("Noget gik galt, prøv igen")
        }
    }

    return (
        <PageContainer>
            <div className="flex flex-col items-center mt-gap-xl">
                <p>Her kan du anmode om at få hentet din pant</p>
                <Button onClick={hasActiveRequest ? handleCancel : () => setIsModalOpen(true)}>
                    {hasActiveRequest ? "Annuller" : "Anmod om afhentning"}
                </Button>
                {message && (<ConfirmationMessage message={message}/>)}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
                        <div className="bg-white p-6 rounded-md w-80">
                            <h2 className="text-xl font-bold mb-4">
                                Antal poser
                            </h2>
                            <PickupRequestForm
                                bags={bags}
                                setBags={setBags}
                                onSubmit={handleSubmit}
                            />
                            <button type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="mt-3 text-sm text-gray-600 underline">
                                Annuller
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </PageContainer>
    )
}

export default PartnerDashboardPage;