import Button from "../../../components/Button.jsx";


function PickupRequestForm({bags, setBags, onSubmit, buttonText, isUpdated}) {

    function increaseBags(){
        const currentBags = Number(bags || 0);
        setBags(String(currentBags + 1));
    }

    function decreaseBags(){
        const currentBags = Number(bags || 1)

        if(currentBags <= 1){
            return
        }

        setBags(String(currentBags - 1))
    }

    return (
        <form onSubmit={onSubmit} className="flex flex-col gap-3">
            <input type="number"
                   min="1"
                   placeholder="Antal af poser"
                   value={bags}
                   onChange={event => setBags(event.target.value)}
                   className="bg-surface-secondary p-3 rounded-md"
                   required
            />

            {isUpdated && (
                <div className="flex gap-gap-md">
                    <Button type="button" onClick={decreaseBags}>
                        - Fjern
                    </Button>

                    <Button type="button" onClick={increaseBags}>
                        + Tilføj
                    </Button>
                </div>
            )}

            <Button type="submit">
                {buttonText}
            </Button>
        </form>

    );

}

export default PickupRequestForm;
