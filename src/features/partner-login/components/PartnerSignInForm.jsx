function PartnerSignInForm({ callback }) {

    return (
        <div>
            <form action={formData => callback(formData)}>
                <div className={'flex gap-2'}>
                    <input type={'text'} placeholder={'PIN'} name={'pin'} className={'bg-gray-200 p-4 h-full rounded-md'}></input>
                    <button type={'submit'} className={'p-4 bg-blue-400 rounded-md'}>LOG IND</button>
                </div>
            </form>
        </div>
    );
}

export default PartnerSignInForm;