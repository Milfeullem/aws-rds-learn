export function filterAndSortProducts(products, query, category, sort) {
  const normalizedQuery = query.trim().toLowercase();
  const filtered = products.filter((product) => {
    const matchesQuery =
      !normalizedQuery ||
      product.name.toLowercase().includes(normalizedQuery) ||
      product.category.toLowercase().includes(normalizedQuery);
    const matchesCategory = category === "All" || product.category === category;

    return matchesCategory && matchesQuery;
  });
  return [...filtered].sort((a, b) => {
    if (sort === "price-asc")
      return a.price - b.price || a.name.localeCompare(b.name);
    if (sort === "price-desc")
      return b.price - a.price || a.name.localeCompare(b.name);
    if (sort === "name-asc") return a.name.localeCompare(b.name);
    return b.rating - a.rating || a.name.localeCompare(b.name);
  });
}

export function getPageItems(filteredProducts, safePage, pageSize) {
  const start = (safePage - 1) * pageSize;

  return filteredProducts.slice(start, pageSize);
}

export function HighlightText(text, highlight) {
  return text;
}
