import React from 'react';
import { Product, CartItem } from '../types';
import { ProductCard } from './ProductCard';
import { Sparkles, RefreshCw } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  cartItems: CartItem[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onResetFilters: () => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  cartItems,
  onSelectProduct,
  onAddToCart,
  onResetFilters,
}) => {
  const getCartQuantity = (productId: string): number => {
    const found = cartItems.find((item) => item.product.id === productId);
    return found ? found.quantity : 0;
  };

  if (products.length === 0) {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center">
        <div className="w-16 h-16 bg-oat-100 text-stone-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-8 h-8 text-stone-400" />
        </div>
        <h3 className="font-serif text-lg font-bold text-stone-900 mb-1">
          No matching wholesome items found
        </h3>
        <p className="text-xs text-stone-500 mb-5 leading-relaxed">
          Try adjusting your dietary filter, category tab, or check if the item is currently out of stock.
        </p>
        <button
          onClick={onResetFilters}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-eden-700 hover:bg-eden-800 text-white text-xs font-semibold rounded-full shadow-xs transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Reset All Filters
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onSelectProduct={onSelectProduct}
            onAddToCart={onAddToCart}
            cartQuantity={getCartQuantity(product.id)}
          />
        ))}
      </div>
    </div>
  );
};
