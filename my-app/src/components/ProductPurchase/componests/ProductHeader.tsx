import money from '../utils/money'

export default function ProductHeader({title, subtitle, price, rating, reviewCount, badges}) {
  return (
    <header className="product-header">
      <h1 id="product-title">{title}</h1>
      <p>{subtitle}</p>
      <div className="price-row">
        <strong>{money(price)}</strong>
        <span>{rating} rating · {reviewCount} reviews</span>
      </div>
      <div className="badge-row" aria-label="Purchase benefits">
        {badges.map((badge) => {
          return <span key={badge}>{badge}</span>
        })}
      </div>
    </header>
  )
}