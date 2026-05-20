import {useState, useEffect} from "react";
import Button from "../../components/Button.jsx";
import PickupRequestForm from "./components/PickupRequestForm.jsx";
import ConfirmationMessage from "./components/ConfirmationMessage.jsx";
import {supabaseClient} from "../../lib/supabaseClient";
import {useAuth} from "../../context/useAuth.js";
import PageContainer from "../../components/PageContainer.jsx";
import {pickupRequest} from "../../lib/pickupRequest.js";
import {pickupStatus} from "../../config/constants.js";
import Modal from "../../components/Modal.jsx";
import PickupRequestReceipt from "./components/PickupRequestReceipt.jsx";

function PartnerDashboardPage() {

    const [bags, setBags] = useState("")
    const [message, setMessage] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false)

    const [activeRequest, setActiveRequest] = useState(null)

    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)

    const {session} = useAuth();
    const user = session.user;
    const hasActiveRequest = activeRequest !== null

    useEffect(() => {
        async function checkActiveRequest() {
            try {
                const data = await pickupRequest.getActive(user.id);

                if (!data || data.length === 0) {
                    setActiveRequest(null);
                    return;
                }

                if (data.length > 1) {
                    console.error("Fejl: Der findes flere aktive anmodninger");
                }

                setActiveRequest(data[0]);
                setBags(String(data[0].bags));

            } catch (err) {
                console.log("Fejl ved hentning af aktive anmodninger", err);
                setActiveRequest(null);
            }
        }

        void checkActiveRequest()
    }, [user.id])

    const handleSubmit = async (event) => {
        event.preventDefault()

        console.log("handleSubmit kaldt")

        console.log("user data:", JSON.stringify(user));

        const {data, error} = await supabaseClient
            .from("pickup")
            .insert({
            partner_id: user.id,
            bags: Number(bags),
            status: pickupStatus.REQUESTED,
            created_at: new Date(),
        })
            .select()

        console.log("error:", error)

        if (error) {
            setMessage("Noget gik galt, prøv igen")
            return
        }

        setMessage("Din anmodning er sendt")
        setBags("")
        setIsModalOpen(false)
        setActiveRequest(data[0])
    };

    const handleUpdate = async (event) => {
        event.preventDefault()

        try{
            const updatedBagCount = activeRequest.bags + Number(bags)

            await pickupRequest.update(
                activeRequest.id,
                updatedBagCount
            );

            setMessage("Din anmodning er blevet opdateret")
            setIsModalOpen(false)

            setActiveRequest({
                ...activeRequest,
                bags: updatedBagCount,
            })

            setBags("")

        }catch{
            setMessage("Noget gik galt, prøv igen")
        }
    }

    const handleCancel = async () => {
        try {
            await pickupRequest.cancelActive(user.id);
            setActiveRequest(null);
            setIsCancelModalOpen(false);
            setMessage("Din anmodning er blevet annulleret")
        } catch{
            setMessage("Noget gik galt, prøv igen")
        }
    }

    return (
        <PageContainer>
            <div className="flex flex-col items-center mt-gap-xl gap-gap-md">

                <p>Her kan du anmode om at få hentet din pant</p>

                {!hasActiveRequest && (
                    <Button onClick={() => setIsModalOpen(true)}>
                        Anmod om afhentning
                    </Button>
                )}

                {hasActiveRequest && (
                    <PickupRequestReceipt
                        activeRequest={activeRequest}

                        onUpdate={() => setIsModalOpen(true)}
                        onCancel={() => setIsCancelModalOpen(true)}
                    />
                )}


                {message && (
                    <ConfirmationMessage message={message}/>
                )}


                {isModalOpen && (
                    <Modal
                        title={
                            hasActiveRequest
                                ? "Opdater antal poser"
                                : "Antal poser"
                        }
                        onClose={() => setIsModalOpen(false)}
                    >

                        <PickupRequestForm
                            bags={bags}
                            setBags={setBags}
                            onSubmit={
                                hasActiveRequest
                                    ? handleUpdate
                                    : handleSubmit
                            }

                            buttonText={
                                hasActiveRequest
                                    ? "Opdater"
                                    : "Bekræft"
                            }
                        />

                    </Modal>
                )}


                {isCancelModalOpen && (
                    <Modal
                        title="Annuller afhentning"
                        onClose={() => setIsCancelModalOpen(false)}
                    >
                        <div className="flex flex-col gap-gap-md">

                            <p>
                                Er du sikker på, at du vil annullere afhentningen?
                            </p>

                            <Button onClick={handleCancel}>
                                Bekræft annullering
                            </Button>

                        </div>
                    </Modal>
                )}
            </div>

        </PageContainer>
    )
}

export default PartnerDashboardPage;