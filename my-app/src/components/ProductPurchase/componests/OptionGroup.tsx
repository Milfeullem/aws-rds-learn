import clsx from "../utils/clsx";

export default function OptionGroup({legend, options, selectedValue, onChange}) {
  return (
    <fieldset>
      <legend>{legend}</legend>
      <div className="option-grid">
        {options.map((option) => {
          const isSelected  = selectedValue === option.value;

          return (
            <button key={option.value} disabled={option.disabled} aria-pressed={isSelected} onClick={() => onChange(option.value)} className={clsx('option', isSelected && 'selected')}>
              {option.swatch ? (
                <div className="swatch" style={{backgroundColor: option.swatch}} aria-hidden="true" />
              ): null}
              <span>{option.label}</span>
              <span>{option.meta}</span>
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}