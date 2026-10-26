import { useState, useMemo, useEffect } from "react";
import "./styles.css";

import ProductToolbar from './components/ProductToolbar'
import MetricsBar from './components/MetricsBar'
import ProductGrid from './components/ProductGrid'
import Pagination from './components/Pagination'
import {filterAndSortProducts, getPageItems} from './utils'

export const sortOptions = [
  { value: "rating-desc", label: "Top rated" },
  { value: "price-asc", label: "Price low to high" },
  { value: "price-desc", label: "Price high to low" },
  { value: "name-asc", label: "Name A-Z" },
];

export const pageSize = 24;

const categories = ["All", "Shoes", "Bags", "Apparel", "Accessories", "Home"];
const products = Array.from({ length: 360 }, (_, index) => {
  const category = categories[(index % (categories.length - 1)) + 1];
  return {
    id: "p-" + (index + 1),
    name: category + " Essential " + (index + 1),
    category,
    price: 24 + ((index * 17) % 220),
    rating: 3 + ((index * 7) % 20) / 10,
    inventory: 2 + ((index * 13) % 80),
  };
});

export default function App() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("rating-desc");
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1)
  }, [query, category, sort])

  const filteredProducts = useMemo(() => {
    return filterAndSortProducts(products, query, category, sort)
  }, [query, category, sort])

  const totalPage = Math.max(1, Math.ceil(filteredProducts.length / pageSize))
  const safePage = Math.min(page, totalPage)
  const pageItems = useMemo(() => {
    return getPageItems(filteredProducts, safePage, pageSize)
  }, [safePage, filteredProducts])

  const onQueryChange = (nextQuery) => {
    setQuery(nextQuery)
  }


  return (
    <main className="app">
      <section className="hero" aria-labelledby="grid-title">
        <p className="eyebrow">Premium React Case</p>
        <h1 id="grid-title">Merchandising Product Grid</h1>
        <p>
          Build the toolbar, metrics, responsive product grid, empty state, and
          pagination from {products.length} mock products.
        </p>
      </section>
      <section className="placeholder-card">
        <ProductToolbar query={query} onQueryChange={onQueryChange} category={category} categoryOptions={categories} onCategoryChange={setCategory} sort={sort} sortOptions={sortOptions} onSortChange={setSort} />
        <MetricsBar total={products.length} Matching={filteredProducts.length} page={safePage} totalPages={totalPage} />
        <ProductGrid products={pageItems} />
        <Pagination page={safePage} totalPage={totalPage} onChange={setPage} />
      </section>
    </main>
  );
}