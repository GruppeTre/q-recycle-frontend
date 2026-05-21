function Spinner({size = 4, thickness = 0.5, color = '--color-primary'}) {
    return (
        <span className="border-b-transparent rounded-full inline-block box-border animate-spin border-solid"
              style={{
                  width: `${size}rem`,
                  height: `${size}rem`,
                  borderWidth: `${thickness}rem`,
                  borderColor: `var(${color}) transparent transparent transparent`,
              }}
        />
    );
}

export default Spinner;