import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_ARTISANS } from '../data/mockData';

const AppContext = createContext();

export function AppProvider({ children }) {
  // 'buyer' (Storefront & Catalogue) or 'artisan' (Sell Your Craft / Dashboard)
  const [viewMode, setViewMode] = useState('buyer');

  // Currently logged-in artisan profile (persisted in localStorage)
  const [activeArtisan, setActiveArtisan] = useState(() => {
    try {
      const saved = localStorage.getItem('karakushala_active_artisan');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return null;
  });

  // Currently logged-in buyer/user profile (persisted in localStorage)
  const [activeUser, setActiveUser] = useState(() => {
    try {
      const saved = localStorage.getItem('karakushala_active_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return null;
  });

  // Welcome Role Selector modal open state (shows automatically when opening website if role not yet chosen)
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(() => {
    try {
      const chosen = sessionStorage.getItem('karakushala_role_chosen');
      return !chosen;
    } catch (e) {
      return true;
    }
  });

  // Modals open/close state
  const [isArtisanLoginModalOpen, setIsArtisanLoginModalOpen] = useState(false);
  const [isUserLoginModalOpen, setIsUserLoginModalOpen] = useState(false);
  const [isCustomerCareModalOpen, setIsCustomerCareModalOpen] = useState(false);

  // Cart state persisted in localStorage
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('karakushala_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Customer views: 'shop' | 'my-orders' | 'track-order'
  const [customerView, setCustomerView] = useState('shop');
  const [trackingOrderId, setTrackingOrderId] = useState(null);

  const navigateToOrders = () => {
    setViewMode('buyer');
    setCustomerView('my-orders');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToTrackOrder = (orderId = null) => {
    setViewMode('buyer');
    if (orderId) setTrackingOrderId(orderId);
    setCustomerView('track-order');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToShop = () => {
    setViewMode('buyer');
    setCustomerView('shop');
  };

  // UI Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [orderPopupProduct, setOrderPopupProduct] = useState(null);
  const [isCartBouncing, setIsCartBouncing] = useState(false);
  const [latestOrderReceipt, setLatestOrderReceipt] = useState(null);

  // Audio assistance mode (reads aloud for artisans with low digital literacy)
  const [audioVoiceAssistance, setAudioVoiceAssistance] = useState(false);

  // Toast notifications
  const [toast, setToast] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem('karakushala_cart', JSON.stringify(cart));
    } catch (e) {}
  }, [cart]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const triggerCartAnimation = () => {
    setIsCartBouncing(true);
    setTimeout(() => setIsCartBouncing(false), 900);
  };

  const openOrderPopup = (product) => {
    setOrderPopupProduct(product);
  };

  const closeOrderPopup = () => {
    setOrderPopupProduct(null);
  };

  const addToCart = (product, quantity = 1, openCart = true) => {
    triggerCartAnimation();
    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + quantity;
        if (newQty > product.stockQuantity) {
          showToast(`Only ${product.stockQuantity} items in stock!`, 'warning');
          return prev;
        }
        updated[existingIndex].quantity = newQty;
        return updated;
      } else {
        if (product.stockQuantity <= 0) {
          showToast('Sorry, this craft item is currently sold out.', 'error');
          return prev;
        }
        return [...prev, { product, quantity }];
      }
    });
    showToast(`Added "${product.title}" to your cart!`);
    if (openCart) {
      setIsCartOpen(true);
    }
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
    showToast('Item removed from cart', 'info');
  };

  const updateCartQuantity = (productId, delta) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.product.id === productId) {
          const nextQty = item.quantity + delta;
          if (nextQty <= 0) return null;
          if (nextQty > item.product.stockQuantity) {
            showToast(`Maximum available stock is ${item.product.stockQuantity}`, 'warning');
            return item;
          }
          return { ...item, quantity: nextQty };
        }
        return item;
      }).filter(Boolean);
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((acc, curr) => acc + curr.quantity, 0);
  const cartSubtotal = cart.reduce((acc, curr) => acc + (curr.product.price * curr.quantity), 0);

  // Helper function to format INR currency
  const formatINR = (num) => {
    if (num === undefined || num === null) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(num);
  };

  const openArtisanLogin = () => setIsArtisanLoginModalOpen(true);
  const closeArtisanLogin = () => setIsArtisanLoginModalOpen(false);

  const loginArtisan = (artisan, token = null) => {
    setActiveArtisan(artisan);
    try {
      localStorage.setItem('karakushala_active_artisan', JSON.stringify(artisan));
      if (token) {
        localStorage.setItem('karakushala_artisan_token', token);
      }
    } catch (e) {}
    setIsArtisanLoginModalOpen(false);
    setViewMode('artisan');
    showToast(`ನಮಸ್ಕಾರ, ${artisan.name}! Welcome to your Artisan Portal.`, 'success');

    if ('speechSynthesis' in window && audioVoiceAssistance) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(`ನಮಸ್ಕಾರ ${artisan.name}. ಕಲಾಕಾರರ ಖಾತೆಗೆ ಯಶಸ್ವಿಯಾಗಿ ಲಾಗಿನ್ ಆಗಿದ್ದೀರಿ.`);
      u.lang = 'kn-IN';
      window.speechSynthesis.speak(u);
    }
  };

  const logoutArtisan = () => {
    setActiveArtisan(null);
    try {
      localStorage.removeItem('karakushala_active_artisan');
      localStorage.removeItem('karakushala_artisan_token');
    } catch (e) {}
    setViewMode('buyer');
    showToast('Logged out of Artisan Portal (ಕಲಾಕಾರ ಖಾತೆಯಿಂದ ನಿರ್ಗಮಿಸಲಾಗಿದೆ)', 'info');
  };

  const switchArtisan = (artisan) => {
    setActiveArtisan(artisan);
    try {
      localStorage.setItem('karakushala_active_artisan', JSON.stringify(artisan));
    } catch (e) {}
    showToast(`Switched active profile to ${artisan.name}`, 'info');
  };

  const isArtisanLoggedIn = Boolean(activeArtisan);

  // User / Buyer Authentication handlers
  const openUserLogin = () => setIsUserLoginModalOpen(true);
  const closeUserLogin = () => setIsUserLoginModalOpen(false);

  const loginUser = (user, token = null) => {
    setActiveUser(user);
    try {
      localStorage.setItem('karakushala_active_user', JSON.stringify(user));
      if (token) {
        localStorage.setItem('karakushala_user_token', token);
      }
    } catch (e) {}
    setIsUserLoginModalOpen(false);
    showToast(`Welcome back, ${user.name}! Signed in successfully.`, 'success');
  };

  const logoutUser = () => {
    setActiveUser(null);
    try {
      localStorage.removeItem('karakushala_active_user');
      localStorage.removeItem('karakushala_user_token');
    } catch (e) {}
    showToast('Signed out of Buyer account', 'info');
  };

  const isUserLoggedIn = Boolean(activeUser);

  // Welcome Role selection handlers
  const openWelcomeModal = () => setIsWelcomeModalOpen(true);
  const closeWelcomeModal = () => setIsWelcomeModalOpen(false);

  const selectRole = (role) => {
    try {
      sessionStorage.setItem('karakushala_role_chosen', role);
    } catch (e) {}
    setIsWelcomeModalOpen(false);
    setViewMode(role);
  };

  // Customer Care modal handlers
  const openCustomerCare = () => setIsCustomerCareModalOpen(true);
  const closeCustomerCare = () => setIsCustomerCareModalOpen(false);

  return (
    <AppContext.Provider
      value={{
        viewMode,
        setViewMode,
        activeArtisan,
        setActiveArtisan,
        isArtisanLoggedIn,
        isArtisanLoginModalOpen,
        setIsArtisanLoginModalOpen,
        openArtisanLogin,
        closeArtisanLogin,
        loginArtisan,
        logoutArtisan,
        switchArtisan,
        activeUser,
        setActiveUser,
        isUserLoggedIn,
        isUserLoginModalOpen,
        setIsUserLoginModalOpen,
        openUserLogin,
        closeUserLogin,
        loginUser,
        logoutUser,
        isWelcomeModalOpen,
        setIsWelcomeModalOpen,
        openWelcomeModal,
        closeWelcomeModal,
        selectRole,
        isCustomerCareModalOpen,
        setIsCustomerCareModalOpen,
        openCustomerCare,
        closeCustomerCare,
        customerView,
        setCustomerView,
        trackingOrderId,
        setTrackingOrderId,
        navigateToOrders,
        navigateToTrackOrder,
        navigateToShop,
        cart,
        cartCount,
        cartSubtotal,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        selectedProduct,
        setSelectedProduct,
        orderPopupProduct,
        setOrderPopupProduct,
        openOrderPopup,
        closeOrderPopup,
        isCartBouncing,
        triggerCartAnimation,
        latestOrderReceipt,
        setLatestOrderReceipt,
        audioVoiceAssistance,
        setAudioVoiceAssistance,
        toast,
        showToast,
        formatINR
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
