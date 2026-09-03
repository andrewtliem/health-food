import React, { useState, useEffect } from 'react';
import { 
  X, 
  Plus, 
  Minus, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  MapPin, 
  FileText, 
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import { Product } from '../types';
import { formatIDR } from '../lib/api';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  const [quantity, setQuantity] = useState(1);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!product) return null;

  const isOutOfStock = product.stock_quantity <= 0;
  const isLowStock = product.stock_quantity > 0 && product.stock_quantity <= 5;

  const handleAdd = () => {
    onAddToCart(product, quantity);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 cursor-pointer"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-200 cursor-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header Bar with Close */}
        <div className="relative aspect-16/9 sm:aspect-21/9 overflow-hidden bg-stone-100">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 bg-stone-900/70 hover:bg-stone-900 text-white w-9 h-9 rounded-full flex items-center justify-center shadow-lg transition active:scale-90 z-20 cursor-pointer"
            aria-label="Close details"
            title="Tutup (Esc)"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Floating Stock Badge */}
          <div className="absolute bottom-3 left-3">
            {isOutOfStock ? (
              <span className="bg-stone-900/90 text-white text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow">
                <AlertCircle className="w-3.5 h-3.5 text-red-400" />
                Currently Out of Stock
              </span>
            ) : isLowStock ? (
              <span className="bg-amber-600 text-white text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow animate-pulse">
                <AlertCircle className="w-3.5 h-3.5 text-amber-200" />
                Store Alert: Only {product.stock_quantity} units available
              </span>
            ) : (
              <span className="bg-emerald-700 text-white text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-200" />
                Live In-Store Stock: {product.stock_quantity} units
              </span>
            )}
          </div>
        </div>

        {/* Modal Body Content */}
        <div className="p-5 sm:p-7 max-h-[70vh] overflow-y-auto space-y-5">
          
          {/* Title & Dietary Tags */}
          <div>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {product.dietary_tags?.map((tag) => (
                <span
                  key={tag.id}
                  className={`text-xs font-medium px-2 py-0.5 rounded-md border ${tag.badge_color}`}
                >
                  {tag.name}
                </span>
              ))}
            </div>

            <h2 className="font-serif text-2xl font-bold text-stone-900 mb-1">
              {product.name}
            </h2>

            <div className="flex items-center gap-2 text-xs text-stone-500">
              <MapPin className="w-3.5 h-3.5 text-eden-600" />
              <span>Grown & Crafted by: <strong className="text-stone-700">{product.origin}</strong></span>
            </div>
          </div>

          {/* Price & Unit */}
          <div className="p-3.5 bg-oat-50 rounded-2xl border border-oat-200 flex items-center justify-between">
            <div>
              <span className="text-xs text-stone-500 font-medium">Price per {product.unit}</span>
              <div className="text-2xl font-serif font-bold text-eden-800">
                {formatIDR(product.price)}
              </div>
            </div>
            <div className="text-right">
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-md">
                100% Guaranteed Fresh
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              Product Overview
            </h4>
            <p className="text-sm text-stone-700 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Deep Transparency: Ingredients */}
          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200/80">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800 mb-1.5">
              🌱 Verified Ingredients
            </h4>
            <p className="text-xs text-stone-600 leading-relaxed font-mono">
              {product.ingredients}
            </p>
          </div>

          {/* Allergen & Dietary Warnings */}
          {product.allergens && (
            <div className="bg-amber-50/70 p-3.5 rounded-xl border border-amber-200/80 text-xs text-amber-900 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold block mb-0.5">Allergen Information:</strong>
                <span>{product.allergens}</span>
              </div>
            </div>
          )}

          {/* Nutritional Highlights */}
          {product.nutritional_highlights && (
            <div className="bg-eden-50/70 p-3.5 rounded-xl border border-eden-200/80 text-xs text-eden-950 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-eden-700 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold block mb-0.5">Nutritional & Health Highlights:</strong>
                <span>{product.nutritional_highlights}</span>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 sm:p-5 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-4">
          {/* Quantity Selector */}
          <div className="flex items-center border border-stone-300 rounded-xl bg-white overflow-hidden shadow-2xs">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1 || isOutOfStock}
              className="p-2.5 hover:bg-stone-100 text-stone-600 disabled:opacity-30 disabled:cursor-not-allowed transition"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="px-4 text-sm font-bold text-stone-800 select-none">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
              disabled={quantity >= product.stock_quantity || isOutOfStock}
              className="p-2.5 hover:bg-stone-100 text-stone-600 disabled:opacity-30 disabled:cursor-not-allowed transition"
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-3 border border-stone-300 hover:bg-stone-200/80 text-stone-700 font-semibold text-xs rounded-xl transition active:scale-95"
          >
            Tutup
          </button>

          {/* Add to Basket CTA */}
          <button
            onClick={handleAdd}
            disabled={isOutOfStock}
            className={`flex-1 py-3 px-6 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition active:scale-95 ${
              isOutOfStock
                ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                : 'bg-eden-700 hover:bg-eden-800 text-white shadow-eden-800/20'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>
              {isOutOfStock
                ? 'Unavailable'
                : `Add to Basket • ${formatIDR(product.price * quantity)}`}
            </span>
          </button>
        </div>

      </div>
    </div>
  );
};
