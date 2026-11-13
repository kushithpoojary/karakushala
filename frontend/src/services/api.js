import { MOCK_PRODUCTS, MOCK_ARTISANS, MOCK_ORDERS, MOCK_BUYERS } from '../data/mockData';

const BASE_URL = '/api';

// Local storage keys for persistent offline/fallback state
const STORAGE_PRODUCTS_KEY = 'karakushala_products_cache';
const STORAGE_ORDERS_KEY = 'karakushala_orders_cache';

// Initialize localStorage if needed
function getStoredProducts() {
  try {
    const raw = localStorage.getItem(STORAGE_PRODUCTS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return [...MOCK_PRODUCTS];
}

function saveStoredProducts(products) {
  try {
    localStorage.setItem(STORAGE_PRODUCTS_KEY, JSON.stringify(products));
  } catch (e) {}
}

function getStoredOrders() {
  try {
    const raw = localStorage.getItem(STORAGE_ORDERS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return [...MOCK_ORDERS];
}

function saveStoredOrders(orders) {
  try {
    localStorage.setItem(STORAGE_ORDERS_KEY, JSON.stringify(orders));
  } catch (e) {}
}

export const api = {
  // GET /api/products
  async getProducts(params = {}) {
    try {
      const query = new URLSearchParams();
      if (params.category && params.category !== 'All Crafts') query.append('category', params.category);
      if (params.artisanId) query.append('artisanId', params.artisanId);

      const url = `${BASE_URL}/products${query.toString() ? '?' + query.toString() : ''}`;
      const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          saveStoredProducts(json.data);
          return json.data;
        }
      }
    } catch (err) {
      console.warn('Backend /api/products unreachable, utilizing resilient local state:', err.message);
    }

    // Fallback
    let list = getStoredProducts();
    if (params.category && params.category !== 'All Crafts') {
      list = list.filter(p => p.category.toLowerCase().includes(params.category.toLowerCase()));
    }
    if (params.artisanId) {
      list = list.filter(p => p.artisanId === params.artisanId);
    }
    return list;
  },

  // GET /api/products/:id
  async getProductById(id) {
    try {
      const res = await fetch(`${BASE_URL}/products/${id}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) return json.data;
      }
    } catch (err) {
      console.warn('Backend /api/products/:id fallback:', err.message);
    }

    const list = getStoredProducts();
    return list.find(p => p.id === id) || null;
  },

  // POST /api/products
  async createProduct(formDataOrJson) {
    let isFormData = formDataOrJson instanceof FormData;
    try {
      const options = {
        method: 'POST',
        headers: isFormData ? {} : { 'Content-Type': 'application/json' },
        body: isFormData ? formDataOrJson : JSON.stringify(formDataOrJson)
      };

      const res = await fetch(`${BASE_URL}/products`, options);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          // Update local cache as well
          const current = getStoredProducts();
          saveStoredProducts([json.data, ...current]);
          return json.data;
        }
      }
    } catch (err) {
      console.warn('Backend /api/products POST fallback:', err.message);
    }

    // Fallback: create locally
    let payload = formDataOrJson;
    if (isFormData) {
      payload = {
        title: formDataOrJson.get('title'),
        category: formDataOrJson.get('category'),
        price: Number(formDataOrJson.get('price')),
        stockQuantity: Number(formDataOrJson.get('stockQuantity')) || 5,
        artisanId: formDataOrJson.get('artisanId') || 'artisan_kasuti_1',
        imageUrl: formDataOrJson.get('imageUrl') || 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=800&q=80',
        craftStory: {
          hoursSpent: Number(formDataOrJson.get('hoursSpent')) || 24,
          materialsUsed: formDataOrJson.get('materialsUsed') || 'Organic cotton and natural vegetable dyes',
          culturalSignificance: formDataOrJson.get('culturalSignificance') || 'Karnataka traditional motif',
          provenanceLocation: formDataOrJson.get('provenanceLocation') || 'Karnataka, India'
        }
      };
    }

    const artisan = MOCK_ARTISANS.find(a => a.id === payload.artisanId) || MOCK_ARTISANS[0];
    const newProd = {
      id: `prod_${Date.now()}`,
      artisanId: artisan.id,
      title: payload.title,
      category: payload.category,
      price: Number(payload.price),
      stockQuantity: Number(payload.stockQuantity) || 5,
      images: [payload.imageUrl || payload.images?.[0] || 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=800&q=80'],
      craftStory: payload.craftStory || {
        hoursSpent: 24,
        materialsUsed: 'Handspun organic cotton, naturally dyed threads',
        culturalSignificance: 'Traditional motif celebrating Karnataka cultural heritage',
        provenanceLocation: 'Karnataka, India'
      },
      artisan
    };

    const current = getStoredProducts();
    const updated = [newProd, ...current];
    saveStoredProducts(updated);
    return newProd;
  },

  // DELETE /api/products/:id
  async deleteProduct(id) {
    try {
      const res = await fetch(`${BASE_URL}/products/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        const json = await res.json();
        const current = getStoredProducts();
        const filtered = current.filter(p => p.id !== id);
        saveStoredProducts(filtered);
        return json;
      }
    } catch (err) {
      console.warn('Backend DELETE /api/products/:id fallback:', err.message);
    }

    // Fallback: delete locally
    const current = getStoredProducts();
    const filtered = current.filter(p => p.id !== id);
    saveStoredProducts(filtered);
    return { success: true, message: 'Deleted locally' };
  },

  // GET /api/artisans
  async getArtisans() {
    try {
      const res = await fetch(`${BASE_URL}/artisans`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) return json.data;
      }
    } catch (err) {
      console.warn('Backend /api/artisans fallback:', err.message);
    }
    return [...MOCK_ARTISANS];
  },

  // POST /api/artisans/send-otp
  async sendArtisanOtp(phone) {
    try {
      const res = await fetch(`${BASE_URL}/artisans/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error?.message || 'Failed to send OTP to mobile number');
      }
      return json;
    } catch (err) {
      // Offline / fallback check against mock artisans
      const cleanInput = phone.toString().replace(/\D/g, '').slice(-10);
      const match = MOCK_ARTISANS.find(a => a.phone.replace(/\D/g, '').slice(-10) === cleanInput);
      if (match) {
        return {
          success: true,
          message: `OTP sent successfully to registered mobile ${match.phone}.`,
          demoOtp: '1234',
          data: match
        };
      }
      throw err;
    }
  },

  // POST /api/artisans/login
  async loginArtisan({ phone, otp, artisanId }) {
    try {
      const res = await fetch(`${BASE_URL}/artisans/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp, artisanId })
      });
      const json = await res.json();
      if (!res.ok) {
        const error = new Error(json.error?.message || 'Artisan login failed');
        error.requiresRegistration = json.error?.requiresRegistration;
        throw error;
      }
      return json;
    } catch (err) {
      if (err.requiresRegistration) throw err;
      // Fallback against mock data
      let artisan = null;
      if (artisanId) {
        artisan = MOCK_ARTISANS.find(a => a.id === artisanId);
      } else if (phone) {
        const cleanInput = phone.toString().replace(/\D/g, '').slice(-10);
        artisan = MOCK_ARTISANS.find(a => a.phone.replace(/\D/g, '').slice(-10) === cleanInput);
      }
      if (artisan) {
        return {
          success: true,
          message: `Namaskara, ${artisan.name}! Logged in successfully.`,
          token: `artisan_jwt_${artisan.id}_${Date.now()}`,
          data: artisan
        };
      }
      throw err;
    }
  },

  // POST /api/artisans (Registration)
  async registerArtisan(artisanData) {
    try {
      const res = await fetch(`${BASE_URL}/artisans`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(artisanData)
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error?.message || 'Artisan registration failed');
      }
      return json;
    } catch (err) {
      console.warn('Backend /api/artisans registration fallback:', err.message);
      const newArtisan = {
        id: `artisan_${Date.now()}`,
        name: artisanData.name,
        kannadaName: artisanData.kannadaName || '',
        phone: artisanData.phone,
        village: artisanData.village,
        craftSpecialty: artisanData.craftSpecialty || 'Kasuti',
        bio: artisanData.bio || '',
        yearsOfExperience: Number(artisanData.yearsOfExperience) || 5,
        profileImage: artisanData.profileImage || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
        createdAt: new Date().toISOString()
      };
      return {
        success: true,
        message: 'Artisan profile registered successfully!',
        token: `artisan_jwt_${newArtisan.id}_${Date.now()}`,
        data: newArtisan
      };
    }
  },

  // --- BUYER / USER AUTHENTICATION METHODS ---
  async sendUserOtp(phone) {
    try {
      const res = await fetch(`${BASE_URL}/users/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message || 'Failed to send OTP to mobile number');
      return json;
    } catch (err) {
      const cleanInput = phone.toString().replace(/\D/g, '').slice(-10);
      const match = MOCK_BUYERS.find(b => b.phone.replace(/\D/g, '').slice(-10) === cleanInput);
      return {
        success: true,
        message: `OTP sent successfully to registered mobile ${phone}.`,
        demoOtp: '1234',
        data: match || null
      };
    }
  },

  async loginUserWithPhone({ phone, otp, name }) {
    try {
      const res = await fetch(`${BASE_URL}/users/phone-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp, name })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message || 'Buyer login failed');
      return json;
    } catch (err) {
      const cleanInput = phone.toString().replace(/\D/g, '').slice(-10);
      let buyer = MOCK_BUYERS.find(b => b.phone.replace(/\D/g, '').slice(-10) === cleanInput);
      if (!buyer) {
        buyer = {
          id: `buyer_${Date.now()}`,
          name: name || `Craft Buyer (${cleanInput.slice(-4)})`,
          phone: `+91 ${cleanInput}`,
          email: `${cleanInput}@buyer.karakushala.in`,
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
          city: 'Karnataka, India',
          address: 'Bengaluru, Karnataka'
        };
      }
      return {
        success: true,
        message: `Welcome, ${buyer.name}!`,
        token: `user_jwt_${buyer.id}_${Date.now()}`,
        data: buyer
      };
    }
  },

  async loginUserWithGoogle(googleData = {}) {
    try {
      const res = await fetch(`${BASE_URL}/users/google-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(googleData)
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message || 'Google login failed');
      return json;
    } catch (err) {
      const email = googleData.email || 'ananya.rao@gmail.com';
      let buyer = MOCK_BUYERS.find(b => b.email.toLowerCase() === email.toLowerCase());
      if (!buyer) {
        buyer = {
          id: `buyer_google_${Date.now()}`,
          name: googleData.name || (email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1)),
          email,
          phone: googleData.phone || '+91 98801 23456',
          avatar: googleData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
          city: 'Bengaluru, Karnataka',
          address: 'Indiranagar, Bengaluru, Karnataka - 560038'
        };
      }
      return {
        success: true,
        message: `Welcome, ${buyer.name}! Signed in with Google.`,
        token: `google_jwt_${buyer.id}_${Date.now()}`,
        data: buyer
      };
    }
  },

  // GET /api/artisans/:id/dashboard
  async getArtisanDashboard(artisanId) {
    try {
      const res = await fetch(`${BASE_URL}/artisans/${artisanId}/dashboard`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) return json.data;
      }
    } catch (err) {
      console.warn('Backend /api/artisans/:id/dashboard fallback:', err.message);
    }

    // Fallback computation
    const artisan = MOCK_ARTISANS.find(a => a.id === artisanId) || MOCK_ARTISANS[0];
    const products = getStoredProducts().filter(p => p.artisanId === artisanId);
    const orders = getStoredOrders();

    const artisanProdIds = new Set(products.map(p => p.id));
    const artisanOrders = [];
    for (const order of orders) {
      const items = (order.items || []).filter(i => artisanProdIds.has(i.productId));
      if (items.length > 0) {
        artisanOrders.push({
          ...order,
          artisanItems: items,
          artisanSubtotal: items.reduce((sum, item) => sum + (item.priceAtPurchase * item.quantity), 0)
        });
      }
    }

    const totalEarnings = artisanOrders.reduce((sum, o) => sum + (o.artisanSubtotal || 0), 0);

    return {
      artisan,
      metrics: {
        totalProducts: products.length,
        totalOrders: artisanOrders.length,
        pendingOrdersCount: artisanOrders.filter(o => o.orderStatus === 'Accepted' || o.orderStatus === 'Pending').length,
        completedOrdersCount: artisanOrders.filter(o => o.orderStatus === 'Delivered').length,
        totalEarningsINR: totalEarnings
      },
      products,
      orders: artisanOrders
    };
  },

  // POST /api/orders
  async createOrder(orderPayload) {
    try {
      const res = await fetch(`${BASE_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          // Update local cache
          const currentOrders = getStoredOrders();
          saveStoredOrders([json.data.order, ...currentOrders]);
          return json.data;
        }
      }
    } catch (err) {
      console.warn('Backend /api/orders fallback:', err.message);
    }

    // Fallback: create mock order and decrement local stock
    const products = getStoredProducts();
    const orderNumber = `KK-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Decrement stock in local cache
    for (const cartItem of orderPayload.items) {
      const prod = products.find(p => p.id === (cartItem.productId || cartItem.id));
      if (prod) {
        prod.stockQuantity = Math.max(0, prod.stockQuantity - (cartItem.quantity || 1));
      }
    }
    saveStoredProducts(products);

    const newOrder = {
      id: `order_${Date.now()}`,
      orderNumber,
      buyerName: orderPayload.buyerName,
      buyerPhone: orderPayload.buyerPhone,
      shippingAddress: orderPayload.shippingAddress,
      items: orderPayload.items.map(i => ({
        productId: i.productId || i.id,
        title: i.title,
        quantity: i.quantity || 1,
        priceAtPurchase: i.priceAtPurchase || i.price
      })),
      totalAmount: orderPayload.totalAmount,
      paymentMethod: orderPayload.paymentMethod || 'Mock UPI',
      paymentStatus: 'Paid - Mock',
      orderStatus: 'Accepted',
      createdAt: new Date().toISOString()
    };

    const currentOrders = getStoredOrders();
    saveStoredOrders([newOrder, ...currentOrders]);

    const receipt = {
      transactionId: `TXN-UPI-${Date.now()}-${Math.floor(Math.random() * 8999 + 1000)}`,
      paymentGateway: 'KaraKushala Direct Artisan UPI Gateway',
      paidAmountINR: orderPayload.totalAmount,
      paymentStatus: 'SUCCESS',
      paidAt: new Date().toISOString(),
      fairArtisanShareINR: Math.round(orderPayload.totalAmount * 0.88),
      platformFeeINR: 0
    };

    return { order: newOrder, receipt };
  },

  // PATCH /api/orders/:id/status
  async updateOrderStatus(orderId, status) {
    try {
      const res = await fetch(`${BASE_URL}/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          const orders = getStoredOrders();
          const idx = orders.findIndex(o => o.id === orderId || o.orderNumber === orderId);
          if (idx !== -1) {
            orders[idx] = json.data;
            saveStoredOrders(orders);
          }
          return json.data;
        }
      }
    } catch (err) {
      console.warn('Backend PATCH /api/orders/:id/status fallback:', err.message);
    }

    // Fallback
    const orders = getStoredOrders();
    const idx = orders.findIndex(o => o.id === orderId || o.orderNumber === orderId);
    if (idx !== -1) {
      orders[idx].orderStatus = status;
      orders[idx].updatedAt = new Date().toISOString();
      saveStoredOrders(orders);
      return orders[idx];
    }
    throw new Error('Order not found in state');
  }
};
