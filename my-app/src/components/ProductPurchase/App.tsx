import { useState, useMemo } from "react";
import "./styles.css";

import ProductMedia from './componests/ProductMedia'
import ProductHeader from './componests/ProductHeader'
import OptionGroup from "./componests/OptionGroup";
import QuantitySelector from "./componests/QuantitySelector";
import PurchaseSummary from "./componests/PurchaseSummary";

const product = {
  id: "voyager-hoodie",
  title: "Voyager Hoodie",
  subtitle: "Midweight fleece built for travel days, office AC, and late-night debugging.",
  basePrice: 76,
  rating: 4.8,
  reviewCount: 128,
  badges: ["Free returns", "Ships in 24h", "Low-stock variants"],
  colors: [
    { name: "Forest", value: "#2f6f4e" },
    { name: "Ink", value: "#1f2937" },
    { name: "Clay", value: "#b76745" },
  ],
  sizes: ["XS", "S", "M", "L", "XL"],
  variants: [
    { id: "forest-xs", color: "Forest", size: "XS", price: 76, stock: 0 },
    { id: "forest-s", color: "Forest", size: "S", price: 76, stock: 4 },
    { id: "forest-m", color: "Forest", size: "M", price: 76, stock: 2 },
    { id: "forest-l", color: "Forest", size: "L", price: 76, stock: 0 },
    { id: "forest-xl", color: "Forest", size: "XL", price: 82, stock: 1 },
    { id: "ink-xs", color: "Ink", size: "XS", price: 76, stock: 3 },
    { id: "ink-s", color: "Ink", size: "S", price: 76, stock: 0 },
    { id: "ink-m", color: "Ink", size: "M", price: 76, stock: 5 },
    { id: "ink-l", color: "Ink", size: "L", price: 76, stock: 3 },
    { id: "ink-xl", color: "Ink", size: "XL", price: 82, stock: 0 },
    { id: "clay-xs", color: "Clay", size: "XS", price: 74, stock: 1 },
    { id: "clay-s", color: "Clay", size: "S", price: 74, stock: 2 },
    { id: "clay-m", color: "Clay", size: "M", price: 74, stock: 0 },
    { id: "clay-l", color: "Clay", size: "L", price: 74, stock: 4 },
    { id: "clay-xl", color: "Clay", size: "XL", price: 80, stock: 2 },
  ],
};

function findVariant(product, selectedColor, selectedSize) {
  return product.variants.find(({color, size}) => color === selectedColor && size === selectedSize)
}

function getColorStocks(product, color) {
  return product.variants.filter((variant) => variant.color === color).reduce((curr, {stock}) => {
    return curr + stock
  }, 0)
}



export default function App() {
  const [selectedColor, setSelectedColor] = useState(product.colors[0].name);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [cartPayload, setCartPayload] = useState(null)

  const selectedVariant = useMemo(() => {
    return findVariant(product, selectedColor, selectedSize)
  }, [selectedColor, selectedSize])
  
  const colorOptions = useMemo(() => {
    return product.colors.map((color) => {
      const stocks = getColorStocks(product, color.name)

      return {
        label: color.name,
        value: color.name,
        swatch: color.value,
        disabled: stocks === 0,
        meta: stocks === 0 ? "Out" : `${stocks} left`
      }
    })
  }, [])

  const availableSizes = new Set(product.variants.filter(({color, stock}) => color === selectedColor && stock > 0).map(({size}) => size))

  const sizeOptions = useMemo(() => {
    return product.sizes.map((size) => {
      return {
        label: size,
        value: size,
        disabled: availableSizes.has(size),
        meta: availableSizes.has(size) ? "Available" : "UnAvailable"
      }
    })
  }, [])
  
  const onSelectColor = (color) => {
    setSelectedColor(color)
    setCartPayload(null)
    
    const availableSizes = new Set(product.variants.filter(({color: varColor, stock}) => varColor === color && stock > 0).map(({size}) => size))

    if (!selectedSize || availableSizes.has(selectedSize)) {
      setSelectedSize(null)
      setQuantity(1)

      return
    }

    const nextVariant = findVariant(product, color, selectedSize)

    setQuantity(current => Math.min(current, nextVariant?.stock ?? 1))
  }

  const onSelectSize = (size) => {
    if (!availableSizes.has(size)) {
      return
    }

    const nextVariant = findVariant(product, selectedColor, size)

    setSelectedSize(size)
    setCartPayload(null)
    setQuantity(current => Math.min(current, nextVariant?.stock ?? 1))
  }

  const onQuantityChange = (nextQuantity) => {
    setQuantity(nextQuantity)
    setCartPayload(null)
  }

  const canAddToCart = selectedVariant && selectedVariant.stock > 0 && quantity <= selectedVariant.stock

  const addToCart = () => {
    if (canAddToCart) {
      setCartPayload({
        productId: product.id,
        variant: selectedVariant.id,
        color: selectedVariant.color,
        size: selectedVariant.size,
        quantity,
        unitPrice: selectedVariant.price,
      })
    }
  }


  return (
    <main className="app">
      <section className="product-shell" aria-labelledby="product-title">
        <ProductMedia color={selectedColor} title={product.title} />

        <section className="placeholder-card" aria-label="Product purchase options">
          <ProductHeader title={product.title} subtitle={product.subtitle} price={selectedVariant?.price ?? product.basePrice} rating={product.rating} reviewCount={product.reviewCount} badges={product.badges} />
          <OptionGroup legend="Color" options={colorOptions} selectedValue={selectedColor} onChange={onSelectColor} />
          <OptionGroup legend="Size" options={sizeOptions} selectedValue={selectedSize} onChange={onSelectSize} />
          <QuantitySelector quantity={quantity} max={selectedVariant?.stock ?? 1} disabled={!selectedVariant} onChange={onQuantityChange} />

          <p className="status" role="status">{}</p>

          <button className="add-button" disabled={false} onClick={addToCart}>Add to cart</button>

          <PurchaseSummary color={} size={} quantity={} unitPrice={} basePrice={} cartPayload={} />
        </section>
      </section>
    </main>
  );
}