function SectionCard({children, title = null, headerContent = null, backgroundColor = null, border = false}) {
    return (
        <div className={`
            flex
            flex-col
            gap-gap-md
            rounded-lg
            px-gap-md
            py-gap-md
            shadow-sm
            box-border
            border-2
            ${backgroundColor ? `bg-${backgroundColor}` : 'bg-surface-primary'}
            ${border ? 'border-primary' : 'border-transparent'}
        `}>
            {(title || headerContent) &&
                <div className="w-full border-b border-surface-primary-accent pb-gap-sm">
                    {title && <h2 className="text-section-header">{title}</h2>}
                    {headerContent && headerContent}
                </div>
            }
            {children}
        </div>
    );
}

export default SectionCard;