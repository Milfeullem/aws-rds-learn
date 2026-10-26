import money from "../utils/money";

export default function PurchaseSummary({color, size, quantity, unitPrice, basePrice, cartPayload }) {
  return (
    <aside className="summary-card" aria-label="Current selection summary">
      <div>
        <span>Selected</span>
        <strong>{color} {size ?? '-'}</strong>
      </div>
      <div>
        <span>Current line total</span>
        <strong>{quantity ? money(unitPrice * quantity) : basePrice}</strong>
      </div>
      {cartPayload ? (
        <p className="success" role="status">Added {cartPayload.quantity} item(s): {cartPayload.color} / {cartPayload.size}</p>
      ) : (
        <p>Add to cart to confirm the currrent selection.</p>
      )}
    </aside>
  )
}