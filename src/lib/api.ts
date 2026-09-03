import { Product, Category, Order, MidtransChargeResponse, PaymentMethod } from '../types';
import { INITIAL_PRODUCTS, CATEGORIES } from '../data/mockData';

// Local storage key for persistent client-side demo state
const STORAGE_KEY_PRODUCTS = 'eden_products_v1';

function getLocalProducts(): Product[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_PRODUCTS);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Storage error:', e);
  }
  return INITIAL_PRODUCTS;
}

function saveLocalProducts(products: Product[]) {
  try {
    localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(products));
  } catch (e) {
    console.error('Storage error:', e);
  }
}

export async function fetchProducts(options?: {
  category?: string;
  dietary?: string;
  search?: string;
  inStock?: boolean;
}): Promise<Product[]> {
  try {
    const params = new URLSearchParams();
    if (options?.category && options.category !== 'all') params.append('category', options.category);
    if (options?.dietary && options.dietary !== 'all') params.append('dietary', options.dietary);
    if (options?.search) params.append('search', options.search);
    if (options?.inStock) params.append('inStock', 'true');

    const res = await fetch(`/api/products?${params.toString()}`);
    if (res.ok) {
      const json = (await res.json()) as any;
      if (json.success && Array.isArray(json.data)) {
        return json.data;
      }
    }
  } catch {
    // Graceful fallback to client storage
  }

  // Client-side fallback filter
  let products = getLocalProducts();
  const selectedCat = options?.category;
  if (selectedCat && selectedCat !== 'all') {
    products = products.filter(
      (p) => p.category_id === selectedCat || (p.category_name ? p.category_name.toLowerCase().includes(selectedCat.toLowerCase()) : false)
    );
  }
  if (options?.dietary && options.dietary !== 'all') {
    products = products.filter((p) => p.dietary_tags?.some((t) => t.slug === options.dietary));
  }
  if (options?.inStock) {
    products = products.filter((p) => p.stock_quantity > 0);
  }
  if (options?.search) {
    const q = options.search.toLowerCase();
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.ingredients.toLowerCase().includes(q)
    );
  }
  return products;
}

export async function fetchCategories(): Promise<Category[]> {
  try {
    const res = await fetch('/api/categories');
    if (res.ok) {
      const json = (await res.json()) as any;
      if (json.success && Array.isArray(json.data)) {
        return json.data;
      }
    }
  } catch {
    // fallback
  }

  const products = getLocalProducts();
  return CATEGORIES.map((cat) => ({
    ...cat,
    productCount: cat.id === 'cat-all' ? products.length : products.filter((p) => p.category_id === cat.id).length,
  }));
}

export async function createOrder(orderPayload: {
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  fulfillment_type: 'pickup' | 'delivery';
  pickup_time_slot?: string;
  delivery_address?: string;
  delivery_notes?: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    unit: string;
    image_url: string;
  }>;
  subtotal: number;
  delivery_fee: number;
  total_amount: number;
  payment_method: PaymentMethod;
}): Promise<Order> {
  try {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload),
    });
    if (res.ok) {
      const json = (await res.json()) as any;
      if (json.success && json.data) {
        return json.data;
      }
    }
  } catch {
    // fallback
  }

  // Client-side fallback creation
  const orderNumber = `EDN-${Date.now().toString().slice(-6)}`;
  const newOrder: Order = {
    id: `order-${Date.now()}`,
    order_number: orderNumber,
    customer_name: orderPayload.customer_name,
    customer_phone: orderPayload.customer_phone,
    customer_email: orderPayload.customer_email || '',
    fulfillment_type: orderPayload.fulfillment_type,
    pickup_time_slot: orderPayload.pickup_time_slot,
    delivery_address: orderPayload.delivery_address,
    delivery_notes: orderPayload.delivery_notes,
    items: orderPayload.items,
    subtotal: orderPayload.subtotal,
    delivery_fee: orderPayload.delivery_fee,
    total_amount: orderPayload.total_amount,
    payment_method: orderPayload.payment_method,
    payment_status: 'pending',
    midtrans_transaction_id: `MID-${Date.now()}`,
    order_status: 'processing',
    created_at: new Date().toISOString(),
  };

  // Decrement local products stock
  const currentProds = getLocalProducts();
  for (const item of newOrder.items) {
    const p = currentProds.find((cp) => cp.id === item.id);
    if (p) {
      p.stock_quantity = Math.max(0, p.stock_quantity - item.quantity);
    }
  }
  saveLocalProducts(currentProds);

  return newOrder;
}

