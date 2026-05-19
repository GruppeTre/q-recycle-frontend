import Button from "../../../components/Button.jsx";


function PickupRequestForm({bags, setBags, onSubmit}) {
    return (
        <form onSubmit={onSubmit} className="flex flex-col gap-3">
            <input type="number"
                   min="1"
                   placeholder="Antal af poser"
                   value={bags}
                   onChange={event => setBags(event.target.value)}
                   className="bg-gray-200 p-3 rounded-md"
                   required
            />
            <Button type="submit">
                Bekræft
            </Button>
        </form>

    );

}

export default PickupRequestForm;
