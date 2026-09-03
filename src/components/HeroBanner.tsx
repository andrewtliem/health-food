import React from 'react';
import { ShieldCheck, Zap, Store, Sparkles, CheckCircle2 } from 'lucide-react';

interface HeroBannerProps {
  onExploreClick: () => void;
  onOpenStrategy: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onExploreClick, onOpenStrategy }) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-oat-100/70 via-eden-50/40 to-white pt-8 pb-12 sm:pb-16 border-b border-oat-200">
      {/* Decorative organic background blobs */}
      <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 rounded-full bg-eden-200/30 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-80 h-80 rounded-full bg-amber-100/40 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-7 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-eden-100/80 border border-eden-200 text-eden-800 text-xs font-semibold mb-4 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-eden-600" />
              <span>Eden Online Presence V1 • Powered by Cloudflare Edge</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-5.5xl text-stone-900 font-bold tracking-tight leading-[1.18] mb-4">
              Nourishing your life with <span className="text-eden-700 italic">pure, wholesome</span> plant foods.
            </h1>

            <p className="text-base sm:text-lg text-stone-600 max-w-2xl mx-auto lg:mx-0 mb-6 leading-relaxed">
              Say goodbye to scattered product info and waiting hours for stock replies. Browse real-time inventory, inspect verified dietary ingredients, and check out seamlessly with Midtrans or reserve for store pickup.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 mb-8">
              <button
                onClick={onExploreClick}
                className="px-6 py-3 bg-eden-700 hover:bg-eden-800 text-white font-medium rounded-full shadow-sm hover:shadow-md transition active:scale-95 flex items-center gap-2 text-sm"
              >
                <span>Browse Clean Pantry</span>
                <span className="text-eden-200">↓</span>
              </button>

              <button
                onClick={onOpenStrategy}
                className="px-5 py-3 bg-white hover:bg-oat-50 text-stone-700 font-medium rounded-full border border-stone-200 shadow-xs hover:border-stone-300 transition text-sm flex items-center gap-2"
              >
                <span>E-Business Strategy Blueprint</span>
                <span className="text-xs bg-eden-100 text-eden-800 px-2 py-0.5 rounded-full font-semibold">Case Study</span>
              </button>
            </div>

            {/* Three Pillar Guarantees */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
              <div className="bg-white/80 backdrop-blur-xs p-3 rounded-xl border border-oat-200/80 shadow-2xs flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-eden-600 mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-xs font-semibold text-stone-900">Live Stock Availability</h4>
                  <p className="text-[11px] text-stone-500">Zero guesswork. What you see is available in our store right now.</p>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-xs p-3 rounded-xl border border-oat-200/80 shadow-2xs flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-eden-600 mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-xs font-semibold text-stone-900">Dietary Transparency</h4>
                  <p className="text-[11px] text-stone-500">Full allergen disclosures, origins, and nutritional highlights.</p>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-xs p-3 rounded-xl border border-oat-200/80 shadow-2xs flex items-start gap-2.5">
                <Zap className="w-4 h-4 text-eden-600 mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-xs font-semibold text-stone-900">Midtrans Payment</h4>
                  <p className="text-[11px] text-stone-500">QRIS, GoPay, ShopeePay, Virtual Accounts with instant confirmation.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Hero Visual Card */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="relative rounded-2xl overflow-hidden shadow-xl border border-stone-200/80 bg-white">
                <img
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1000&q=80"
                  alt="Eden Healthy Market Fresh Produce & Pantry"
                  className="w-full h-64 sm:h-72 object-cover"
                />
                
                {/* Floating physical store card */}
                <div className="p-4 sm:p-5 bg-white">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Store className="w-4 h-4 text-eden-700" />
                      <span className="text-xs font-bold text-stone-800 uppercase tracking-wide">
                        Physical Store & Hub
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Open Now
                    </span>
                  </div>

                  <p className="text-xs text-stone-600 mb-3">
                    Visit us at <strong className="text-stone-900">Universitas Klabat Campus (Jl. Arnold Mononutu, Airmadidi)</strong> for in-person shopping, or order online for <strong>1-hour Click & Collect pickup</strong>.
                  </p>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                    <span>⚡ Cloudflare Edge CDN & D1</span>
                    <span className="font-medium text-eden-700">Sub-30ms Global Latency</span>
                  </div>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-4 -left-4 bg-white/95 backdrop-blur-sm px-3.5 py-2.5 rounded-xl shadow-lg border border-stone-200 flex items-center gap-3 hidden sm:flex">
                <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">
                  🌾
                </div>
                <div>
                  <div className="text-xs font-bold text-stone-900">Sunrise Breakfast Bundle</div>
                  <div className="text-[10px] text-stone-500">Oats + Plant Milk + Granola (Save 15%)</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
