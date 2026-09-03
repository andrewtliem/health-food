import React from 'react';
import { Leaf, MapPin, Clock, ShieldCheck, Sparkles } from 'lucide-react';

interface FooterProps {
  onOpenStrategy: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenStrategy }) => {
  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand & Mission */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-eden-700 flex items-center justify-center text-white">
                <Leaf className="w-5 h-5 text-eden-200" />
              </div>
              <span className="font-serif text-xl font-bold text-white tracking-tight">
                Eden Healthy Market
              </span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              Curating 100% vegetarian foods, artisan whole grains, nutritious granola, plant milks, and farm-fresh organic produce for mindful daily living.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-eden-400">
              <ShieldCheck className="w-4 h-4 text-eden-400" />
              <span>Certified Non-GMO & Wholesome</span>
            </div>
          </div>

          {/* Physical Store Hub */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Physical Store & Hub
            </h4>
            <div className="space-y-2 text-xs text-stone-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-eden-500 shrink-0 mt-0.5" />
                <span>
                  Universitas Klabat (UNKLAB) Campus Complex<br />
                  Jl. Arnold Mononutu, Airmadidi, Minahasa Utara<br />
                  Sulawesi Utara 95371
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-eden-500 shrink-0" />
                <span>Open Daily: 08:00 - 20:00 WITA</span>
              </div>
            </div>
          </div>

          {/* Customer Journey & Fulfillment */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Shopping & Fulfillment
            </h4>
            <ul className="space-y-1.5 text-xs text-stone-400">
              <li>• Store Click & Collect (1-Hour Ready)</li>
              <li>• Same-Day Local Delivery</li>
              <li>• Free Delivery for Orders Rp 150.000+</li>
              <li>• Real-Time In-Store Inventory</li>
              <li>• Midtrans Snap (QRIS, VA, GoPay, Card)</li>
            </ul>
          </div>

          {/* Architecture & Course Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Digital Architecture
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              Engineered on Cloudflare Pages, Workers Pages Functions, and Cloudflare D1 Serverless SQLite database.
            </p>
            <button
              onClick={onOpenStrategy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-eden-300 rounded-lg text-xs font-semibold transition border border-stone-700"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Strategy Blueprint
            </button>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-stone-800 flex flex-wrap items-center justify-between gap-4 text-xs text-stone-500">
          <div>
            © {new Date().getFullYear()} Eden Healthy Market. All rights reserved.
          </div>
          <div>
            <span>Universitas Klabat (UNKLAB)</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
