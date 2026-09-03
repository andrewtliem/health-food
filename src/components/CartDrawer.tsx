import React from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, Truck } from 'lucide-react';
import { CartItem } from '../types';
import { formatIDR } from '../lib/api';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, newQty: number) => void;
  onRemoveItem: (productId: string) => void;
  onProceedToCheckout: () => void;
}

const FREE_DELIVERY_THRESHOLD = 150000;

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
}) => {
  if (!isOpen) return null;

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const amountNeededForFreeDelivery = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);
  const freeDeliveryProgress = Math.min(100, (subtotal / FREE_DELIVERY_THRESHOLD) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-900/50 backdrop-blur-xs flex justify-end">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-eden-700" />
            <h2 className="font-serif font-bold text-lg text-stone-900">
              Your Wholesome Basket
            </h2>
            <span className="text-xs bg-eden-100 text-eden-800 font-semibold px-2 py-0.5 rounded-full">
              {cartItems.reduce((acc, i) => acc + i.quantity, 0)} items
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Delivery Bar */}
        <div className="bg-oat-50 px-4 py-3 border-b border-oat-200">
          <div className="flex items-center justify-between text-xs font-medium text-stone-700 mb-1.5">
            <span className="flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-eden-600" />
              {amountNeededForFreeDelivery === 0 ? (
                <strong className="text-emerald-700">You unlocked FREE local delivery!</strong>
              ) : (
                <span>Add <strong>{formatIDR(amountNeededForFreeDelivery)}</strong> more for FREE delivery</span>
              )}
            </span>
            <span className="text-[11px] text-stone-400 font-bold">{Math.round(freeDeliveryProgress)}%</span>
          </div>
          <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${freeDeliveryProgress}%` }}
            />
          </div>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-stone-400 p-6">
              <ShoppingBag className="w-12 h-12 stroke-[1.5] mb-3 text-stone-300" />
              <p className="font-serif font-semibold text-base text-stone-700 mb-1">
                Your basket is empty
              </p>
              <p className="text-xs text-stone-400 max-w-xs mb-4">
                Explore our wholesome grains, plant milks, and farm produce to start your healthy order.
              </p>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-eden-700 hover:bg-eden-800 text-white text-xs font-semibold rounded-full shadow-xs transition"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            cartItems.map(({ product, quantity }) => (
              <div
                key={product.id}
                className="flex items-center gap-3.5 p-3 rounded-2xl border border-stone-100 bg-stone-50/50 hover:bg-stone-50 transition"
              >
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-16 h-16 rounded-xl object-cover border border-stone-200 shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-stone-900 truncate">
                    {product.name}
                  </h4>
                  <div className="text-[11px] text-stone-500 mb-1">
                    {formatIDR(product.price)} • {product.unit}
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center border border-stone-200 rounded-lg bg-white overflow-hidden shadow-2xs">
                      <button
                        onClick={() => onUpdateQuantity(product.id, quantity - 1)}
                        className="p-1 hover:bg-stone-100 text-stone-600 transition"
                        aria-label="Decrease"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2.5 text-xs font-bold text-stone-800">
                        {quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(product.id, Math.min(product.stock_quantity, quantity + 1))}
                        disabled={quantity >= product.stock_quantity}
                        className="p-1 hover:bg-stone-100 text-stone-600 disabled:opacity-30 transition"
                        aria-label="Increase"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => onRemoveItem(product.id)}
                      className="text-stone-400 hover:text-red-500 p-1 transition"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xs font-bold text-stone-900">
                    {formatIDR(product.price * quantity)}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer Checkout */}
        {cartItems.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-stone-200 bg-stone-50/80 space-y-3">
            <div className="flex items-center justify-between text-xs text-stone-600">
              <span>Subtotal</span>
              <span className="font-bold text-stone-900">{formatIDR(subtotal)}</span>
            </div>

            <div className="flex items-center justify-between text-xs text-stone-600">
              <span>Estimated Delivery</span>
              <span className="font-medium text-stone-900">
                {subtotal >= FREE_DELIVERY_THRESHOLD ? (
                  <strong className="text-emerald-700">FREE</strong>
                ) : (
                  'Calculated at checkout'
                )}
              </span>
            </div>

            <div className="pt-2 border-t border-stone-200 flex items-center justify-between">
              <div>
                <div className="text-[11px] text-stone-500 font-medium">Estimated Total</div>
                <div className="text-lg font-serif font-bold text-eden-800">
                  {formatIDR(subtotal)}
                </div>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onProceedToCheckout();
                }}
                className="py-3 px-6 bg-eden-700 hover:bg-eden-800 text-white font-semibold text-xs rounded-xl shadow-md flex items-center gap-2 transition active:scale-95"
              >
                <span>Direct Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
