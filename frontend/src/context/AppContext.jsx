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

  // Artisan Login Modal open/close state
  const [isArtisanLoginModalOpen, setIsArtisanLoginModalOpen] = useState(false);

  // Cart state persisted in localStorage
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('karakushala_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // UI Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
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

  const addToCart = (product, quantity = 1) => {
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
    setIsCartOpen(true);
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
