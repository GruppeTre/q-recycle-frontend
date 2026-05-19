function HeroIcon({ pendingBags }) {
    return (
        <div className="relative bg-primary rounded-lg p-gap-sm">
            <img src="/src/assets/hero-icon.png" alt="logo" className="w-6 h-6"/>

            {pendingBags > 0 && (
                <span className="absolute -top-1 -right-3 min-w-5 h-5 px-1 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {pendingBags > 99 ? '99+' : pendingBags}
                </span>
            )}
        </div>
    );
}

export default HeroIcon;