import React, { useState, useEffect } from 'react';
import {
  Package,
  Layers,
  PlusCircle,
  LogOut,
  Store,
  CheckCircle2,
  Clock,
  MapPin,
  RefreshCw,
  Search,
  Plus,
  Minus,
  AlertTriangle,
  Phone,
  Calendar,
  DollarSign,
  Check,
} from 'lucide-react';
import { Order, Product, Category, OrderStatus, AdminMetrics } from '../../types';
import {
  fetchAdminOrders,
  updateOrderStatus,
  updateProductStock,
  addNewProduct,
  fetchAdminMetrics,
  formatIDR,
} from '../../lib/api';

interface AdminPortalProps {
  adminPin: string;
  onLogout: () => void;
  onBackToStore: () => void;
  allProducts: Product[];
  allCategories: Category[];
  onProductsUpdated: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  adminPin,
  onLogout,
  onBackToStore,
  allProducts,
  allCategories,
  onProductsUpdated,
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'inventory' | 'add-product'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [orderFilter, setOrderFilter] = useState<string>('all');
  const [inventorySearch, setInventorySearch] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // New Product Form State
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState(allCategories[1]?.id || 'cat-produce');
  const [newProdPrice, setNewProdPrice] = useState('35000');
  const [newProdUnit, setNewProdUnit] = useState('250 g');
  const [newProdStock, setNewProdStock] = useState('15');
  const [newProdOrigin, setNewProdOrigin] = useState('Mitra Petani UNKLAB, Minahasa Utara');
  const [newProdIngredients, setNewProdIngredients] = useState('');
  const [newProdImage, setNewProdImage] = useState(
    'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80'
  );
  const [isSubmittingProd, setIsSubmittingProd] = useState(false);

