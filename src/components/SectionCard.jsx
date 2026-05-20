function SectionCard({children, title = null, headerContent = null}) {
    return (
        <div className="flex flex-col gap-gap-md bg-background rounded-lg px-gap-md py-gap-md shadow-sm">
            {(title || headerContent) &&
                <div className="w-full border-b border-surface pb-gap-sm">
                    {title && <h2 className="text-section-header">{title}</h2>}
                    {headerContent && headerContent}
                </div>
            }
            {children}
        </div>
    );
}

export default SectionCard;