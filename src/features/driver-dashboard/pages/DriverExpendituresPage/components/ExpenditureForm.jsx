import Input from "../../../../../components/Input.jsx";
import Button from "../../../../../components/Button.jsx";

function ExpenditureForm({ onCancel, onSubmit, toUpdate }) {
    return (
        <div>
            <form className="flex flex-col gap-gap-sm mt-gap-md" action={onSubmit}>
                <div className="flex flex-col">
                    <label htmlFor="name" className="text-muted">Navn</label>
                    <Input
                        placeholder="Navn"
                        name="name"
                        type="text"
                        defaultValue={toUpdate ? toUpdate.name : ''}
                        minLength='3'
                        maxLength='15'
                        required
                    />
                </div>

                <div className="flex flex-col">
                    <label htmlFor="price" className="text-muted">Pris</label>
                    <Input
                        placeholder="Pris"
                        name="price"
                        type="number"
                        defaultValue={toUpdate ? toUpdate.amount : ''}
                        required
                    />
                </div>

                <div className="flex flex-col">
                    <label htmlFor="date" className="text-muted">Dato</label>
                    <Input
                        name="date"
                        type="date"
                        defaultValue={toUpdate ? new Date(toUpdate.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
                        required
                    />
                </div>

                <div className="flex justify-between">
                    <Button
                        type="button"
                        backgroundColor="surface-primary"
                        hoverColor={"surface-primary"}
                        onClick={onCancel}
                    >
                        <p>Annuller</p>
                    </Button>

                    <Button type="submit">
                        <p>{toUpdate
                            ? 'Opdater'
                            : 'Opret'
                        }</p>
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default ExpenditureForm;