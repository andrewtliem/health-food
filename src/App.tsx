import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { FilterBar } from './components/FilterBar';
import { ProductGrid } from './components/ProductGrid';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { MidtransSnapModal } from './components/MidtransSnapModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { BusinessStrategyModal } from './components/BusinessStrategyModal';
import { ChatWidget } from './components/ChatWidget';
import { Footer } from './components/Footer';
import { AdminPortal } from './components/admin/AdminPortal';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { Product, Category, CartItem, Order, PaymentMethod } from './types';
import { fetchProducts, fetchCategories, requestMidtransCharge, simulateMidtransPayment } from './lib/api';
import { DIETARY_TAGS } from './data/mockData';
import { ShoppingBag } from 'lucide-react';

const CART_STORAGE_KEY = 'eden_cart_v1';

export const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState('cat-all');
  const [selectedDietary, setSelectedDietary] = useState('all');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Cart
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modals
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isMidtransOpen, setIsMidtransOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isStrategyOpen, setIsStrategyOpen] = useState(false);

  // Back-Office / Admin State
  const [adminPin, setAdminPin] = useState<string | null>(() => {
    return sessionStorage.getItem('eden_admin_pin') || null;
  });
  const [isAdminPortalOpen, setIsAdminPortalOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);

  // Order & Payment state
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [currentPaymentMethod, setCurrentPaymentMethod] = useState<PaymentMethod>('qris');

  // Check URL Hash for #admin
  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#admin') {
        if (sessionStorage.getItem('eden_admin_pin')) {
          setIsAdminPortalOpen(true);
        } else {
          setIsAdminLoginOpen(true);
        }
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Persist cart
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (e) {
      console.error('Error saving cart:', e);
    }
  }, [cartItems]);

  // Load initial products and categories
  const loadData = async () => {
    setIsLoading(true);
    try {
      const [cats, prods] = await Promise.all([
        fetchCategories(),
        fetchProducts(),
      ]);
      setCategories(cats);
      setProducts(prods);
    } catch (err) {
      console.error('Failed to load initial data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter products client-side for ultra-responsive micro-interactions
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (selectedCategory !== 'cat-all' && p.category_id !== selectedCategory) {
        return false;
      }
      // Dietary filter
      if (selectedDietary !== 'all') {
        const hasTag = p.dietary_tags?.some((t) => t.slug === selectedDietary);
        if (!hasTag) return false;
      }
      // In stock filter
      if (inStockOnly && p.stock_quantity <= 0) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.ingredients.toLowerCase().includes(q) ||
          p.origin.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [products, selectedCategory, selectedDietary, inStockOnly, searchQuery]);

  // Cart operations
  const handleAddToCart = (product: Product, quantity = 1) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = Math.min(product.stock_quantity, updated[existingIndex].quantity + quantity);
        updated[existingIndex] = { ...updated[existingIndex], quantity: newQty };
        return updated;
      }
      return [...prev, { product, quantity: Math.min(product.stock_quantity, quantity) }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity: newQty } : item
      )
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleResetFilters = () => {
    setSelectedCategory('cat-all');
    setSelectedDietary('all');
    setInStockOnly(false);
    setSearchQuery('');
  };

  // Order & Payment flow
  const handleOrderCreated = async (order: Order, paymentMethod: PaymentMethod) => {
    setCurrentOrder(order);
    setCurrentPaymentMethod(paymentMethod);

    try {
      const chargeRes = await requestMidtransCharge(order, paymentMethod);
      const snap = (window as any).snap;

      if (chargeRes?.snap_token && snap) {
        snap.pay(chargeRes.snap_token, {
          onSuccess: async (result: any) => {
            console.log('Midtrans Snap payment success:', result);
            await simulateMidtransPayment(order.order_number, 'settlement');
            handlePaymentSuccess({
              ...order,
              payment_status: 'settlement',
              order_status: 'processing',
            });
          },
          onPending: async (result: any) => {
            console.log('Midtrans Snap payment pending:', result);
            handlePaymentSuccess({
              ...order,
              payment_status: 'pending',
              order_status: 'processing',
            });
          },
          onError: (result: any) => {
            console.error('Midtrans Snap payment error:', result);
            alert('Pembayaran Midtrans dibatalkan atau terjadi kendala.');
            setIsMidtransOpen(true);
          },
          onClose: () => {
            console.log('Customer closed Midtrans Snap popup');
            setIsMidtransOpen(true);
          },
        });
        return;
      } else if (chargeRes?.redirect_url) {
        window.location.href = chargeRes.redirect_url;
        return;
      }
    } catch (err) {
      console.warn('Error launching Midtrans Snap popup directly:', err);
    }

    setIsMidtransOpen(true);
  };

  const handlePaymentSuccess = (updatedOrder: Order) => {
    setCurrentOrder(updatedOrder);
    setIsMidtransOpen(false);
    setIsSuccessOpen(true);
    setCartItems([]); // Empty cart upon successful payment
    loadData(); // Refresh product stock
  };

  // Back-Office handlers
  const handleAdminLoginSuccess = (pin: string) => {
    setAdminPin(pin);
    sessionStorage.setItem('eden_admin_pin', pin);
    setIsAdminLoginOpen(false);
    setIsAdminPortalOpen(true);
    window.location.hash = 'admin';
  };

  const handleAdminLogout = () => {
    setAdminPin(null);
    sessionStorage.removeItem('eden_admin_pin');
    setIsAdminPortalOpen(false);
    window.location.hash = '';
  };

  // If in Back-Office mode, render AdminPortal
  if (isAdminPortalOpen && adminPin) {
    return (
      <>
        <AdminPortal
          adminPin={adminPin}
          onLogout={handleAdminLogout}
          onBackToStore={() => {
            setIsAdminPortalOpen(false);
            window.location.hash = '';
          }}
          allProducts={products}
          allCategories={categories}
          onProductsUpdated={loadData}
        />
        <ChatWidget />
      </>
    );
  }

  const totalCartCount = cartItems.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-stone-50/50">
      {/* Navigation */}
      <Navbar
        cartItems={cartItems}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenStrategy={() => setIsStrategyOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Hero Header */}
      <HeroBanner
        onExploreClick={() => {
          document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenStrategy={() => setIsStrategyOpen(true)}
      />

      {/* Catalog & Filter Section */}
      <main id="catalog-section" className="flex-1">
        <FilterBar
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          dietaryTags={Object.values(DIETARY_TAGS)}
          selectedDietary={selectedDietary}
          onSelectDietary={setSelectedDietary}
          inStockOnly={inStockOnly}
          onToggleInStockOnly={setInStockOnly}
          totalFilteredCount={filteredProducts.length}
        />

        {isLoading ? (
          <div className="py-20 text-center text-stone-400">
            <div className="w-8 h-8 border-3 border-eden-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs font-medium">Fetching wholesome foods from Cloudflare Edge...</p>
          </div>
        ) : (
          <ProductGrid
            products={filteredProducts}
            cartItems={cartItems}
            onSelectProduct={setSelectedProduct}
            onAddToCart={handleAddToCart}
            onResetFilters={handleResetFilters}
          />
        )}
      </main>

      {/* Footer */}
      <Footer onOpenStrategy={() => setIsStrategyOpen(true)} />

      {/* AI Customer Service Chat Widget */}
      <ChatWidget />

      {/* Mobile Floating Basket Button */}
      {totalCartCount > 0 && !isCartOpen && (
        <div className="fixed bottom-5 right-5 sm:hidden z-40 animate-bounce">
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2 bg-eden-700 text-white px-4 py-3 rounded-full shadow-xl font-bold text-xs"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Basket ({totalCartCount})</span>
          </button>
        </div>
      )}

      {/* Modals */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        onOrderCreated={handleOrderCreated}
      />

      <MidtransSnapModal
        isOpen={isMidtransOpen}
        order={currentOrder}
        paymentMethod={currentPaymentMethod}
        onClose={() => setIsMidtransOpen(false)}
        onPaymentSuccess={handlePaymentSuccess}
      />

      <OrderSuccessModal
        isOpen={isSuccessOpen}
        order={currentOrder}
        onClose={() => setIsSuccessOpen(false)}
      />

      <BusinessStrategyModal
        isOpen={isStrategyOpen}
        onClose={() => setIsStrategyOpen(false)}
      />

      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onSuccess={handleAdminLoginSuccess}
      />
    </div>
  );
};

export default App;