  // Load initial data
  const loadAdminData = async () => {
    setIsLoading(true);
    try {
      const [orderList, metricData] = await Promise.all([
        fetchAdminOrders(adminPin),
        fetchAdminMetrics(adminPin),
      ]);
      setOrders(orderList);
      setMetrics(metricData);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Handle Order Status Change
  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingId(orderId);
    const ok = await updateOrderStatus(orderId, newStatus, adminPin);
    setUpdatingId(null);
    if (ok) {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, order_status: newStatus } : o))
      );
      showNotification(`Status pesanan berhasil diubah menjadi: ${newStatus}`);
      fetchAdminMetrics(adminPin).then(setMetrics);
    }
  };

  // Handle Quick Stock Adjust
  const handleStockAdjust = async (product: Product, delta: number) => {
    const newStock = Math.max(0, product.stock_quantity + delta);
    setUpdatingId(product.id);
    const ok = await updateProductStock(product.id, newStock, undefined, adminPin);
    setUpdatingId(null);
    if (ok) {
      onProductsUpdated();
      showNotification(`Stok ${product.name} diperbarui: ${newStock} ${product.unit}`);
    }
  };

  // Handle Add Product Submit
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim()) return;

    setIsSubmittingProd(true);
    const ok = await addNewProduct(
      {
        name: newProdName.trim(),
        category_id: newProdCategory,
        price: Number(newProdPrice),
        unit: newProdUnit.trim(),
        stock_quantity: Number(newProdStock),
        origin: newProdOrigin.trim(),
        ingredients: newProdIngredients.trim() || newProdName.trim(),
        image_url: newProdImage.trim(),
      },
      adminPin
    );
    setIsSubmittingProd(false);

    if (ok) {
      showNotification(`Produk "${newProdName}" berhasil ditambahkan ke D1!`);
      setNewProdName('');
      setNewProdIngredients('');
      onProductsUpdated();
      setActiveTab('inventory');
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (orderFilter === 'all') return true;
    return o.order_status === orderFilter;
  });

  const filteredInventory = allProducts.filter((p) => {
    if (!inventorySearch.trim()) return true;
    const q = inventorySearch.toLowerCase();
    return p.name.toLowerCase().includes(q) || p.origin.toLowerCase().includes(q);
  });

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans pb-16">
      {/* Top Admin Header */}
      <header className="bg-slate-900 text-white sticky top-0 z-30 shadow-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-700 flex items-center justify-center text-white font-bold shadow-md">
              🌱
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight text-white">
                  Eden Healthy Market
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Back-Office
                </span>
              </div>
              <p className="text-xs text-slate-400">
                UNKLAB Campus Store Operations • Jl. Arnold Mononutu
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onBackToStore}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors border border-slate-700"
            >
              <Store className="w-3.5 h-3.5 text-emerald-400" />
              <span>Lihat Storefront</span>
            </button>

            <button
              onClick={loadAdminData}
              title="Refresh Data"
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-900/30 hover:bg-rose-900/50 text-rose-300 text-xs font-medium transition-colors border border-rose-800/40"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Floating Notification */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-emerald-700 flex items-center gap-2 text-sm animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Metric Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Total Omzet
              </p>
              <h3 className="text-xl font-bold text-slate-900 mt-1">
                {formatIDR(metrics?.totalRevenue || 0)}
              </h3>
              <p className="text-[11px] text-emerald-600 mt-0.5 flex items-center gap-1">
                <span>Via Midtrans QRIS & VA</span>
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Pesanan Aktif
              </p>
              <h3 className="text-xl font-bold text-slate-900 mt-1">
                {metrics?.activeOrders ?? 0}{' '}
                <span className="text-xs font-normal text-slate-500">
                  / {metrics?.totalOrders ?? 0} total
                </span>
              </h3>
              <p className="text-[11px] text-amber-600 mt-0.5">Menunggu penyiapan</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Stok Kritis
              </p>
              <h3 className="text-xl font-bold text-slate-900 mt-1">
                {allProducts.filter((p) => p.stock_quantity <= 5).length}{' '}
                <span className="text-xs font-normal text-slate-500">item</span>
              </h3>
              <p className="text-[11px] text-rose-600 mt-0.5">Sisa ≤ 5 pcs</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Click & Collect
              </p>
              <h3 className="text-xl font-bold text-slate-900 mt-1">
                {metrics?.clickAndCollectCount ?? 0}
              </h3>
              <p className="text-[11px] text-indigo-600 mt-0.5">Ambil di Counter UNKLAB</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-white rounded-t-2xl px-4 pt-2 gap-2 shadow-sm">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all ${
              activeTab === 'orders'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Order Management (OMS)</span>
            <span className="ml-1.5 px-2 py-0.5 text-xs bg-slate-100 rounded-full font-mono">
              {orders.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all ${
              activeTab === 'inventory'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Inventori & Stok</span>
            <span className="ml-1.5 px-2 py-0.5 text-xs bg-slate-100 rounded-full font-mono">
              {allProducts.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('add-product')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all ${
              activeTab === 'add-product'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Tambah Produk Baru</span>
          </button>
        </div>

        {/* TAB 1: ORDER MANAGEMENT (OMS) */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-b-2xl border-x border-b border-slate-200 shadow-sm p-4 sm:p-6">
            {/* Filter Pills */}
            <div className="flex flex-wrap gap-2 mb-6 pb-4 border-b border-slate-100">
              {[
                { id: 'all', label: 'Semua Status' },
                { id: 'processing', label: 'Diproses' },
                { id: 'ready_for_pickup', label: 'Siap Diambil' },
                { id: 'completed', label: 'Selesai' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setOrderFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    orderFilter === tab.id
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Orders Table */}
            {filteredOrders.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <Package className="w-12 h-12 mx-auto mb-3 opacity-40 text-slate-400" />
                <p className="text-sm font-medium">Belum ada pesanan pada status ini.</p>
                <p className="text-xs text-slate-400 mt-1">
                  Pesanan yang dibuat pelanggan di storefront akan otomatis muncul di sini.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="p-4 sm:p-5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200/70">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-900 text-sm">
                            {order.order_number}
                          </span>
                          <span
                            className={`px-2 py-0.5 text-[11px] font-bold rounded-full uppercase tracking-wider ${
                              order.order_status === 'completed'
                                ? 'bg-emerald-100 text-emerald-800'
                                : order.order_status === 'ready_for_pickup'
                                ? 'bg-indigo-100 text-indigo-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {order.order_status.replace(/_/g, ' ')}
                          </span>
                          <span className="px-2 py-0.5 text-[11px] font-bold rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {order.payment_method.toUpperCase()} • {order.payment_status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>
                            {new Date(order.created_at || Date.now()).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </p>
                      </div>

                      {/* Status Action Buttons */}
                      <div className="flex items-center gap-2 self-start sm:self-auto">
                        {order.order_status === 'processing' && (
                          <button
                            onClick={() => handleStatusChange(order.id, 'ready_for_pickup')}
                            disabled={updatingId === order.id}
                            className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Siap Diambil di Counter</span>
                          </button>
                        )}
                        {order.order_status === 'ready_for_pickup' && (
                          <button
                            onClick={() => handleStatusChange(order.id, 'completed')}
                            disabled={updatingId === order.id}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Tandai Selesai Diambil</span>
                          </button>
                        )}
                        {order.order_status === 'completed' && (
                          <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Selesai
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Customer & Fulfillment Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-3 text-xs border-b border-slate-200/50">
                      <div>
                        <p className="font-semibold text-slate-800">{order.customer_name}</p>
                        <p className="text-slate-600 flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{order.customer_phone}</span>
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-500">
                          Metode:{' '}
                          <strong className="text-slate-800">
                            {order.fulfillment_type === 'pickup'
                              ? 'Click & Collect (Counter UNKLAB)'
                              : 'Kurir Lokal Airmadidi'}
                          </strong>
                        </p>
                        {order.pickup_time_slot && (
                          <p className="text-slate-600 mt-0.5">
                            Slot Ambil: {order.pickup_time_slot}
                          </p>
                        )}
                        {order.delivery_address && (
                          <p className="text-slate-600 mt-0.5">Alamat: {order.delivery_address}</p>
                        )}
                      </div>
                    </div>

                    {/* Item list */}
                    <div className="pt-3 flex items-center justify-between">
                      <div className="text-xs text-slate-600">
                        {order.items?.map((item, idx) => (
                          <span key={idx} className="mr-3">
                            {item.quantity}x {item.name}
                          </span>
                        ))}
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-slate-500">Total:</span>{' '}
                        <strong className="text-sm font-bold text-slate-900">
                          {formatIDR(order.total_amount)}
                        </strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: INVENTORY & STOCK MANAGEMENT */}
        {activeTab === 'inventory' && (
          <div className="bg-white rounded-b-2xl border-x border-b border-slate-200 shadow-sm p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={inventorySearch}
                  onChange={(e) => setInventorySearch(e.target.value)}
                  placeholder="Cari produk di stok toko..."
                  className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <p className="text-xs text-slate-500">
                Menampilkan <strong>{filteredInventory.length}</strong> produk di Cloudflare D1
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px] bg-slate-50">
                    <th className="py-3 px-3">Produk</th>
                    <th className="py-3 px-3">Kategori</th>
                    <th className="py-3 px-3">Harga</th>
                    <th className="py-3 px-3">Stok Saat Ini</th>
                    <th className="py-3 px-3 text-right">Quick Restock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredInventory.map((product) => {
                    const isLow = product.stock_quantity <= 5;
                    const isOut = product.stock_quantity <= 0;
                    return (
                      <tr key={product.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0"
                            />
                            <div>
                              <p className="font-semibold text-slate-900">{product.name}</p>
                              <p className="text-[11px] text-slate-500">
                                {product.unit} • {product.origin}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-3 text-slate-600">
                          {product.category_name || product.category_id.replace('cat-', '')}
                        </td>

                        <td className="py-3 px-3 font-semibold text-slate-900 font-mono">
                          {formatIDR(product.price)}
                        </td>

                        <td className="py-3 px-3">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                              isOut
                                ? 'bg-rose-100 text-rose-800'
                                : isLow
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {isOut ? 'Habis (0)' : `${product.stock_quantity} ${product.unit}`}
                          </span>
                        </td>

                        <td className="py-3 px-3 text-right">
                          <div className="inline-flex items-center gap-1">
                            <button
                              onClick={() => handleStockAdjust(product, -1)}
                              disabled={product.stock_quantity <= 0 || updatingId === product.id}
                              title="Kurangi 1"
                              className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-30"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleStockAdjust(product, +1)}
                              disabled={updatingId === product.id}
                              title="Tambah 1"
                              className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleStockAdjust(product, +5)}
                              disabled={updatingId === product.id}
                              className="px-2 py-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold text-[11px]"
                            >
                              +5
                            </button>
                            <button
                              onClick={() => handleStockAdjust(product, +10)}
                              disabled={updatingId === product.id}
                              className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px]"
                            >
                              +10 Restock
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: ADD NEW PRODUCT FORM */}
        {activeTab === 'add-product' && (
          <div className="bg-white rounded-b-2xl border-x border-b border-slate-200 shadow-sm p-6 max-w-2xl mx-auto">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Tambah Produk Sehat ke Database D1
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Produk yang ditambahkan akan langsung tersimpan di Cloudflare D1 dan tampil di etalase
              toko.
            </p>

            <form onSubmit={handleAddProduct} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Produk</label>
                <input
                  type="text"
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  placeholder="Contoh: Kombucha Apel Manado Organik"
                  required
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kategori</label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    {allCategories
                      .filter((c) => c.id !== 'cat-all')
                      .map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Harga Jual (Rp)
                  </label>
                  <input
                    type="number"
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Satuan / Kemasan
                  </label>
                  <input
                    type="text"
                    value={newProdUnit}
                    onChange={(e) => setNewProdUnit(e.target.value)}
                    placeholder="Contoh: 330 ml / 250 g"
                    required
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Jumlah Stok Masuk
                  </label>
                  <input
                    type="number"
                    value={newProdStock}
                    onChange={(e) => setNewProdStock(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Asal Produk</label>
                <input
                  type="text"
                  value={newProdOrigin}
                  onChange={(e) => setNewProdOrigin(e.target.value)}
                  placeholder="Contoh: Kebun Organik Airmadidi, UNKLAB"
                  required
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Bahan / Komposisi
                </label>
                <textarea
                  value={newProdIngredients}
                  onChange={(e) => setNewProdIngredients(e.target.value)}
                  rows={2}
                  placeholder="Contoh: 100% Sari Buah Apel Asli, Teh Hijau Fermentasi, Madu Hutan Alami"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">URL Gambar</label>
                <input
                  type="url"
                  value={newProdImage}
                  onChange={(e) => setNewProdImage(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono text-slate-600"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmittingProd}
                  className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>
                    {isSubmittingProd ? 'Menyimpan ke D1...' : 'Simpan Produk ke Database D1'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};
