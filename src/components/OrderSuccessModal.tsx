import React from 'react';
import { 
  CheckCircle2, 
  Store, 
  Truck, 
  Printer, 
  ArrowRight, 
  MapPin, 
  Clock, 
  ShieldCheck
} from 'lucide-react';
import { Order } from '../types';
import { formatIDR } from '../lib/api';

interface OrderSuccessModalProps {
  isOpen: boolean;
  order: Order | null;
  onClose: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  isOpen,
  order,
  onClose,
}) => {
  if (!isOpen || !order) return null;

  const isPickup = order.fulfillment_type === 'pickup';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Success Header */}
        <div className="bg-gradient-to-r from-eden-800 via-eden-700 to-emerald-700 text-white p-6 sm:p-7 text-center relative">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-xs rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
            <CheckCircle2 className="w-10 h-10 text-emerald-200" />
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl font-bold mb-1">
            Order Confirmed & Paid!
          </h2>
          <p className="text-xs text-eden-100 max-w-sm mx-auto">
            Payment verified by Midtrans Snap. Your fresh items are being carefully packed at Eden Healthy Market.
          </p>

          <div className="mt-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/20 text-white font-mono text-xs font-bold border border-white/20">
            <span>Order #{order.order_number}</span>
          </div>
        </div>

        {/* Fulfillment Card */}
        <div className="p-5 sm:p-6 max-h-[60vh] overflow-y-auto space-y-4 text-left">
          
          <div className="p-4 rounded-2xl border border-eden-200 bg-eden-50/50 flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-eden-700 text-white shrink-0 mt-0.5">
              {isPickup ? <Store className="w-5 h-5" /> : <Truck className="w-5 h-5" />}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                  {isPickup ? 'Store Click & Collect Pickup' : 'Fresh Courier Delivery'}
                </h4>
                <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Status: Preparing
                </span>
              </div>

              {isPickup ? (
                <div className="mt-1 space-y-1 text-xs text-stone-600">
                  <div className="flex items-center gap-1 text-stone-800 font-semibold">
                    <Clock className="w-3.5 h-3.5 text-eden-700" />
                    Pickup Window: {order.pickup_time_slot || 'Today, 14:00 - 16:00'}
                  </div>
                  <div className="flex items-center gap-1 text-stone-600">
                    <MapPin className="w-3.5 h-3.5 text-stone-400" />
                    Eden Healthy Market, Universitas Klabat (UNKLAB), Jl. Arnold Mononutu, Airmadidi
                  </div>
                  <p className="text-[11px] text-stone-500 pt-1">
                    Show this receipt or mention your order number <strong>{order.order_number}</strong> at the collection counter.
                  </p>
                </div>
              ) : (
                <div className="mt-1 space-y-1 text-xs text-stone-600">
                  <div className="text-stone-800 font-semibold">
                    Delivery Address: {order.delivery_address}
                  </div>
                  {order.delivery_notes && (
                    <div className="text-stone-500">
                      Notes: {order.delivery_notes}
                    </div>
                  )}
                  <div className="text-emerald-700 font-medium pt-1 text-[11px]">
                    ⚡ Estimated arrival within 2-3 hours today.
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* QR Code for Store Pickup / Verification */}
          {isPickup && (
            <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-center flex flex-col items-center">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${order.order_number}`}
                alt="Pickup QR Code"
                className="w-24 h-24 object-contain rounded-lg border border-stone-200 mb-1"
              />
              <span className="text-[10px] text-stone-400 font-mono">Scan at Store Counter</span>
            </div>
          )}

          {/* Itemized Receipt */}
          <div className="border border-stone-200 rounded-2xl p-4 bg-white space-y-3">
            <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
              Ordered Items
            </h4>
            <div className="divide-y divide-stone-100 text-xs">
              {order.items.map((item) => (
                <div key={item.id} className="py-2 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-8 h-8 rounded-lg object-cover border border-stone-200"
                    />
                    <div>
                      <div className="font-semibold text-stone-900">{item.name}</div>
                      <div className="text-[10px] text-stone-500">
                        {item.quantity}x {item.unit} @ {formatIDR(item.price)}
                      </div>
                    </div>
                  </div>
                  <div className="font-bold text-stone-800">
                    {formatIDR(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="pt-3 border-t border-stone-200 space-y-1 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal</span>
                <span>{formatIDR(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Delivery Fee</span>
                <span>{order.delivery_fee === 0 ? 'FREE' : formatIDR(order.delivery_fee)}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Payment Method</span>
                <span className="font-semibold uppercase text-stone-800 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-eden-700" />
                  Midtrans ({order.payment_method})
                </span>
              </div>
              <div className="pt-2 border-t border-stone-200 flex justify-between font-bold text-stone-900 text-sm">
                <span>Total Paid</span>
                <span className="font-serif text-eden-800 text-base">{formatIDR(order.total_amount)}</span>
              </div>
            </div>
          </div>

          <div className="text-center text-xs text-stone-500">
            A confirmation has been recorded for <strong className="text-stone-800">{order.customer_name}</strong> ({order.customer_phone}).
          </div>

        </div>

        {/* Modal Actions */}
        <div className="p-4 sm:p-5 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-3">
          <button
            onClick={handlePrint}
            className="px-4 py-2.5 border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition"
          >
            <Printer className="w-4 h-4 text-stone-500" />
            <span>Print Receipt</span>
          </button>

          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-5 bg-eden-700 hover:bg-eden-800 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center justify-center gap-1.5"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
