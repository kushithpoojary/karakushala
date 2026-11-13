# KaraKushala (ಕರಕುಶಲ) — Direct-to-Consumer Heritage Artisan Marketplace

> **Empowering rural Karnataka artisans specializing in centuries-old Kasuti embroidery, sacred coastal Beedu palm-lattice craft, and coastal wood & shell handicrafts.**

---

## 🌟 Overview

**KaraKushala** (ಕರಕುಶಲ — "Handcrafted Skill") is a responsive, direct-to-consumer digital marketplace connecting master artisans across Karnataka—from the Chalukyan weaving enclaves of **Dharwad** to the Daiva Aradhane coastal palm weavers of **Udupi** and woodcarvers of **Uttara Kannada**—directly with art connoisseurs worldwide.

By cutting out exploitative middleman commissions, **over 88% of every purchase flows directly into rural artisan household accounts**.

---

## 🎨 Key Features

### 1. Buyer Storefront & Catalogue (Home)
- **Heritage Hero Banner**: Celebrates living Karnataka craft traditions with live impact metrics (88%+ direct artisan share, GI provenance).
- **Earthy Karnataka Aesthetic**: Warm terracotta, unbleached handloom cream/off-white, deep indigo, and mustard gold palette.
- **Craft Category Filter Pills**:
  - `All Crafts`
  - `Kasuti Embroidery` (Navalgund & Dharwad thread-counted needlework)
  - `Beedu Craft` (Sacred palm-leaf & wild cane lattice weaving of coastal Udupi)
  - `Coastal Wood & Shell` (Sea-tumbled driftwood, polished coconut shell & brass accents)
- **Product Grid Cards**: High-res imagery, artisan profile badge & village origin, price in ₹, hours spent handcrafting badge, stock status, and direct craft story links.

### 2. Product Detail & Craft-Storytelling View
- **Provenance & Craft Story Card**:
  - Full artisan biography, village origin, and years of experience.
  - Hours taken to handcraft (e.g. 72 hours of thread-counted stitching).
  - Materials and natural vegetable dyes used.
  - Cultural significance of motifs (e.g. Badami cave temple chariots, Bootha Kola ritual dance canopies).
- **Interactive Audio Story Player UI**:
  - Live narration player with animated sound wave bars.
  - Uses Web Speech API with regional speech synthesis to justify premium artisan pricing.
- **Transparent Fair Price Breakdown**:
  - 82% Direct Artisan Fair Wage (ಕಲಾಕಾರರ ಪಾಲು).
  - 13% Ethical Raw Materials & Natural Dyes.
  - 5% Eco-Packaging & Insured Courier.

### 3. Artisan Authentication & Login Portal (ಕಲಾಕಾರರ ಲಾಗಿನ್)
- **Engineered for Karnataka Artisans & Low Digital Literacy**:
  - **Mobile Phone + OTP Login**: Fast login using 10-digit registered mobile numbers with SMS OTP verification (`1234` demo testing OTP).
  - **1-Click Quick Demo Login**: Instant one-click authentication as Karnataka master artisans (Parvati Bai Deshpande - Kasuti, Ganesh Devadiga - Beedu, Kavita Naik - Coastal).
  - **New Artisan Registration**: Onboarding form for rural artisans to register their name, mobile, village/district, craft specialty, and generational bio.
  - **Audio Guidance in Kannada**: Web Speech API audio assistance reading login instructions aloud in Kannada (`ಧ್ವನಿ ಸಹಾಯ`).
  - **Persistent Session State**: Secure session storage with active status indicators, account switching, and logout controls.

### 4. Simple Artisan Dashboard ('Sell Your Craft' Mode)
- **Engineered for Low Digital Literacy**:
  - Large tactile touch targets, visual icons, and dual English + Kannada greetings (`ನಮಸ್ಕಾರ`).
  - One-tap audio guidance assistant that reads dashboard instructions aloud in Kannada.
  - Switch active artisan demo profile (`Parvati Bai`, `Ganesh Devadiga`, `Kavita Naik`).
  - High-contrast visual metrics (Total Earnings ₹, Active Crafts, Orders to Pack).
- **3-Step Guided Listing Form with Full Voice Audio Input**:
  - **Speech-to-Text on Every Field**: Dedicated `🎙️ Voice (ಧ್ವನಿ)` buttons next to Craft Type, Title, Price, Quantity, Hours Spent, Provenance Location, Materials, and Cultural Story Description.
  - **Spoken Numbers & Prices**: Understands spoken pricing (e.g., *"two thousand four hundred"* or *"2400"*) and auto-populates numbers.
  - **Audio Confirmation**: Speaks out loud confirmation (*"Recorded: [value]"*) in Indian English and Kannada so artisans with low digital literacy don't need to read or type.
  - **1-Tap Pre-Filled Templates**: Fast auto-fill for Temple Gopuram, Daiva Aradhane Lattice, and Kadalina Ale.
