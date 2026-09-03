export type DietarySlug = 'vegan' | 'gluten-free' | 'organic' | 'sugar-free' | 'local' | 'high-protein';

export interface DietaryTag {
  id: string;
  name: string;
  slug: DietarySlug;
  badge_color: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  productCount?: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  category_id: string;
  category_name?: string;
  price: number; // in IDR (Rp)
  unit: string;
  stock_quantity: number;
  image_url: string;
  origin: string;
  ingredients: string;
  allergens?: string;
  nutritional_highlights?: string;
  is_featured?: boolean | number;
  is_bundle?: boolean | number;
  dietary_tags?: DietaryTag[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type FulfillmentType = 'pickup' | 'delivery';

export interface CustomerDetails {
  name: string;
  phone: string;
  email: string;
  fulfillmentType: FulfillmentType;
  pickupTimeSlot?: string;
  deliveryAddress?: string;
  deliveryNotes?: string;
}

export type PaymentMethod = 
  | 'qris'
  | 'gopay'
  | 'shopeepay'
  | 'bca_va'
  | 'mandiri_va'
  | 'bni_va'
  | 'credit_card';

export type PaymentStatus = 'pending' | 'settlement' | 'expire' | 'cancel';

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  fulfillment_type: FulfillmentType;
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
  payment_status: PaymentStatus;
  midtrans_transaction_id: string;
  order_status: OrderStatus;
  created_at: string;
}

export interface MidtransChargeRequest {
  order_id: string;
  gross_amount: number;
  payment_type: PaymentMethod;
  customer_details: {
    first_name: string;
    email: string;
    phone: string;
  };
  item_details: Array<{
    id: string;
    price: number;
    quantity: number;
    name: string;
  }>;
}

export interface MidtransChargeResponse {
  status_code: string;
  status_message: string;
  transaction_id: string;
  order_id: string;
  gross_amount: string;
  payment_type: PaymentMethod;
  transaction_time: string;
  transaction_status: PaymentStatus;
  va_numbers?: Array<{
    bank: string;
    va_number: string;
  }>;
  qr_code_url?: string;
  deep_link_url?: string;
  snap_token?: string;
  redirect_url?: string;
  is_real_sandbox?: boolean;
}

export type OrderStatus = 'processing' | 'ready_for_pickup' | 'out_for_delivery' | 'completed' | 'cancelled';

export interface AdminMetrics {
  totalRevenue: number;
  totalOrders: number;
  activeOrders: number;
  completedOrders: number;
  lowStockCount: number;
  clickAndCollectCount: number;
  deliveryCount: number;
}

export interface NewProductInput {
  name: string;
  category_id: string;
  price: number;
  unit: string;
  stock_quantity: number;
  image_url: string;
  origin: string;
  ingredients: string;
  allergens?: string;
  nutritional_highlights?: string;
}
