import React from 'react';
import { Plus, Eye, AlertCircle, CheckCircle2, Sparkles } from 'lucide-react';
import { Product } from '../types';
import { formatIDR } from '../lib/api';

interface ProductCardProps {
  product: Product;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  cartQuantity: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelectProduct,
  onAddToCart,
  cartQuantity,
}) => {
  const isOutOfStock = product.stock_quantity <= 0;
  const isLowStock = product.stock_quantity > 0 && product.stock_quantity <= 5;

  return (
    <div className="group bg-white rounded-2xl border border-stone-200/90 hover:border-eden-300 hover:shadow-md transition-all flex flex-col overflow-hidden relative">
      
      {/* Product Image Box with Overlays */}
      <div className="relative aspect-4/3 overflow-hidden bg-stone-100 cursor-pointer" onClick={() => onSelectProduct(product)}>
        <img
          src={product.image_url}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Featured / Bundle Badge */}
        {product.is_bundle ? (
          <span className="absolute top-2.5 left-2.5 bg-amber-500 text-stone-900 text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Bundle Save 15%
          </span>
        ) : product.is_featured ? (
          <span className="absolute top-2.5 left-2.5 bg-eden-800/90 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs backdrop-blur-xs">
            Bestseller
          </span>
        ) : null}

        {/* Quick View Hover Trigger */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelectProduct(product);
          }}
          className="absolute inset-0 bg-stone-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold gap-1.5"
        >
          <span className="bg-white/95 text-stone-900 px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5 hover:bg-white">
            <Eye className="w-3.5 h-3.5 text-eden-700" />
            Nutrition & Details
          </span>
        </button>

        {/* Live Stock Availability Badge */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
          {isOutOfStock ? (
            <span className="bg-stone-900/85 backdrop-blur-xs text-white text-[11px] font-medium px-2 py-0.5 rounded-md flex items-center gap-1">
              <AlertCircle className="w-3 h-3 text-red-400" />
              Out of Stock
            </span>
          ) : isLowStock ? (
            <span className="bg-amber-600/90 backdrop-blur-xs text-white text-[11px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs animate-pulse">
              <AlertCircle className="w-3 h-3 text-amber-200" />
              Only {product.stock_quantity} left in store!
            </span>
          ) : (
            <span className="bg-white/90 backdrop-blur-xs text-emerald-800 text-[11px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs border border-emerald-200/60">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              In Stock ({product.stock_quantity})
            </span>
          )}
        </div>
      </div>

      {/* Product Content Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Dietary Badges */}
          <div className="flex flex-wrap gap-1 mb-2">
            {product.dietary_tags?.slice(0, 3).map((tag) => (
              <span
                key={tag.id}
                className={`text-[10px] font-medium px-1.5 py-0.2 rounded border ${tag.badge_color}`}
              >
                {tag.name}
              </span>
            ))}
            {(product.dietary_tags?.length || 0) > 3 && (
              <span className="text-[10px] font-medium text-stone-400 px-1">
                +{(product.dietary_tags?.length || 0) - 3}
              </span>
            )}
          </div>

          {/* Title */}
          <h3
            onClick={() => onSelectProduct(product)}
            className="font-serif font-bold text-stone-900 text-base line-clamp-1 hover:text-eden-700 cursor-pointer transition mb-1"
          >
            {product.name}
          </h3>

          {/* Origin Note */}
          <p className="text-[11px] text-stone-500 mb-2 truncate">
            Origin: <span className="text-stone-700">{product.origin}</span>
          </p>

          {/* Description snippet */}
          <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed mb-3">
            {product.description}
          </p>
        </div>

        {/* Pricing & Add to Basket Footer */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
          <div>
            <div className="text-stone-900 font-bold text-base leading-tight">
              {formatIDR(product.price)}
            </div>
            <div className="text-[11px] text-stone-400 font-medium">
              per {product.unit}
            </div>
          </div>

          <button
            onClick={() => onAddToCart(product)}
            disabled={isOutOfStock}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition active:scale-95 shadow-xs ${
              isOutOfStock
                ? 'bg-stone-100 text-stone-400 cursor-not-allowed border border-stone-200'
                : 'bg-eden-700 hover:bg-eden-800 text-white shadow-eden-900/10'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{cartQuantity > 0 ? `In Basket (${cartQuantity})` : 'Add to Basket'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
