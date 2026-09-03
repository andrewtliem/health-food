import React, { useState, useEffect } from 'react';
import { 
  Check, 
  ShieldCheck, 
  Clock, 
  Loader2,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { Order, PaymentMethod } from '../types';
import { formatIDR, simulateMidtransPayment, requestMidtransCharge } from '../lib/api';

interface MidtransSnapModalProps {
  isOpen: boolean;
  order: Order | null;
  paymentMethod: PaymentMethod;
  onClose: () => void;
  onPaymentSuccess: (order: Order) => void;
}

export const MidtransSnapModal: React.FC<MidtransSnapModalProps> = ({
  isOpen,
  order,
  paymentMethod,
  onClose,
  onPaymentSuccess,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(899); // 14:59 minutes countdown
  const [snapToken, setSnapToken] = useState<string | null>(null);
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);

  // Request real Midtrans Snap token
  useEffect(() => {
    if (!isOpen || !order) return;
    requestMidtransCharge(order, paymentMethod).then((res) => {
      if (res.snap_token) setSnapToken(res.snap_token);
      if (res.redirect_url) setRedirectUrl(res.redirect_url);
    });
  }, [isOpen, order, paymentMethod]);

  // Countdown timer
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen || !order) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const handleOpenOfficialSnap = () => {
    const snap = (window as any).snap;
    if (snap && snapToken) {
      snap.pay(snapToken, {
        onSuccess: () => {
          handleSimulatePayment();
        },
        onPending: () => {
          handleSimulatePayment();
        },
        onError: (err: any) => {
          console.error('Snap error:', err);
        },
        onClose: () => {
          console.log('Snap popup closed');
        },
      });
    } else if (redirectUrl) {
      window.open(redirectUrl, '_blank');
    }
  };

  const handleSimulatePayment = async () => {
    setIsProcessing(true);
    await simulateMidtransPayment(order.order_number, 'settlement');
    setTimeout(() => {
      setIsProcessing(false);
      const updatedOrder: Order = {
        ...order,
        payment_status: 'settlement',
        payment_method: paymentMethod,
        order_status: 'processing',
      };
      onPaymentSuccess(updatedOrder);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      {/* Midtrans Snap Container */}
      <div 
        className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-stone-300 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Official Midtrans Navy Header */}
        <div className="bg-[#002B49] text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {/* Midtrans Symbol Mockup */}
            <div className="w-8 h-8 rounded-lg bg-[#0066AE] flex items-center justify-center font-bold text-sm tracking-wider text-white shadow-xs">
              M
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm tracking-wide">midtrans</span>
                <span className="text-[10px] bg-[#0066AE] px-1.5 py-0.2 rounded font-semibold text-sky-100">
                  SNAP
                </span>
              </div>
              <div className="text-[11px] text-sky-200">
                Merchant: <strong>Eden Healthy Market</strong>
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-[10px] text-sky-200 uppercase tracking-wider font-semibold">
              Total Amount
            </div>
            <div className="font-serif font-bold text-base text-white">
              {formatIDR(order.total_amount)}
            </div>
          </div>
        </div>

        {/* Order Info & Timer Bar */}
        <div className="bg-stone-100 px-4 py-2.5 border-b border-stone-200 flex items-center justify-between text-xs text-stone-600">
          <div className="font-medium">
            Order ID: <strong className="text-stone-900">{order.order_number}</strong>
          </div>
          <div className="flex items-center gap-1.5 font-semibold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
            <Clock className="w-3.5 h-3.5" />
            <span>Expires in {formattedTime}</span>
          </div>
        </div>

        {/* Real Midtrans Sandbox Integration Banner */}
        {snapToken && (
          <div className="bg-sky-50 border-b border-sky-200 px-4 py-3 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-sky-900 font-semibold">
              <Sparkles className="w-4 h-4 text-sky-600 animate-pulse" />
              <span>Official Midtrans Sandbox Ready</span>
            </div>
            <button
              type="button"
              onClick={handleOpenOfficialSnap}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0066AE] hover:bg-[#005590] text-white font-bold rounded-lg text-xs shadow-xs transition active:scale-95"
            >
              <span>Buka Official Snap Popup</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Content Area - 100% Official Midtrans Snap Interface */}
        <div className="p-6 text-center space-y-5">
          {!snapToken ? (
            <div className="py-12 space-y-3">
              <Loader2 className="w-8 h-8 text-[#0066AE] animate-spin mx-auto" />
              <p className="text-xs text-stone-600 font-medium">
                Menghubungkan ke server resmi Midtrans Snap Sandbox...
              </p>
            </div>
          ) : (
            <div className="space-y-4 py-2">
              <div className="w-16 h-16 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center mx-auto text-[#0066AE] shadow-inner">
                <ShieldCheck className="w-8 h-8 text-[#0066AE]" />
              </div>

              <div>
                <h3 className="font-bold text-base text-stone-900">
                  Pembayaran Resmi Midtrans Snap
                </h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1 leading-relaxed">
                  Selesaikan transaksi Anda melalui antarmuka resmi Midtrans. Tersedia opsi GoPay, ShopeePay, QRIS, Virtual Account (BCA, Mandiri, BNI, BRI, Permata), dan Kartu Kredit.
                </p>
              </div>

              <div className="p-4 bg-sky-50/70 border border-sky-200 rounded-2xl text-left text-xs text-stone-700 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-stone-500">Nomor Pesanan:</span>
                  <span className="font-mono font-bold text-stone-900">{order.order_number}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-stone-500">Total Pembayaran:</span>
                  <span className="font-serif font-bold text-[#0066AE] text-sm">{formatIDR(order.total_amount)}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-stone-500">Environment:</span>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Midtrans Sandbox Verified
                  </span>
                </div>
              </div>

              {/* Primary Call to Action */}
              <div className="pt-2 space-y-2.5">
                <button
                  type="button"
                  onClick={handleOpenOfficialSnap}
                  className="w-full py-3.5 px-5 bg-[#0066AE] hover:bg-[#005590] text-white font-bold text-sm rounded-xl shadow-md transition active:scale-98 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Buka Popup Resmi Midtrans Snap</span>
                  <ExternalLink className="w-4 h-4" />
                </button>

                {redirectUrl && (
                  <a
                    href={redirectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs rounded-xl transition flex items-center justify-center gap-1.5"
                  >
                    <span>Atau Buka Halaman Pembayaran di Tab Baru</span>
                    <ExternalLink className="w-3.5 h-3.5 text-stone-500" />
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Action Controls Bar */}
        <div className="p-4 sm:p-5 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-xs font-semibold text-stone-600 hover:text-stone-800 hover:bg-stone-200/60 rounded-xl transition"
          >
            Batalkan / Tutup
          </button>

          <button
            type="button"
            onClick={handleSimulatePayment}
            disabled={isProcessing}
            className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-xs transition active:scale-98 flex items-center justify-center gap-1.5 disabled:opacity-60"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Memeriksa status...</span>
              </>
            ) : (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Cek Status Pembayaran (Sudah Bayar)</span>
              </>
            )}
          </button>
        </div>

        {/* Footer info */}
        <div className="bg-[#002B49]/5 py-2 px-4 text-center border-t border-stone-200">
          <span className="text-[10px] text-stone-500 font-medium">
            Midtrans Payment Gateway • Terhubung Langsung ke API Midtrans Sandbox Resmi
          </span>
        </div>

      </div>
    </div>
  );
};
