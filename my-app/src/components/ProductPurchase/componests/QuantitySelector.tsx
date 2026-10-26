export default function QuantitySelector({quantity, max, disabled, onChange}) {
  const safeMax = Math.max(1, max)

  return (
    <div className="quantity-block" role="group" aria-label="Select quantity" aria-disabled={disabled || undefined}>
      <span>Quantity</span>
      <div className="quantity-control">
        <button disabled={disabled || quantity <= 1} onClick={() => onChange(Math.max(1, quantity - 1))}>-</button>
        <output aria-label={`Selected quantity: ${quantity}`}>{quantity}</output>
        <button disabled={disabled || quantity >= safeMax} onClick={() => onChange(Math.min(safeMax, quantity + 1))}>+</button>
      </div>
    </div>
  )
}