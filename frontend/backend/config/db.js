const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DB_FILE = path.join(DATA_DIR, 'karakushala_db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// In-memory cache + persistent file synchronization
let dbCache = {
  artisans: [],
  products: [],
  orders: []
};

function loadDatabase() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      dbCache = JSON.parse(raw);
    } else {
      saveDatabase();
    }
  } catch (err) {
    console.error('Error loading local DB file, initializing fresh:', err.message);
    saveDatabase();
  }
}

function saveDatabase() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(dbCache, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to persist DB to file:', err.message);
  }
}

// Initialize on boot
loadDatabase();

// Helper to generate IDs
const generateId = (prefix = 'id') => `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;

// Model-like API wrappers
const ArtisanModel = {
  find: async (query = {}) => {
    let list = [...dbCache.artisans];
    if (query.craftSpecialty) {
      list = list.filter(a => a.craftSpecialty.toLowerCase() === query.craftSpecialty.toLowerCase());
    }
    if (query.village) {
      list = list.filter(a => a.village.toLowerCase() === query.village.toLowerCase());
    }
    return list;
  },

  findById: async (id) => {
    return dbCache.artisans.find(a => a.id === id || a._id === id) || null;
  },

  findOne: async (query = {}) => {
    return dbCache.artisans.find(a => {
      for (const key of Object.keys(query)) {
        if (a[key] !== query[key]) return false;
      }
      return true;
    }) || null;
  },

  create: async (data) => {
    const item = {
      id: data.id || generateId('artisan'),
      name: data.name,
      phone: data.phone,
      village: data.village,
      craftSpecialty: data.craftSpecialty, // Enum: 'Kasuti', 'Beedu', 'Coastal'
      bio: data.bio || '',
      yearsOfExperience: Number(data.yearsOfExperience) || 0,
      profileImage: data.profileImage || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
      createdAt: new Date().toISOString()
    };
    dbCache.artisans.push(item);
    saveDatabase();
    return item;
  },

  countDocuments: async () => dbCache.artisans.length,

  clear: async () => {
    dbCache.artisans = [];
    saveDatabase();
  }
};

const ProductModel = {
  find: async (query = {}, options = { populateArtisan: true }) => {
    let list = [...dbCache.products];
    if (query.category) {
      list = list.filter(p => p.category.toLowerCase().includes(query.category.toLowerCase()));
    }
    if (query.artisanId) {
      list = list.filter(p => p.artisanId === query.artisanId);
    }
    if (query.inStock === true) {
      list = list.filter(p => p.stockQuantity > 0);
    }

    if (options.populateArtisan) {
      list = list.map(p => {
        const artisan = dbCache.artisans.find(a => a.id === p.artisanId || a._id === p.artisanId);
        return {
          ...p,
          artisan: artisan || null
        };
      });
    }

    return list;
  },

  findById: async (id, options = { populateArtisan: true }) => {
    const p = dbCache.products.find(item => item.id === id || item._id === id);
    if (!p) return null;
    if (options.populateArtisan) {
      const artisan = dbCache.artisans.find(a => a.id === p.artisanId || a._id === p.artisanId);
      return {
        ...p,
        artisan: artisan || null
      };
    }
    return { ...p };
  },

  create: async (data) => {
    const item = {
      id: data.id || generateId('prod'),
      artisanId: data.artisanId,
      title: data.title,
      category: data.category,
      price: Number(data.price),
      stockQuantity: Number(data.stockQuantity) >= 0 ? Number(data.stockQuantity) : 10,
      images: Array.isArray(data.images) && data.images.length > 0
        ? data.images
        : [data.imageUrl || 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=800&q=80'],
      craftStory: {
        hoursSpent: data.craftStory?.hoursSpent || 24,
        materialsUsed: data.craftStory?.materialsUsed || 'Organic cotton and natural vegetable dyes',
        culturalSignificance: data.craftStory?.culturalSignificance || 'Handcrafted traditional motif inspired by Karnataka heritage',
        provenanceLocation: data.craftStory?.provenanceLocation || 'Karnataka, India'
      },
      createdAt: new Date().toISOString()
    };

    dbCache.products.push(item);
    saveDatabase();

    // Return populated version
    const artisan = dbCache.artisans.find(a => a.id === item.artisanId);
    return {
      ...item,
      artisan: artisan || null
    };
  },

  findByIdAndUpdate: async (id, update) => {
    const idx = dbCache.products.findIndex(p => p.id === id || p._id === id);
    if (idx === -1) return null;

    dbCache.products[idx] = {
      ...dbCache.products[idx],
      ...update,
      craftStory: {
        ...dbCache.products[idx].craftStory,
        ...(update.craftStory || {})
      }
    };
    saveDatabase();
    return dbCache.products[idx];
  },

  decrementStock: async (id, quantity) => {
    const idx = dbCache.products.findIndex(p => p.id === id || p._id === id);
    if (idx === -1) throw new Error(`Product ${id} not found`);
    if (dbCache.products[idx].stockQuantity < quantity) {
      throw new Error(`Insufficient stock for product "${dbCache.products[idx].title}". Available: ${dbCache.products[idx].stockQuantity}, Requested: ${quantity}`);
    }
    dbCache.products[idx].stockQuantity -= quantity;
    saveDatabase();
    return dbCache.products[idx];
  },

  countDocuments: async () => dbCache.products.length,

  clear: async () => {
    dbCache.products = [];
    saveDatabase();
  }
};

const OrderModel = {
  find: async (query = {}) => {
    let list = [...dbCache.orders];
    if (query.orderStatus) {
      list = list.filter(o => o.orderStatus.toLowerCase() === query.orderStatus.toLowerCase());
    }
    // Sort newest first
    list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return list;
  },

  findByArtisanId: async (artisanId) => {
    // Return all orders containing items belonging to this artisan
    const artisanProducts = dbCache.products.filter(p => p.artisanId === artisanId);
    const artisanProdIds = new Set(artisanProducts.map(p => p.id));

    const ordersForArtisan = [];
    for (const order of dbCache.orders) {
      const matchingItems = order.items.filter(item => artisanProdIds.has(item.productId));
      if (matchingItems.length > 0) {
        ordersForArtisan.push({
          ...order,
          artisanItems: matchingItems,
          artisanSubtotal: matchingItems.reduce((acc, curr) => acc + (curr.priceAtPurchase * curr.quantity), 0)
        });
      }
    }
    // Sort newest first
    ordersForArtisan.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return ordersForArtisan;
  },

  findById: async (id) => {
    return dbCache.orders.find(o => o.id === id || o._id === id || o.orderNumber === id) || null;
  },

  create: async (data) => {
    const orderNum = `KK-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const item = {
      id: data.id || generateId('order'),
      orderNumber: data.orderNumber || orderNum,
      buyerName: data.buyerName,
      buyerPhone: data.buyerPhone,
      shippingAddress: data.shippingAddress,
      items: (data.items || []).map(i => ({
        productId: i.productId,
        title: i.title,
        quantity: Number(i.quantity) || 1,
        priceAtPurchase: Number(i.priceAtPurchase || i.price)
      })),
      totalAmount: Number(data.totalAmount),
      paymentMethod: data.paymentMethod || 'Mock UPI (GPay / PhonePe)',
      paymentStatus: data.paymentStatus || 'Paid - Mock',
      orderStatus: data.orderStatus || 'Accepted', // Enum: 'Pending', 'Accepted', 'Shipped', 'Delivered'
      createdAt: data.createdAt || new Date().toISOString()
    };

    dbCache.orders.push(item);
    saveDatabase();
    return item;
  },

  findByIdAndUpdateStatus: async (id, newStatus) => {
    const validStatuses = ['Pending', 'Accepted', 'Shipped', 'Delivered'];
    const matchedStatus = validStatuses.find(s => s.toLowerCase() === newStatus.toLowerCase());
    if (!matchedStatus) {
      throw new Error(`Invalid status "${newStatus}". Must be one of: ${validStatuses.join(', ')}`);
    }

    const idx = dbCache.orders.findIndex(o => o.id === id || o._id === id || o.orderNumber === id);
    if (idx === -1) return null;

    dbCache.orders[idx].orderStatus = matchedStatus;
    dbCache.orders[idx].updatedAt = new Date().toISOString();
    saveDatabase();
    return dbCache.orders[idx];
  },

  countDocuments: async () => dbCache.orders.length,

  clear: async () => {
    dbCache.orders = [];
    saveDatabase();
  }
};

module.exports = {
  Artisan: ArtisanModel,
  Product: ProductModel,
  Order: OrderModel,
  loadDatabase,
  saveDatabase
};
