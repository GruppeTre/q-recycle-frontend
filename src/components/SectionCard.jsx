function SectionCard({children}) {
    return (
        <div className="flex flex-col gap-gap-md bg-background rounded-lg px-gap-md py-gap-lg shadow-sm">
            {children}
        </div>
    );
}

export default SectionCard;