export async function requestMidtransCharge(
  order: Order,
  paymentMethod: PaymentMethod
): Promise<MidtransChargeResponse> {
  try {
    const res = await fetch('/api/midtrans/charge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        order_id: order.order_number,
        gross_amount: order.total_amount,
        payment_type: paymentMethod,
        customer_name: order.customer_name,
        customer_phone: order.customer_phone,
        customer_email: order.customer_email,
        items: order.items,
      }),
    });
    if (res.ok) {
      const json = (await res.json()) as any;
      if (json.success && json.data) {
        return json.data;
      }
    }
  } catch {
    // fallback
  }

  // Client simulation fallback
  const transactionId = `MID-${Date.now()}`;
  let vaNumbers: Array<{ bank: string; va_number: string }> | undefined;
  let qrCodeUrl: string | undefined;

  if (paymentMethod === 'qris') {
    qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=00020101021226590014ID.LINKAJA.WWW01189360091100000000000215ID102002100000005204581253033605802ID5919EDEN+HEALTHY+MARKET6008AIRMADIDI61059537162070703A016304${order.order_number}`;
  } else if (paymentMethod.includes('va')) {
    const bank = paymentMethod.replace('_va', '').toUpperCase();
    const bankCode = bank === 'BCA' ? '80777' : bank === 'MANDIRI' ? '88012' : '88100';
    vaNumbers = [{ bank, va_number: `${bankCode}${Math.floor(10000000 + Math.random() * 90000000)}` }];
  }

  return {
    status_code: '201',
    status_message: 'Midtrans Transaction Created',
    transaction_id: transactionId,
    order_id: order.order_number,
    gross_amount: order.total_amount.toString(),
    payment_type: paymentMethod,
    transaction_time: new Date().toISOString(),
    transaction_status: 'pending',
    va_numbers: vaNumbers,
    qr_code_url: qrCodeUrl,
  };
}

export async function simulateMidtransPayment(
  orderNumber: string,
  status: string = 'settlement'
): Promise<boolean> {
  try {
    const res = await fetch('/api/midtrans/simulate-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_id: orderNumber, transaction_status: status }),
    });
    return res.ok;
  } catch (err) {
    console.warn('Failed to simulate payment in backend:', err);
    return false;
  }
}

export function formatIDR(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export async function sendChatMessage(
  message: string,
  history: Array<{ role: string; content: string }>
): Promise<{ reply: string; source: string }> {
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history }),
    });

    if (res.ok) {
      const json = (await res.json()) as any;
      if (json.success && json.reply) {
        return { reply: json.reply, source: json.source || 'edge' };
      }
    }
  } catch (err) {
    console.warn('Chat fetch failed, falling back:', err);
  }

  return {
    reply: `Halo! Eden Healthy Market is located at Universitas Klabat (UNKLAB) campus, Jl. Arnold Mononutu, Airmadidi. Open daily 08:00 - 20:00 WITA. We sell 100% vegetarian whole foods, artisan tempeh, rolled oats, and fresh produce. How can I help you today?`,
    source: 'fallback',
  };
}

// ==============================================================================
// BACK-OFFICE (ADMIN PORTAL) CLIENT FUNCTIONS
// ==============================================================================

export async function adminLogin(pin: string): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin }),
    });
    const json = (await res.json()) as any;
    return { success: res.ok && json.success, message: json.message || 'Login failed' };
  } catch (err: any) {
    return { success: false, message: err.message || 'Network error' };
  }
}

export async function fetchAdminOrders(pin: string): Promise<Order[]> {
  try {
    const res = await fetch('/api/admin/orders', {
      headers: { 'x-admin-pin': pin },
    });
    if (res.ok) {
      const json = (await res.json()) as any;
      if (json.success && Array.isArray(json.data)) {
        return json.data;
      }
    }
  } catch (err) {
    console.warn('Failed to fetch admin orders:', err);
  }
  return [];
}

export async function updateOrderStatus(orderId: string, status: string, pin: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-pin': pin,
      },
      body: JSON.stringify({ status }),
    });
    return res.ok;
  } catch (err) {
    console.warn('Failed to update order status:', err);
    return false;
  }
}

export async function updateProductStock(
  productId: string,
  stockQuantity: number,
  price: number | undefined,
  pin: string
): Promise<boolean> {
  try {
    const res = await fetch(`/api/admin/products/${productId}/stock`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-pin': pin,
      },
      body: JSON.stringify({ stock_quantity: stockQuantity, price }),
    });
    return res.ok;
  } catch (err) {
    console.warn('Failed to update product stock:', err);
    return false;
  }
}

export async function addNewProduct(productData: any, pin: string): Promise<boolean> {
  try {
    const res = await fetch('/api/admin/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-pin': pin,
      },
      body: JSON.stringify(productData),
    });
    return res.ok;
  } catch (err) {
    console.warn('Failed to add new product:', err);
    return false;
  }
}

export async function fetchAdminMetrics(pin: string): Promise<any> {
  try {
    const res = await fetch('/api/admin/metrics', {
      headers: { 'x-admin-pin': pin },
    });
    if (res.ok) {
      const json = (await res.json()) as any;
      if (json.success && json.data) {
        return json.data;
      }
    }
  } catch (err) {
    console.warn('Failed to fetch admin metrics:', err);
  }
  return {
    totalRevenue: 0,
    totalOrders: 0,
    activeOrders: 0,
    completedOrders: 0,
    lowStockCount: 0,
    clickAndCollectCount: 0,
    deliveryCount: 0,
  };
}