- **Incoming Orders List**:
  - Clean cards showing buyer name, phone, shipping address, ordered craft items.
  - **One-Tap Order Status Updates**:
    - `Mark as Ready / Shipped (ರವಾನಿಸಲಾಗಿದೆ)` -> `Mark as Delivered (ತಲುಪಿದೆ)`.
    - Instant live API sync via `PATCH /api/orders/:id/status`.

### 5. Cart & Mocked Checkout Flow
- **Slide-Over Cart Drawer**: Quantity adjustment (+ / - / remove), free insured courier threshold meter, and total direct artisan contribution summary.
- **Mocked Checkout Modal**:
  - Buyer name, phone, and Karnataka address fields.
  - Payment selector: Mocked UPI (Google Pay, PhonePe, Paytm, BHIM) or Cash on Delivery (COD).
  - Interactive Mocked UPI QR Code preview.
  - **Payment Confirmation Screen**: Real-time stock decrement, order number generation (`KK-2026-XXXX`), mock transaction ID receipt, and direct fair artisan share receipt.

---

## 🏗️ Architecture & Tech Stack

```
kalasethu/
├── backend/
│   ├── config/
│   │   └── db.js            # Persistent JSON file-backed database layer with Mongoose API
│   ├── models/
│   │   ├── Artisan.js       # Artisan Model
│   │   ├── Product.js       # Product Model
│   │   └── Order.js         # Order Model
│   ├── routes/
│   │   ├── productRoutes.js # GET /api/products, GET /api/products/:id, POST /api/products
│   │   ├── artisanRoutes.js # GET /api/artisans, POST /send-otp, POST /login, GET /me, POST /
│   │   └── orderRoutes.js   # POST /api/orders, PATCH /api/orders/:id/status
│   ├── middleware/
│   │   ├── upload.js        # Multer image upload middleware
│   │   └── errorHandler.js  # Clean JSON error responses
│   ├── seed.js              # Database seeder (3 Karnataka artisans, 9 rich products, 2 demo orders)
│   ├── test-endpoints.js    # Automated test suite asserting all 13 RESTful API endpoints
│   └── server.js            # Express server (CORS, Morgan, Static uploads, SPA fallback)
├── frontend/
│   ├── src/
│   │   ├── components/      # UI components (Hero, Navbar, ProductCard, DetailModal, Dashboard...)
│   │   ├── context/         # AppContext (Cart, role toggle, currency formatters)
│   │   ├── data/            # 8 pre-populated authentic Karnataka craft products & mock data
│   │   └── services/api.js  # Resilient API service with live backend connection + fallback
│   ├── tailwind.config.js   # Earthy Karnataka palette (terracotta, indigo, cream, mustard)
│   └── vite.config.js       # Vite dev server + proxy to backend
└── package.json             # Root monorepo scripts
```

---

## 🗄️ Database Schemas & Models

### 1. `Artisan` Schema
| Field | Type | Description |
|---|---|---|
| `id` | String | Unique ID (e.g. `artisan_kasuti_1`) |
| `name` | String | Artisan's full name (e.g. "Parvati Bai Deshpande") |
| `phone` | String | Contact phone number |
| `village` | String | Village/district (e.g. "Navalgund, Dharwad District") |
| `craftSpecialty` | Enum | `'Kasuti'` \| `'Beedu'` \| `'Coastal'` |
| `bio` | String | Multi-generational craft history and cooperative details |
| `yearsOfExperience`| Number | Years practicing the craft (e.g. 28) |
| `profileImage` | String | Image URL of the artisan |

### 2. `Product` Schema
| Field | Type | Description |
|---|---|---|
| `id` | String | Unique product identifier (e.g. `prod_kasuti_saree`) |
| `artisanId` | Reference | Reference to `Artisan.id` |
| `title` | String | Title (e.g. "Kasuti Temple Gopuram Handwoven Ilkal Saree") |
| `category` | String | Category ("Kasuti Embroidery", "Beedu Craft", etc.) |
| `price` | Number | Price in INR (₹) |
| `stockQuantity` | Number | Available inventory units (decremented on purchase) |
| `images` | Array[String]| URLs of craft photos |
| `craftStory` | Object (Embedded) | Provenance & Story details: |
| ↳ `hoursSpent` | Number | Hours of manual labor (e.g. 72) |
| ↳ `materialsUsed` | String | E.g. "Pure Mulberry silk, handloom Ilkal cotton, vegetable dye" |
| ↳ `culturalSignificance` | String | E.g. "Temple Gopura motifs from 7th-century Aihole caves" |
| ↳ `provenanceLocation` | String | E.g. "Navalgund Cluster, Dharwad, North Karnataka" |

