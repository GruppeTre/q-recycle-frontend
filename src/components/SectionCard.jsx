function SectionCard({children, title = null}) {
    return (
        <div className="flex flex-col gap-gap-md bg-background rounded-lg px-gap-md py-gap-md shadow-sm">
            {title &&
                <div className="w-full border-b border-surface">
                    <h2 className="text-section-header">{title}</h2>
                </div>
            }
            {children}
        </div>
    );
}

export default SectionCard;