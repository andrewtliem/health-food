import React, { useState } from 'react';
import { Lock, ShieldCheck, AlertCircle, X, KeyRound } from 'lucide-react';
import { adminLogin } from '../../lib/api';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (pin: string) => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin.trim()) {
      setError('Masukkan PIN Admin toko.');
      return;
    }

    setIsLoading(true);
    setError(null);

    const result = await adminLogin(pin.trim());
    setIsLoading(false);

    if (result.success) {
      onSuccess(pin.trim());
    } else {
      setError('Akses ditolak: PIN / Passcode tidak valid.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-emerald-100">
        {/* Header decoration */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 px-6 py-8 text-white text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-700/60 border border-emerald-400/30 mb-3 shadow-inner">
            <Lock className="w-8 h-8 text-emerald-200" />
          </div>

          <h2 className="text-xl font-bold tracking-tight">Staff & Admin Portal</h2>
          <p className="text-emerald-200 text-xs mt-1">
            Eden Healthy Market — UNKLAB Campus Operations
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Masukkan Security Passcode
            </label>
            <div className="relative">
              <KeyRound className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="••••••••"
                autoFocus
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-mono tracking-widest text-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-600 text-xs flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p>
              Akses area ini dibatasi ketat khusus untuk staf dan pengelola operasional toko Eden Healthy Market.
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-colors text-sm"
            >
              Kembali ke Toko
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all text-sm disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? 'Memverifikasi...' : 'Buka Portal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
