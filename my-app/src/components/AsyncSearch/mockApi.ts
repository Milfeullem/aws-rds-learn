const mockProducts = [
  {
    id: "p-1",
    name: "Voyager Hoodie",
    category: "Apparel",
    price: 76,
    rating: 4.8,
  },
  { id: "p-2", name: "Market Tote", category: "Bags", price: 28, rating: 4.5 },
  {
    id: "p-3",
    name: "Everyday Cap",
    category: "Accessories",
    price: 34,
    rating: 4.2,
  },
  {
    id: "p-4",
    name: "Trail Sneakers",
    category: "Shoes",
    price: 118,
    rating: 4.7,
  },
  { id: "p-5", name: "Desk Lamp", category: "Home", price: 64, rating: 4.4 },
  {
    id: "p-6",
    name: "Travel Backpack",
    category: "Bags",
    price: 132,
    rating: 4.9,
  },
];

function createAbortError() {
  return new DOMException("The search request was aborted.", "AbortError");
}

export function mockSearchProducts(query, { signal } = {}) {
  const normalizedQuery = query.trim().toLowerCase();
  const latency = normalizedQuery.includes("bag")
    ? 800
    : normalizedQuery.includes("hood")
      ? 500
      : 250;

  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(createAbortError());
      return;
    }

    const timeoutId = window.setTimeout(() => {
      if (signal?.aborted) {
        reject(createAbortError());
        return;
      }

      if (normalizedQuery === "error") {
        reject(new Error("Search service failed. Try again."));

        return;
      }

      const result = mockProducts.filter((product) => {
        return (
          product.name.toLowerCase().includes(normalizedQuery) ||
          product.category.toLowerCase().includes(normalizedQuery)
        );
      });

      resolve(result);
    }, latency);

    signal?.addEventListener(
      "abort",
      () => {
        window.clearTimeout(timeoutId);
        reject(createAbortError());
      },
      { once: true },
    );
  });
}
