import React, { useState } from 'react';
import { 
  X, 
  Store, 
  Truck, 
  ShieldCheck, 
  Clock, 
  Lock 
} from 'lucide-react';
import { CartItem, FulfillmentType, PaymentMethod, Order } from '../types';
import { formatIDR, createOrder } from '../lib/api';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onOrderCreated: (order: Order, paymentMethod: PaymentMethod) => void;
}

const PICKUP_TIME_SLOTS = [
  'Today: 10:00 - 12:00',
  'Today: 14:00 - 16:00',
  'Today: 17:00 - 19:00',
  'Tomorrow: 09:00 - 11:00',
  'Tomorrow: 14:00 - 16:00',
];

const STANDARD_DELIVERY_FEE = 15000;
const FREE_DELIVERY_THRESHOLD = 150000;

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  onOrderCreated,
}) => {
  const [fulfillmentType, setFulfillmentType] = useState<FulfillmentType>('delivery');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [pickupSlot, setPickupSlot] = useState(PICKUP_TIME_SLOTS[0]);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const paymentMethod: PaymentMethod = 'qris';
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const deliveryFee = fulfillmentType === 'pickup' 
    ? 0 
    : subtotal >= FREE_DELIVERY_THRESHOLD 
      ? 0 
      : STANDARD_DELIVERY_FEE;
  const totalAmount = subtotal + deliveryFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!customerName.trim() || !customerPhone.trim()) {
      setFormError('Please provide your name and phone number for order updates.');
      return;
    }

    if (fulfillmentType === 'delivery' && !deliveryAddress.trim()) {
      setFormError('Please provide your delivery address.');
      return;
    }

    setIsSubmitting(true);
    try {
      const order = await createOrder({
        customer_name: customerName.trim(),
        customer_phone: customerPhone.trim(),
        customer_email: customerEmail.trim() || undefined,
        fulfillment_type: fulfillmentType,
        pickup_time_slot: fulfillmentType === 'pickup' ? pickupSlot : undefined,
        delivery_address: fulfillmentType === 'delivery' ? deliveryAddress.trim() : undefined,
        delivery_notes: deliveryNotes.trim() || undefined,
        items: cartItems.map((item) => ({
          id: item.product.id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          unit: item.product.unit,
          image_url: item.product.image_url,
        })),
        subtotal,
        delivery_fee: deliveryFee,
        total_amount: totalAmount,
        payment_method: paymentMethod,
      });

      onOrderCreated(order, paymentMethod);
      onClose();
    } catch (err: any) {
      setFormError(err.message || 'Failed to submit order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-eden-700 text-white flex items-center justify-center">
              <Lock className="w-4 h-4 text-eden-200" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg text-stone-900 leading-tight">
                Secure Checkout
              </h2>
              <p className="text-[11px] text-stone-500">
                Eden Healthy Market • Instant Midtrans Gateway
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 max-h-[72vh] overflow-y-auto space-y-5 text-left">
          
          {formError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
              {formError}
            </div>
          )}

          {/* Fulfillment Toggle */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
              1. Choose Fulfillment Method
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFulfillmentType('delivery')}
                className={`p-3.5 rounded-2xl border text-left transition flex items-start gap-3 ${
                  fulfillmentType === 'delivery'
                    ? 'border-eden-600 bg-eden-50/50 ring-2 ring-eden-600/20'
                    : 'border-stone-200 hover:border-stone-300 bg-white'
                }`}
              >
                <div className={`p-2 rounded-xl ${fulfillmentType === 'delivery' ? 'bg-eden-700 text-white' : 'bg-stone-100 text-stone-600'}`}>
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-stone-900">Local Fresh Delivery</div>
                  <div className="text-[11px] text-stone-500">Same-day courier to your door</div>
                  <div className="text-[11px] font-semibold text-eden-700 mt-1">
                    {subtotal >= FREE_DELIVERY_THRESHOLD ? 'FREE' : formatIDR(STANDARD_DELIVERY_FEE)}
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFulfillmentType('pickup')}
                className={`p-3.5 rounded-2xl border text-left transition flex items-start gap-3 ${
                  fulfillmentType === 'pickup'
                    ? 'border-eden-600 bg-eden-50/50 ring-2 ring-eden-600/20'
                    : 'border-stone-200 hover:border-stone-300 bg-white'
                }`}
              >
                <div className={`p-2 rounded-xl ${fulfillmentType === 'pickup' ? 'bg-eden-700 text-white' : 'bg-stone-100 text-stone-600'}`}>
                  <Store className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-stone-900">Click & Collect (Pickup)</div>
                  <div className="text-[11px] text-stone-500">Universitas Klabat (UNKLAB)</div>
                  <div className="text-[11px] font-semibold text-emerald-700 mt-1">FREE</div>
                </div>
              </button>
            </div>
          </div>

          {/* Fulfillment Details */}
          {fulfillmentType === 'pickup' ? (
            <div className="p-3.5 bg-oat-50 rounded-2xl border border-oat-200 space-y-2">
              <label className="flex items-center gap-1.5 text-xs font-bold text-stone-800">
                <Clock className="w-3.5 h-3.5 text-eden-700" />
                Select In-Store Pickup Time Window
              </label>
              <select
                value={pickupSlot}
                onChange={(e) => setPickupSlot(e.target.value)}
                className="w-full p-2.5 bg-white border border-stone-300 rounded-xl text-xs font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-eden-500"
              >
                {PICKUP_TIME_SLOTS.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-stone-500">
                Your healthy basket will be packed in eco-friendly paper bags ready for express pickup.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Delivery Address *
                </label>
                <textarea
                  rows={2}
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Street name, house/apartment number, landmark..."
                  className="w-full p-2.5 bg-white border border-stone-300 rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-eden-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Delivery Instructions (Optional)
                </label>
                <input
                  type="text"
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                  placeholder="e.g. Leave at front security, ring bell..."
                  className="w-full p-2.5 bg-white border border-stone-300 rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-eden-500"
                />
              </div>
            </div>
          )}

          {/* Customer Details */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
              2. Contact Information
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Maya Indah"
                  className="w-full p-2.5 bg-white border border-stone-300 rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-eden-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">
                  Phone Number (WhatsApp / SMS) *
                </label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="0812-3456-7890"
                  className="w-full p-2.5 bg-white border border-stone-300 rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-eden-500"
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-stone-600 mb-1">
                  Email Receipt (Optional)
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="maya@example.com"
                  className="w-full p-2.5 bg-white border border-stone-300 rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-eden-500"
                />
              </div>
            </div>
          </div>

          {/* Unified Official Midtrans Snap Gateway Card */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                3. Payment Gateway (Midtrans Snap)
              </label>
              <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#0066AE]" />
                Official Midtrans Snap
              </span>
            </div>

            <div className="p-4 rounded-2xl border-2 border-[#0066AE]/30 bg-gradient-to-br from-sky-50/70 via-white to-sky-50/30 shadow-xs">
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#002B49] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                    M
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm text-[#002B49] tracking-tight">midtrans</span>
                      <span className="text-[10px] bg-[#0066AE] px-1.5 py-0.2 rounded font-bold text-white uppercase tracking-wider">
                        SNAP
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500 font-medium">
                      All-in-One Multi-Payment Gateway
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  ⚡ Real-Time Settlement
                </span>
              </div>

              <div className="text-xs text-stone-600 bg-white/90 p-3 rounded-xl border border-sky-100 mb-3 leading-relaxed">
                Pilihan metode pembayaran lengkap akan langsung Anda pilih pada jendela resmi <strong>Midtrans Snap</strong>:
              </div>

              {/* Supported Payment Logos / Badges */}
              <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-semibold text-stone-700">
                <span className="px-2.5 py-1 bg-white border border-stone-200 rounded-lg shadow-2xs">
                  📱 QRIS (Gojek, Dana, OVO, LinkAja, ShopeePay)
                </span>
                <span className="px-2.5 py-1 bg-white border border-stone-200 rounded-lg shadow-2xs">
                  🏦 Virtual Account (BCA, Mandiri, BNI, BRI, Permata)
                </span>
                <span className="px-2.5 py-1 bg-white border border-stone-200 rounded-lg shadow-2xs">
                  🟢 GoPay
                </span>
                <span className="px-2.5 py-1 bg-white border border-stone-200 rounded-lg shadow-2xs">
                  🟠 ShopeePay
                </span>
                <span className="px-2.5 py-1 bg-white border border-stone-200 rounded-lg shadow-2xs">
                  💳 Kartu Kredit / Debit (Visa, Mastercard, JCB)
                </span>
              </div>
            </div>
          </div>

          {/* Pricing Breakdown */}
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2 text-xs">
            <div className="flex justify-between text-stone-600">
              <span>Items Subtotal ({cartItems.reduce((acc, i) => acc + i.quantity, 0)} items)</span>
              <span className="font-semibold text-stone-800">{formatIDR(subtotal)}</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Fulfillment ({fulfillmentType === 'pickup' ? 'Store Pickup' : 'Courier Delivery'})</span>
              <span className="font-semibold text-stone-800">
                {deliveryFee === 0 ? <strong className="text-emerald-700">FREE</strong> : formatIDR(deliveryFee)}
              </span>
            </div>
            <div className="pt-2 border-t border-stone-200 flex justify-between items-center text-sm">
              <span className="font-bold text-stone-900">Total Due</span>
              <span className="font-serif font-bold text-lg text-eden-800">{formatIDR(totalAmount)}</span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-6 bg-eden-700 hover:bg-eden-800 text-white font-bold text-sm rounded-xl shadow-md shadow-eden-900/10 flex items-center justify-center gap-2 transition active:scale-98 disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Preparing Midtrans Payment...</span>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 text-eden-200" />
                <span>Pay {formatIDR(totalAmount)} with Midtrans Snap</span>
              </>
            )}
          </button>

          <p className="text-[10px] text-center text-stone-400">
            🔒 Encrypted 256-bit connection. Integrated with Midtrans Payment Simulation.
          </p>

        </form>
      </div>
    </div>
  );
};
