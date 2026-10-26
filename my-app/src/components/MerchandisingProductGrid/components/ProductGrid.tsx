// return {
//   id: "p-" + (index + 1),
//   name: category + " Essential " + (index + 1),
//   category,
//   price: 24 + ((index * 17) % 220),
//   rating: 3 + ((index * 7) % 20) / 10,
//   inventory: 2 + ((index * 13) % 80),
// };

import money from "../../ProductPurchase/utils/money";

export default function ProductGrid({ products }) {
  if (products.length === 0) {
    return (
      <section className="empty" role="status">
        <h2>No products match these filters</h2>
        <p>Try a broader search term or switch category</p>
      </section>
    );
  }

  return (
    <ul className="product-grid" aria-label="products">
      {products.map((item) => {
        return (
          <li className="product-card" key={item.id}>
            <div className="product-art" aria-hidden="true" />
            <div>
              <p className="category">{item.category}</p>
              <h2>{item.name}</h2>
              <div className="card-meta">
                <strong>{money(item.price)}</strong>
                <span aria-label={`Rating ${item.rating.toFixed(1)} out of 5`}>
                  {item.rating.toFixed(1)}
                </span>
              </div>
              <p>{item.inventory} in stock</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
