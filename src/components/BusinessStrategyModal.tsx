import React, { useState } from 'react';
import { 
  X, 
  Briefcase, 
  Users, 
  Cpu, 
  CheckCircle2, 
  AlertTriangle, 
  Zap, 
  CreditCard,
  ShieldCheck,
  TrendingUp,
  Database,
  Globe
} from 'lucide-react';

interface BusinessStrategyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BusinessStrategyModal: React.FC<BusinessStrategyModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'strategy' | 'cx' | 'technology'>('strategy');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div 
        className="bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-stone-900 text-white p-5 sm:p-6 border-b border-stone-800 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs bg-eden-600 text-eden-100 font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                E-Business Design Blueprint
              </span>
              <span className="text-stone-400 text-xs">• Course Solution V1</span>
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold">
              Eden Healthy Market: Strategy, CX & Technology Integration
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-white rounded-xl hover:bg-stone-800 transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-stone-200 bg-stone-50 px-6 pt-2">
          <button
            onClick={() => setActiveTab('strategy')}
            className={`py-3 px-4 font-bold text-xs sm:text-sm border-b-2 flex items-center gap-2 transition ${
              activeTab === 'strategy'
                ? 'border-eden-700 text-eden-800 bg-white'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Briefcase className="w-4 h-4 text-eden-600" />
            <span>1. Business Strategy</span>
          </button>

          <button
            onClick={() => setActiveTab('cx')}
            className={`py-3 px-4 font-bold text-xs sm:text-sm border-b-2 flex items-center gap-2 transition ${
              activeTab === 'cx'
                ? 'border-eden-700 text-eden-800 bg-white'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Users className="w-4 h-4 text-eden-600" />
            <span>2. Customer Experience (CX)</span>
          </button>

          <button
            onClick={() => setActiveTab('technology')}
            className={`py-3 px-4 font-bold text-xs sm:text-sm border-b-2 flex items-center gap-2 transition ${
              activeTab === 'technology'
                ? 'border-eden-700 text-eden-800 bg-white'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Cpu className="w-4 h-4 text-eden-600" />
            <span>3. Cloudflare Tech Stack</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-left text-stone-700 text-sm">
          
          {/* TAB 1: BUSINESS STRATEGY */}
          {activeTab === 'strategy' && (
            <div className="space-y-6">
              
              {/* Strategic Transformation Matrix */}
              <div>
                <h3 className="text-base font-bold text-stone-900 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-eden-700" />
                  Strategic Transformation: From Manual Chaos to Scalable E-Commerce
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Before */}
                  <div className="p-4 rounded-2xl bg-red-50/70 border border-red-200">
                    <div className="flex items-center gap-2 text-red-800 font-bold text-xs uppercase tracking-wider mb-2">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                      Current Bottlenecks (Before)
                    </div>
                    <ul className="space-y-2 text-xs text-red-950">
                      <li className="flex items-start gap-1.5">
                        <span className="font-bold">•</span>
                        <span><strong>Manual Stock Inquiries:</strong> Clerks spend up to 45% of daily work hours typing answers to "Is oat milk in stock?" or "How much is tempeh?".</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="font-bold">•</span>
                        <span><strong>Fragmented Product Information:</strong> Ingredients, allergen profiles, and dietary certificates scattered across WhatsApp photos and stickers.</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="font-bold">•</span>
                        <span><strong>Lost Sales & Abandonment:</strong> Delayed chat responses cause hungry or busy shoppers to purchase from supermarket competitors instead.</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="font-bold">•</span>
                        <span><strong>Manual Payment Verification:</strong> Clerks manually checking bank transfer screenshots, leading to fraud risk and delays.</span>
                      </li>
                    </ul>
                  </div>

                  {/* After */}
                  <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                    <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider mb-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      V1 Digital Transformation (After)
                    </div>
                    <ul className="space-y-2 text-xs text-emerald-950">
                      <li className="flex items-start gap-1.5">
                        <span className="font-bold">•</span>
                        <span><strong>Real-Time Edge Inventory:</strong> Cloudflare D1 inventory tracks live counts; customers see live "In Stock" or "Only X left" badges directly.</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="font-bold">•</span>
                        <span><strong>Complete Dietary Transparency:</strong> Dedicated allergen declarations, ingredients, origins, and verified lifestyle tags (Vegan, GF, Organic).</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="font-bold">•</span>
                        <span><strong>24/7 Self-Service Catalog:</strong> Orders can be placed at any time with zero human latency.</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="font-bold">•</span>
                        <span><strong>Automated Midtrans Settlement:</strong> Instant QRIS & Virtual Account reconciliation with real-time order status callbacks.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Target Segments */}
              <div className="border-t border-stone-200 pt-5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
                  Core Customer Personas & Value Proposition
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <strong className="text-stone-900 block mb-1">🌿 Dedicated Vegans & Vegetarians</strong>
                    <p className="text-stone-600">Demands 100% verified plant-based ingredients, banana-leaf tempeh, and clean egg/dairy substitutes.</p>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <strong className="text-stone-900 block mb-1">🏃 Fitness & Clean Eaters</strong>
                    <p className="text-stone-600">Looks for macro-nutrient balance, high protein quinoa, beta-glucan oats, and zero-sugar plant drinks.</p>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <strong className="text-stone-900 block mb-1">👨‍👩‍👦 Health-Conscious Families</strong>
                    <p className="text-stone-600">Purchases weekly organic veggie boxes and breakfast bundles to eliminate pesticide exposure.</p>
                  </div>
                </div>
              </div>

              {/* Unit Economics & Revenue Model */}
              <div className="p-4 bg-oat-50 rounded-2xl border border-oat-200 text-xs space-y-2">
                <div className="font-bold text-stone-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-eden-700" />
                  Revenue Architecture & Margin Protection
                </div>
                <p className="text-stone-600 leading-relaxed">
                  • <strong>Curated Bundles:</strong> Sunrise Breakfast and Veggie Boxes raise Average Order Value (AOV) from ~Rp 60.000 to ~Rp 150.000 while protecting gross margins (38-42%).
                  <br />
                  • <strong>Free Delivery Incentive Threshold:</strong> Set at Rp 150.000 to maximize basket size and offset local motorcycle courier dispatch costs.
                  <br />
                  • <strong>Click & Collect Synergy:</strong> In-store pickup drives foot traffic to the Universitas Klabat campus store, stimulating impulse purchases of wholesome snacks and fresh produce.
                </p>
              </div>

            </div>
          )}

          {/* TAB 2: CUSTOMER EXPERIENCE */}
          {activeTab === 'cx' && (
            <div className="space-y-6">
              
              <div>
                <h3 className="text-base font-bold text-stone-900 mb-2 flex items-center gap-2">
                  <Users className="w-4 h-4 text-eden-700" />
                  The 5-Stage Friction-Free Customer Journey Map
                </h3>
                <p className="text-xs text-stone-600 mb-4">
                  How the Eden Healthy Market web application removes friction at every step of the consumer funnel:
                </p>

                <div className="space-y-3">
                  {/* Step 1 */}
                  <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 flex items-start gap-3 text-xs">
                    <div className="w-6 h-6 rounded-full bg-eden-700 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      1
                    </div>
                    <div>
                      <strong className="text-stone-900 block">Discovery & Lifestyle Filtering</strong>
                      <span className="text-stone-600">Shopper arrives on mobile/desktop; selects dietary preferences with 1 click (e.g., "100% Vegan" + "Gluten-Free"). Instant zero-latency filter without page reloads.</span>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 flex items-start gap-3 text-xs">
                    <div className="w-6 h-6 rounded-full bg-eden-700 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      2
                    </div>
                    <div>
                      <strong className="text-stone-900 block">Real-Time Stock & Ingredient Inspection</strong>
                      <span className="text-stone-600">Product cards display live inventory badges (`In Stock`, `Low Stock: Only X left`). Clicking opens the full transparency modal with farm origins, allergens, and nutritional facts.</span>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 flex items-start gap-3 text-xs">
                    <div className="w-6 h-6 rounded-full bg-eden-700 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      3
                    </div>
                    <div>
                      <strong className="text-stone-900 block">Smart Cart & Free Delivery Threshold Progress</strong>
                      <span className="text-stone-600">Interactive slide-over cart visualizes how many Rupiah are needed to unlock free delivery, encouraging basket building.</span>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 flex items-start gap-3 text-xs">
                    <div className="w-6 h-6 rounded-full bg-eden-700 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      4
                    </div>
                    <div>
                      <strong className="text-stone-900 block">Fulfillment Choice (Store Pickup vs Local Courier)</strong>
                      <span className="text-stone-600">User selects Click & Collect with designated time window (e.g. 14:00 - 16:00) or enters delivery address for same-day local dispatch.</span>
                    </div>
                  </div>

                  {/* Step 5 */}
                  <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 flex items-start gap-3 text-xs">
                    <div className="w-6 h-6 rounded-full bg-eden-700 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      5
                    </div>
                    <div>
                      <strong className="text-stone-900 block">Instant Midtrans Gateway Payment & Digital Receipt</strong>
                      <span className="text-stone-600">Seamless Midtrans Snap payment (QRIS, BCA VA, GoPay, Card). Automatic status update to `settlement`, followed by a printable digital receipt and store pickup QR code.</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: TECHNOLOGY ARCHITECTURE */}
          {activeTab === 'technology' && (
            <div className="space-y-6">
              
              <div>
                <h3 className="text-base font-bold text-stone-900 mb-2 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-eden-700" />
                  Cloudflare Edge Architecture & Integration
                </h3>
                <p className="text-xs text-stone-600 mb-4">
                  Why Cloudflare Pages + Workers + D1 is the ideal technological choice for Eden Healthy Market:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  {/* Cloudflare Pages */}
                  <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
                    <div className="flex items-center gap-2 font-bold text-stone-900 mb-2">
                      <Globe className="w-4 h-4 text-orange-500" />
                      <span>Cloudflare Pages (Frontend CDN)</span>
                    </div>
                    <p className="text-stone-600 leading-relaxed">
                      • Jamstack architecture built with React + Vite + Tailwind CSS.
                      <br />• Deployed across Cloudflare's 330+ global PoPs for sub-30ms TTFB.
                      <br />• Instant cache invalidation and zero bandwidth charges.
                    </p>
                  </div>

                  {/* Cloudflare Workers / Functions */}
                  <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
                    <div className="flex items-center gap-2 font-bold text-stone-900 mb-2">
                      <Zap className="w-4 h-4 text-amber-500" />
                      <span>Cloudflare Pages Functions (Edge API)</span>
                    </div>
                    <p className="text-stone-600 leading-relaxed">
                      • Powered by Hono.js micro-framework running directly on V8 isolates.
                      <br />• Zero cold starts (unlike traditional AWS Lambda or Google Cloud Functions).
                      <br />• REST endpoints for `/api/products`, `/api/orders`, `/api/midtrans`.
                    </p>
                  </div>

                  {/* Cloudflare D1 */}
                  <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
                    <div className="flex items-center gap-2 font-bold text-stone-900 mb-2">
                      <Database className="w-4 h-4 text-blue-600" />
                      <span>Cloudflare D1 (Serverless SQLite)</span>
                    </div>
                    <p className="text-stone-600 leading-relaxed">
                      • Distributed SQLite database at the edge for relational schema.
                      <br />• Atomic transactions for inventory deduction when orders are placed.
                      <br />• Inexpensive, zero-management maintenance ideal for small retail businesses.
                    </p>
                  </div>

                  {/* Midtrans Snap */}
                  <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
                    <div className="flex items-center gap-2 font-bold text-stone-900 mb-2">
                      <CreditCard className="w-4 h-4 text-emerald-600" />
                      <span>Midtrans Snap Payment Engine</span>
                    </div>
                    <p className="text-stone-600 leading-relaxed">
                      • Indonesia's standard payment infrastructure (QRIS, GoPay, Bank VA).
                      <br />• Real-time webhook notifications update order status from `pending` to `settlement`.
                      <br />• Eliminates manual cashier screenshot checking.
                    </p>
                  </div>
                </div>
              </div>

              {/* Data Flow Diagram in code box */}
              <div className="p-4 bg-stone-900 text-stone-200 rounded-2xl font-mono text-[11px] overflow-x-auto">
                <div className="text-eden-400 font-bold mb-2">// Edge Request & Data Flow Architecture</div>
                {`[Customer Device] (Mobile / Desktop)
       │
       ▼ (HTTPS / HTTP/3 over Cloudflare Anycast)
[Cloudflare Pages CDN] ──── (Serves Cached React UI + Static Assets)
       │
       ▼ (/api/products, /api/orders, /api/midtrans)
[Cloudflare Pages Functions / Workers + Hono]
       │
       ├──► [Cloudflare D1 Database] (Atomic SQL queries & live stock updates)
       │
       └──► [Midtrans Snap Gateway] (QRIS / VA / E-Wallet charge & webhook verification)`}
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
          <span className="text-xs text-stone-500">
            Eden Healthy Market E-Business Architecture • Semester 1 2026/2027
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-eden-700 hover:bg-eden-800 text-white font-semibold text-xs rounded-xl shadow-xs transition"
          >
            Back to Store
          </button>
        </div>

      </div>
    </div>
  );
};
