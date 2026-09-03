import React from 'react';
import { ShoppingBag, Search, Sparkles, BookOpen, Leaf, Clock, MapPin } from 'lucide-react';
import { CartItem } from '../types';

interface NavbarProps {
  cartItems: CartItem[];
  onOpenCart: () => void;
  onOpenStrategy: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartItems,
  onOpenCart,
  onOpenStrategy,
  searchQuery,
  onSearchChange,
}) => {
  const totalItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-oat-200 transition-all">
      {/* Top Banner: Store Info & Value Props */}
      <div className="bg-eden-900 text-eden-50 px-4 py-1.5 text-xs font-medium">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Leaf className="w-3.5 h-3.5 text-eden-300" />
              100% Vegetarian & Plant-Based
            </span>
            <span className="hidden md:inline text-eden-400">•</span>
            <span className="hidden md:flex items-center gap-1 text-eden-200">
              <MapPin className="w-3.5 h-3.5 text-eden-400" />
              Universitas Klabat, Jl. Arnold Mononutu
            </span>
            <span className="hidden lg:inline text-eden-400">•</span>
            <span className="hidden lg:flex items-center gap-1 text-eden-200">
              <Clock className="w-3.5 h-3.5 text-eden-400" />
              Store Open: 08:00 - 20:00 Daily
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="bg-eden-800/80 text-amber-200 px-2 py-0.5 rounded text-[11px] font-semibold tracking-wide">
              🚚 Free Local Delivery on Rp 150.000+
            </span>
            <button
              onClick={onOpenStrategy}
              className="inline-flex items-center gap-1 text-eden-100 hover:text-white underline underline-offset-2 hover:no-underline transition text-[11px]"
            >
              <BookOpen className="w-3 h-3" />
              E-Business Strategy Blueprint
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 py-3 flex items-center justify-between gap-4">
        {/* Brand Lockup */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-eden-700 flex items-center justify-center text-white shadow-sm shadow-eden-800/20">
            <Leaf className="w-6 h-6 text-eden-200" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-eden-950">
                Eden
              </span>
              <span className="text-xs font-bold uppercase tracking-wider px-1.5 py-0.5 bg-eden-100 text-eden-800 rounded">
                Healthy Market
              </span>
            </div>
            <p className="text-[11px] text-stone-500 font-medium hidden sm:block">
              Wholesome Pantry • Clean Nutrition • Farm Fresh
            </p>
          </div>
        </div>

        {/* Real-Time Search Bar */}
        <div className="flex-1 max-w-md mx-2 hidden sm:block">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search oats, almond milk, granola, tempeh..."
              className="w-full pl-10 pr-4 py-2 bg-oat-50 border border-oat-200 rounded-full text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-eden-500 focus:bg-white transition"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600 bg-stone-100 rounded-full w-4 h-4 flex items-center justify-center"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenStrategy}
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 bg-oat-100 hover:bg-oat-200 text-stone-700 text-xs font-semibold rounded-lg border border-oat-200 transition"
            title="View E-Business Strategy & CX Architecture"
          >
            <Sparkles className="w-3.5 h-3.5 text-eden-600" />
            Strategy & CX
          </button>

          <button
            onClick={onOpenCart}
            className="relative flex items-center gap-2 bg-eden-700 hover:bg-eden-800 text-white px-4 py-2.5 rounded-full font-medium text-sm shadow-sm transition active:scale-95"
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Basket</span>
            {totalItemCount > 0 && (
              <span className="flex items-center justify-center w-5 h-5 text-xs font-bold bg-amber-400 text-stone-900 rounded-full shadow">
                {totalItemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Search Input */}
      <div className="sm:hidden px-4 pb-3">
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search healthy products & ingredients..."
            className="w-full pl-10 pr-4 py-2 bg-oat-50 border border-oat-200 rounded-full text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-eden-500"
          />
        </div>
      </div>
    </header>
  );
};
