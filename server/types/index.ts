export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  original_price: number | null;
  category: 'temple' | 'interior' | 'laser' | 'custom';
  images: string[];
  stock: number;
  weight_grams: number | null;
  dimensions: string | null;
  is_featured: boolean;
  created_at: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  created_at: string;
}

export interface Order {
  id: string;
  customer_id: string;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_method: 'razorpay' | 'cod';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  shipping_address: any; // jsonb
  shiprocket_order_id: string | null;
  tracking_number: string | null;
  notes: string | null;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
}

export interface CustomOrder {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  description: string;
  dimensions: string | null;
  reference_image_url: string | null;
  status: 'new' | 'reviewing' | 'quoted' | 'confirmed' | 'in_production' | 'completed';
  created_at: string;
}

export interface CartItem {
  id: string;
  session_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
}

export interface CreateOrderBody {
  customer: Partial<Customer>;
  items: Array<{ productId: string; quantity: number; price: number }>;
  paymentMethod: 'razorpay' | 'cod';
  shippingAddress: any;
  notes?: string;
}

export interface RazorpayVerifyBody {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  orderId: string;
}

export interface CustomOrderBody {
  name: string;
  phone: string;
  email?: string;
  description: string;
  dimensions?: string;
  referenceImageUrl?: string;
}
