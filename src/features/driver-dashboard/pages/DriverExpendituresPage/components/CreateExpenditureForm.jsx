import Input from "../../../../../components/Input.jsx";
import Button from "../../../../../components/Button.jsx";

function CreateExpenditureForm({ onCancel, onSubmit }) {
    return (
        <div>
            <form className="flex flex-col gap-gap-sm mt-gap-md" action={onSubmit}>
                <Input
                    placeholder="Navn"
                    name="name"
                    type="text"
                    minLength='3'
                    maxLength='15'
                    required
                />
                <Input
                    placeholder="Pris"
                    name="price"
                    type="number"
                    required
                />
                <Input
                    defaultValue={new Date().toISOString().split('T')[0]}
                    name="date"
                    type="date"
                    required
                />

                <div className="flex justify-between">
                    <Button backgroundColor="surface-primary" hoverColor={"surface-primary"} onClick={onCancel}>
                        <p>Annuller</p>
                    </Button>
                    <Button type="submit">
                        <p>Opret</p>
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default CreateExpenditureForm;