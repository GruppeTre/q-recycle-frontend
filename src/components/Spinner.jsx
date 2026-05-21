function Spinner({size = 12, thickness = 6, color = 'primary'}) {
    return (
        <span className={`
            w-${size}
            h-${size}
            border-${thickness}
            border-${color}
            border-b-transparent
            rounded-full
            inline-block
            box-border
            animate-spin
        `}
        />
    );
}

export default Spinner;