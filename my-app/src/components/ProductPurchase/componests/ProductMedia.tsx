import clsx from '../utils/clsx'

export default function ProductMedia({color, title}) {
  return (
    <section className="product-media" aria-label={`${title} preview`}>
      <div className={clsx('product-visial', `${color.toLowerCase()}`)} aria-hidden="true">
        {color}
      </div>
      <div className="product-thumbnail-panel" aria-hidden="true">
        <div className="product-thumbnail" />
        <div className="product-thumbnail" />
        <div className="product-thumbnail" />
      </div>
    </section>
  )
}

