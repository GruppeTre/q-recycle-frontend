import {useState} from "react";
import Button from "../../components/Button.jsx";
import PickupRequestForm from "./components/PickupRequestForm.jsx";
import ConfirmationMessage from "./components/ConfirmationMessage.jsx";
import {supabaseClient} from "../../lib/supabaseClient";

function PartnerDashboardPage() {

    const [bags, setBags] = useState("")
    const [message, setMessage] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [hasActiveRequest, setHasActiveRequest] = useState(false)

    const handleSubmit = async (event) => {
        event.preventDefault()

        console.log("handleSubmit kaldt")

        const { data, error: userError } = await supabaseClient.auth.getUser()
        const user = data?.user

        console.log("user data:", JSON.stringify(user));
        console.log("user error:", userError)

        const {error} = await supabaseClient.from("pickup").insert({
            partner_id: user.id,
            bags: Number(bags),
            status: "requested",
            created_at: new Date(),
        })

        console.log("error:", error)
        console.log("data:", data)

        if (error) {
            setMessage("Noget gik galt, prøv igen")
            return
        }

        setMessage("Din anmodning er sendt")
        setBags("")
        setIsModalOpen(false)
        setHasActiveRequest(true)
    };

    const handleCancel = () => {
        setHasActiveRequest(false)
        setMessage("")
    }

    return (
        <div className="max-w-md mx-auto mt-10 p-4">
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
    )
}

export default PartnerDashboardPage;