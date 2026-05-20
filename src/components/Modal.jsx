function Modal({title, children, onClose}) {
    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
            <div className="bg-surface p-6 rounded-md w-80 shadow-lg border border-primary/20">
                {title && (
                    <h2 className="text-section-header mb-4">
                        {title}
                    </h2>
                )}

                <div className="text-body">
                    {children}
                </div>
                <button
                    type="button"
                    onClick={onClose}
                    className="mt-3
                text-sm
                text-text-color-muted
                hover:text-text-color
                underline
                transition-colors">

                    Annuller

                </button>
            </div>
        </div>
    )
}

export default Modal;