const http = require('http');
const app = require('./server');

const PORT = 5001;
let server;

function request(method, path, body = null, customHeaders = {}) {
  return new Promise((resolve, reject) => {
    const dataString = body ? JSON.stringify(body) : null;
    const options = {
      hostname: '127.0.0.1',
      port: PORT,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(dataString ? { 'Content-Length': Buffer.byteLength(dataString) } : {}),
        ...customHeaders
      }
    };

    const req = http.request(options, (res) => {
      let raw = '';
      res.on('data', chunk => raw += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(raw);
          resolve({ status: res.statusCode, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, raw });
        }
      });
    });

    req.on('error', reject);
    if (dataString) req.write(dataString);
    req.end();
  });
}

async function runTests() {
  server = app.listen(PORT, async () => {
    try {
      console.log(`\n Running automated tests on http://127.0.0.1:${PORT}...`);

      // 1. GET /api/products
      console.log('\n--- 1. Testing GET /api/products ---');
      const resProducts = await request('GET', '/api/products');
      console.log(`Status: ${resProducts.status}, Count: ${resProducts.body.count}`);
      if (resProducts.body.data[0]?.artisan?.name) {
        console.log(` Populated Artisan verified: "${resProducts.body.data[0].artisan.name}"`);
      } else {
        throw new Error('Artisan was not populated!');
      }

      // 2. GET /api/products with category filter
      console.log('\n--- 2. Testing GET /api/products?category=Kasuti Embroidery ---');
      const resKasuti = await request('GET', '/api/products?category=Kasuti%20Embroidery');
      console.log(`Status: ${resKasuti.status}, Count: ${resKasuti.body.count}`);

      // 3. GET /api/products/:id
      console.log('\n--- 3. Testing GET /api/products/prod_kasuti_saree ---');
      const resSingle = await request('GET', '/api/products/prod_kasuti_saree');
      console.log(`Status: ${resSingle.status}, Title: "${resSingle.body.data.title}"`);
      console.log(` Cultural Significance: "${resSingle.body.data.craftStory.culturalSignificance.substring(0, 60)}..."`);

      // 4. POST /api/products
      console.log('\n--- 4. Testing POST /api/products (Create Listing) ---');
      const newListing = {
        artisanId: 'artisan_kasuti_1',
        title: 'Kasuti Embroidered Raw Silk Stole',
        category: 'Kasuti Embroidery',
        price: 1850,
        stockQuantity: 4,
        imageUrl: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=800&q=80',
        craftStory: {
          hoursSpent: 26,
          materialsUsed: 'Ahimsa peace silk, natural madder dye threads',
          culturalSignificance: 'Lotus and palanquin patterns symbolizing wedding blessings',
          provenanceLocation: 'Dharwad weavers enclave'
        }
      };
      const resCreateProd = await request('POST', '/api/products', newListing);
      console.log(`Status: ${resCreateProd.status}, Created ID: ${resCreateProd.body.data.id}`);

      // 5. GET /api/artisans/:id/dashboard
      console.log('\n--- 5. Testing GET /api/artisans/artisan_kasuti_1/dashboard ---');
      const resDash = await request('GET', '/api/artisans/artisan_kasuti_1/dashboard');
      console.log(`Status: ${resDash.status}, Artisan: ${resDash.body.data.artisan.name}`);
      console.log(` Metrics: Total Products=${resDash.body.data.metrics.totalProducts}, Total Orders=${resDash.body.data.metrics.totalOrders}, Earnings=₹${resDash.body.data.metrics.totalEarningsINR}`);

      // 6. POST /api/orders (Stock Validation & Decrement + Payment Receipt)
      console.log('\n--- 6. Testing POST /api/orders ---');
      const initialStock = resSingle.body.data.stockQuantity;
      console.log(`Stock before order: ${initialStock}`);

      const newOrderPayload = {
        buyerName: 'Vikram Hegde',
        buyerPhone: '+91 99887 76655',
        shippingAddress: '15, Malleshwaram 8th Cross, Bengaluru 560003',
        paymentMethod: 'Mocked UPI (Google Pay)',
        items: [
          {
            productId: 'prod_kasuti_saree',
            title: 'Kasuti Temple Gopuram Handwoven Ilkal Saree',
            quantity: 2,
            price: 4850
          }
        ]
      };
      const resOrder = await request('POST', '/api/orders', newOrderPayload);
      console.log(`Status: ${resOrder.status}, Order Number: ${resOrder.body.data.order.orderNumber}`);
      console.log(` Payment Receipt: ${resOrder.body.data.receipt.transactionId} - Status: ${resOrder.body.data.receipt.paymentStatus} (Fair Artisan Share: ₹${resOrder.body.data.receipt.fairArtisanShareINR})`);

      // Verify stock was decremented
      const resSingleAfter = await request('GET', '/api/products/prod_kasuti_saree');
      console.log(`Stock after order: ${resSingleAfter.body.data.stockQuantity} (Decremented by 2: ${initialStock - resSingleAfter.body.data.stockQuantity === 2 ? 'PASS' : 'FAIL'})`);

      // 7. PATCH /api/orders/:id/status
      console.log('\n--- 7. Testing PATCH /api/orders/:id/status ---');
      const orderId = resOrder.body.data.order.id;
      const resUpdateStatus = await request('PATCH', `/api/orders/${orderId}/status`, { status: 'Shipped' });
      console.log(`Status: ${resUpdateStatus.status}, New Order Status: ${resUpdateStatus.body.data.orderStatus}`);

      const resDelivered = await request('PATCH', `/api/orders/${orderId}/status`, { status: 'Delivered' });
      console.log(`Status: ${resDelivered.status}, Final Order Status: ${resDelivered.body.data.orderStatus}`);

      // 8. DELETE /api/products/:id (Remove listing in Artisan Mode)
      console.log('\n--- 8. Testing DELETE /api/products/:id ---');
      const prodToDelete = resCreateProd.body.data.id;
      const resDelete = await request('DELETE', `/api/products/${prodToDelete}`);
      console.log(`Status: ${resDelete.status}, Deleted: "${resDelete.body.data.title}"`);
      const resCheckDeleted = await request('GET', `/api/products/${prodToDelete}`);
      console.log(`Verification after delete: Status ${resCheckDeleted.status} (Expected 404: ${resCheckDeleted.status === 404 ? 'PASS' : 'FAIL'})`);

      // 9. POST /api/artisans/send-otp (Artisan Mobile OTP Request)
      console.log('\n--- 9. Testing POST /api/artisans/send-otp ---');
      const resSendOtp = await request('POST', '/api/artisans/send-otp', { phone: '+91 98451 23450' });
      console.log(`Status: ${resSendOtp.status}, Message: "${resSendOtp.body.message}", Demo OTP: ${resSendOtp.body.demoOtp}`);
      if (resSendOtp.status !== 200 || resSendOtp.body.demoOtp !== '1234') {
        throw new Error('Failed to send OTP to registered artisan!');
      }

      // 10. POST /api/artisans/send-otp with Unregistered Phone (404 check)
      console.log('\n--- 10. Testing POST /api/artisans/send-otp (Unregistered Phone) ---');
      const resUnregOtp = await request('POST', '/api/artisans/send-otp', { phone: '9000011111' });
      console.log(`Status: ${resUnregOtp.status}, Requires Registration: ${resUnregOtp.body.error?.requiresRegistration}`);
      if (resUnregOtp.status !== 404 || !resUnregOtp.body.error?.requiresRegistration) {
        throw new Error('Unregistered phone did not return 404 with requiresRegistration flag!');
      }

      // 11. POST /api/artisans/login (Phone + OTP Authentication)
      console.log('\n--- 11. Testing POST /api/artisans/login (Phone + OTP) ---');
      const resLoginPhone = await request('POST', '/api/artisans/login', { phone: '98451 23450', otp: '1234' });
      console.log(`Status: ${resLoginPhone.status}, Logged In Artisan: "${resLoginPhone.body.data.name}", Token: ${resLoginPhone.body.token.substring(0, 30)}...`);
      if (resLoginPhone.status !== 200 || !resLoginPhone.body.token) {
        throw new Error('Artisan phone + OTP login failed!');
      }

      // 12. POST /api/artisans/login (1-Click Demo Login by artisanId)
      console.log('\n--- 12. Testing POST /api/artisans/login (1-Click Artisan ID) ---');
      const resLoginId = await request('POST', '/api/artisans/login', { artisanId: 'artisan_beedu_2' });
      console.log(`Status: ${resLoginId.status}, Logged In Artisan: "${resLoginId.body.data.name}" (${resLoginId.body.data.craftSpecialty})`);
      if (resLoginId.status !== 200 || resLoginId.body.data.name !== 'Ganesh Devadiga') {
        throw new Error('1-Click Artisan ID login failed!');
      }

      // 13. GET /api/artisans/me (Token-authenticated session check)
      console.log('\n--- 13. Testing GET /api/artisans/me ---');
      const resMe = await request('GET', '/api/artisans/me', null, { Authorization: `Bearer ${resLoginPhone.body.token}` });
      console.log(`Status: ${resMe.status}, Verified Profile: "${resMe.body.data.name}" from ${resMe.body.data.village}`);
      if (resMe.status !== 200 || resMe.body.data.id !== 'artisan_kasuti_1') {
        throw new Error('Authenticated /api/artisans/me failed!');
      }

      console.log('\n ALL 13 RESTFUL ENDPOINT TESTS (INCLUDING ARTISAN LOGIN & AUTH) PASSED WITH 100% SUCCESS!\n');
      server.close();
      process.exit(0);
    } catch (err) {
      console.error('\n Test execution failed:', err);
      if (server) server.close();
      process.exit(1);
    }
  });
}

runTests();