### 3. `Order` Schema
| Field | Type | Description |
|---|---|---|
| `id` | String | Unique order record ID |
| `orderNumber` | String | Human-readable order number (e.g. `KK-2026-1082`) |
| `buyerName` | String | Buyer's full name |
| `buyerPhone` | String | Buyer's contact phone |
| `shippingAddress` | String | Delivery address with PIN code |
| `items` | Array[Object]| `{ productId, title, quantity, priceAtPurchase }` |
| `totalAmount` | Number | Total price in INR |
| `paymentMethod` | String | "Mocked UPI (GPay)" \| "Cash on Delivery" |
| `paymentStatus` | String | Default: `'Paid - Mock'` |
| `orderStatus` | Enum | `'Pending'` \| `'Accepted'` \| `'Shipped'` \| `'Delivered'` |
| `createdAt` | Date | ISO timestamp |

---

## 🚀 Quickstart & Setup

### 1. Run Seeder Script
Populate the database with 3 Karnataka artisans and 6 detailed products:
```bash
npm run seed
```

### 2. Start Full-Stack App
```bash
# Starts the backend on http://localhost:5000 (serving both REST API and React SPA frontend)
npm start
```
Alternatively, for hot-reloading frontend development:
```bash
# Terminal 1: Backend
npm run dev:backend

# Terminal 2: Frontend (Vite)
npm run dev:frontend
```
Open **http://localhost:5173** (or http://localhost:5000) in your browser.

---

## 🧪 Postman & cURL Test Summary

All 7 required RESTful endpoints are tested and verified.

### 1. Fetch All Products (Populated Artisan)
```bash
curl -X GET "http://localhost:5000/api/products" \
  -H "Accept: application/json"
```
*Filter by Category:*
```bash
curl -X GET "http://localhost:5000/api/products?category=Kasuti%20Embroidery"
```

### 2. Fetch Single Product with Full Provenance Story
```bash
curl -X GET "http://localhost:5000/api/products/prod_kasuti_saree"
```

### 3. Create a New Product Listing (POST)
```bash
curl -X POST "http://localhost:5000/api/products" \
  -H "Content-Type: application/json" \
  -d '{
    "artisanId": "artisan_kasuti_1",
    "title": "Kasuti Embroidered Raw Silk Stole",
    "category": "Kasuti Embroidery",
    "price": 1850,
    "stockQuantity": 4,
    "imageUrl": "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=800&q=80",
    "craftStory": {
      "hoursSpent": 26,
      "materialsUsed": "Ahimsa peace silk, natural madder dye threads",
      "culturalSignificance": "Lotus and palanquin patterns symbolizing wedding blessings",
      "provenanceLocation": "Dharwad weavers enclave"
    }
  }'
```

### 4. Fetch Artisan Dashboard (Products & Incoming Orders)
```bash
curl -X GET "http://localhost:5000/api/artisans/artisan_kasuti_1/dashboard"
```
*Returns artisan profile, metrics (`totalProducts`, `totalOrders`, `totalEarningsINR`), products, and incoming orders.*

### 5. Create Order & Validate Stock Decrement (POST)
```bash
curl -X POST "http://localhost:5000/api/orders" \
  -H "Content-Type: application/json" \
  -d '{
    "buyerName": "Vikram Hegde",
    "buyerPhone": "+91 99887 76655",
    "shippingAddress": "15, Malleshwaram 8th Cross, Bengaluru 560003",
    "paymentMethod": "Mocked UPI (Google Pay)",
    "items": [
      {
        "productId": "prod_kasuti_saree",
        "quantity": 1,
        "price": 4850
      }
    ]
  }'
```
*Returns order record, decrements `stockQuantity`, and outputs mocked payment confirmation receipt (`TXN-UPI-XXXX`, `fairArtisanShareINR`).*

### 6. Update Order Status (PATCH)
```bash
curl -X PATCH "http://localhost:5000/api/orders/order_demo_1/status" \
  -H "Content-Type: application/json" \
  -d '{ "status": "Shipped" }'
```
*Transitions order from `Accepted` -> `Shipped` -> `Delivered`.*

### 7. Delete / Remove Product Listing (DELETE)
```bash
curl -X DELETE "http://localhost:5000/api/products/prod_12345"
```
*Removes craft from active marketplace catalogue.*

### 8. Run Automated Test Suite
```bash
npm test
```
*Executes all 8 automated endpoint tests in sequence and asserts stock decrements, deletion, populated relations, and responses.*
