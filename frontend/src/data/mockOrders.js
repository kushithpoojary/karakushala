export const ORDER_STATUSES = [
  'Placed',
  'Confirmed',
  'Being crafted',
  'Packed',
  'Shipped',
  'Out for delivery',
  'Delivered',
  'Cancelled'
];

export const MOCK_ORDERS = [
  {
    id: 'order_demo_1',
    orderNumber: 'KK-2026-8921',
    buyerName: 'Ananya Rao',
    buyerPhone: '+91 98801 23456',
    shippingAddress: 'Flat 402, Shanthi Enclave, Indiranagar, Bengaluru, Karnataka - 560038',
    items: [
      {
        productId: 'prod_kasuti_saree',
        title: 'Kasuti Temple Gopuram Handwoven Ilkal Saree',
        artisanName: 'Shantavva Badiger',
        craftCluster: 'Navalgund, Dharwad',
        quantity: 1,
        priceAtPurchase: 4850,
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'
      }
    ],
    totalAmount: 4850,
    paymentMethod: 'Mock UPI (Google Pay)',
    paymentStatus: 'Paid - Mock',
    orderStatus: 'Being crafted',
    courier: 'India Post Speed Post',
    trackingNumber: 'IN-POST-KA-88192',
    estimatedDeliveryDate: 'Nov 21, 2026',
    statusHistory: [
      {
        status: 'Placed',
        timestamp: '2026-11-11T09:30:00.000Z',
        note: 'Order placed via Google Pay UPI. ₹4,850 artisan escrow reserved with 88% fair wage guarantee.',
        updatedBy: 'Buyer'
      },
      {
        status: 'Confirmed',
        timestamp: '2026-11-11T14:15:00.000Z',
        note: 'Artisan Shantavva Badiger confirmed yarn count and sacred temple gopuram motif layout.',
        updatedBy: 'Artisan'
      },
      {
        status: 'Being crafted',
        timestamp: '2026-11-12T10:00:00.000Z',
        note: 'Handloom Kasuti embroidery underway at Navalgund cluster. 18 hours of micro-needlework in progress.',
        updatedBy: 'Artisan'
      }
    ],
    createdAt: '2026-11-11T09:30:00.000Z'
  },
  {
    id: 'order_demo_2',
    orderNumber: 'KK-2026-7319',
    buyerName: 'Rohan Iyer',
    buyerPhone: '+91 97112 33445',
    shippingAddress: 'Flat 304, Green Palms, Marine Drive, Kochi, Kerala - 682011',
    items: [
      {
        productId: 'prod_beedu_lamp',
        title: 'Coastal Heritage Daiva Shrine Canopy Lamp',
        artisanName: 'Ganesh Poojary',
        craftCluster: 'Maravanthe, Kundapura',
        quantity: 1,
        priceAtPurchase: 1850,
        image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80'
      }
    ],
    totalAmount: 1850,
    paymentMethod: 'Mock UPI (PhonePe)',
    paymentStatus: 'Paid - Mock',
    orderStatus: 'Shipped',
    courier: 'India Post Speed Post',
    trackingNumber: 'IN-POST-KA-99248',
    estimatedDeliveryDate: 'Nov 18, 2026',
    statusHistory: [
      {
        status: 'Placed',
        timestamp: '2026-11-10T11:20:00.000Z',
        note: 'Order placed successfully by buyer via PhonePe UPI.',
        updatedBy: 'Buyer'
      },
      {
        status: 'Confirmed',
        timestamp: '2026-11-10T16:00:00.000Z',
        note: 'Ganesh Poojary selected seasoned coastal riverbank cane strands.',
        updatedBy: 'Artisan'
      },
      {
        status: 'Being crafted',
        timestamp: '2026-11-11T08:30:00.000Z',
        note: 'Traditional coastal Daiva canopy weaving completed in Maravanthe.',
        updatedBy: 'Artisan'
      },
      {
        status: 'Packed',
        timestamp: '2026-11-12T15:45:00.000Z',
        note: 'Cushioned in shockproof organic banana-fiber box with GI authenticity seal.',
        updatedBy: 'Artisan'
      },
      {
        status: 'Shipped',
        timestamp: '2026-11-13T10:15:00.000Z',
        note: 'Dispatched via India Post Speed Post Kundapura Sub-Post Office. Tracking: IN-POST-KA-99248',
        updatedBy: 'Artisan',
        courier: 'India Post Speed Post',
        trackingNumber: 'IN-POST-KA-99248'
      }
    ],
    createdAt: '2026-11-10T11:20:00.000Z'
  },
  {
    id: 'order_demo_3',
    orderNumber: 'KK-2026-5120',
    buyerName: 'Dr. Priya Kulkarni',
    buyerPhone: '+91 94481 99882',
    shippingAddress: '18/B, Saraswati Puram, Mysuru, Karnataka - 570009',
    items: [
      {
        productId: 'prod_kasuti_peacock_tapestry',
        title: 'Traditional Navalgund Kasuti Peacock Tapestry',
        artisanName: 'Shantavva Badiger',
        craftCluster: 'Navalgund, Dharwad',
        quantity: 1,
        priceAtPurchase: 3200,
        image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80'
      }
    ],
    totalAmount: 3200,
    paymentMethod: 'Mock UPI',
    paymentStatus: 'Paid - Mock',
    orderStatus: 'Out for delivery',
    courier: 'Delhivery Express',
    trackingNumber: 'DELH-KK-81029',
    estimatedDeliveryDate: 'Today (Nov 14, 2026)',
    statusHistory: [
      {
        status: 'Placed',
        timestamp: '2026-11-09T08:00:00.000Z',
        note: 'Order confirmed by buyer.',
        updatedBy: 'Buyer'
      },
      {
        status: 'Confirmed',
        timestamp: '2026-11-09T12:00:00.000Z',
        note: 'Artisan accepted order and aligned Chalukyan Mayura palette.',
        updatedBy: 'Artisan'
      },
      {
        status: 'Being crafted',
        timestamp: '2026-11-10T09:00:00.000Z',
        note: 'Cross-stitch embroidery on indigo khadi cloth completed.',
        updatedBy: 'Artisan'
      },
      {
        status: 'Packed',
        timestamp: '2026-11-11T16:00:00.000Z',
        note: 'Sealed in moisture-proof craft roll with brass end caps.',
        updatedBy: 'Artisan'
      },
      {
        status: 'Shipped',
        timestamp: '2026-11-12T11:00:00.000Z',
        note: 'Handed over to Delhivery Express Hub Hubli. Tracking: DELH-KK-81029',
        updatedBy: 'Artisan',
        courier: 'Delhivery Express',
        trackingNumber: 'DELH-KK-81029'
      },
      {
        status: 'Out for delivery',
        timestamp: '2026-11-14T08:30:00.000Z',
        note: 'Delivery executive Suresh K. is en route to Saraswati Puram, Mysuru.',
        updatedBy: 'Courier'
      }
    ],
    createdAt: '2026-11-09T08:00:00.000Z'
  },
  {
    id: 'order_demo_4',
    orderNumber: 'KK-2026-4091',
    buyerName: 'Arvind Hegde',
    buyerPhone: '+91 98450 11223',
    shippingAddress: '12, Sharada Colony, Basaveshwaranagar, Bengaluru - 560079',
    items: [
      {
        productId: 'prod_teak_bull',
        title: 'Hand-Carved Coastal Teak Bull Figurine',
        artisanName: 'Devappa Acharya',
        craftCluster: 'Kumta, Uttara Kannada',
        quantity: 2,
        priceAtPurchase: 1250,
        image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80'
      }
    ],
    totalAmount: 2500,
    paymentMethod: 'Mock UPI',
    paymentStatus: 'Paid - Mock',
    orderStatus: 'Delivered',
    courier: 'Blue Dart',
    trackingNumber: 'BD-BLR-44910',
    estimatedDeliveryDate: 'Delivered on Nov 12, 2026',
    statusHistory: [
      {
        status: 'Placed',
        timestamp: '2026-11-05T14:20:00.000Z',
        note: 'Order placed by Arvind Hegde.',
        updatedBy: 'Buyer'
      },
      {
        status: 'Confirmed',
        timestamp: '2026-11-05T18:00:00.000Z',
        note: 'Devappa Acharya verified teak seasoning grain.',
        updatedBy: 'Artisan'
      },
      {
        status: 'Being crafted',
        timestamp: '2026-11-06T10:00:00.000Z',
        note: 'Chisel work and natural beeswax polishing finished.',
        updatedBy: 'Artisan'
      },
      {
        status: 'Packed',
        timestamp: '2026-11-08T16:00:00.000Z',
        note: 'Packed in recycled pine crates.',
        updatedBy: 'Artisan'
      },
      {
        status: 'Shipped',
        timestamp: '2026-11-09T09:30:00.000Z',
        note: 'Handed over to Blue Dart Express. Tracking: BD-BLR-44910',
        updatedBy: 'Artisan',
        courier: 'Blue Dart',
        trackingNumber: 'BD-BLR-44910'
      },
      {
        status: 'Out for delivery',
        timestamp: '2026-11-12T09:00:00.000Z',
        note: 'Out for delivery in Basaveshwaranagar, Bengaluru.',
        updatedBy: 'Courier'
      },
      {
        status: 'Delivered',
        timestamp: '2026-11-12T14:45:00.000Z',
        note: 'Handed over to recipient. ₹2,200 (88%) directly remitted to artisan Devappa Acharya.',
        updatedBy: 'Courier'
      }
    ],
    createdAt: '2026-11-05T14:20:00.000Z'
  },
  {
    id: 'order_demo_5',
    orderNumber: 'KK-2026-9934',
    buyerName: 'Ananya Rao',
    buyerPhone: '+91 98801 23456',
    shippingAddress: 'Flat 402, Shanthi Enclave, Indiranagar, Bengaluru, Karnataka - 560038',
    items: [
      {
        productId: 'prod_coastal_diya',
        title: 'Coastal Teak Shell Diya with Brass Inlay',
        artisanName: 'Devappa Acharya',
        craftCluster: 'Kumta, Uttara Kannada',
        quantity: 1,
        priceAtPurchase: 1450,
        image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=800&q=80'
      }
    ],
    totalAmount: 1450,
    paymentMethod: 'Mock UPI (Google Pay)',
    paymentStatus: 'Paid - Mock',
    orderStatus: 'Placed',
    courier: 'Pending Dispatch Allocation',
    trackingNumber: 'Pending',
    estimatedDeliveryDate: 'Nov 24, 2026',
    statusHistory: [
      {
        status: 'Placed',
        timestamp: '2026-11-14T00:15:00.000Z',
        note: 'Order placed by Ananya Rao via Google Pay UPI. Awaiting artisan workshop confirmation.',
        updatedBy: 'Buyer'
      }
    ],
    createdAt: '2026-11-14T00:15:00.000Z'
  },
  {
    id: 'order_demo_6',
    orderNumber: 'KK-2026-1188',
    buyerName: 'Vikramaditya Sen',
    buyerPhone: '+91 99001 88442',
    shippingAddress: '55, Richmond Road, Bengaluru, Karnataka - 560025',
    items: [
      {
        productId: 'prod_kasuti_dupatta',
        title: 'Navalgund Kasuti Embroidered Pure Chanderi Dupatta',
        artisanName: 'Shantavva Badiger',
        craftCluster: 'Navalgund, Dharwad',
        quantity: 1,
        priceAtPurchase: 2800,
        image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80'
      }
    ],
    totalAmount: 2800,
    paymentMethod: 'Mock UPI',
    paymentStatus: 'Refunded - 100%',
    orderStatus: 'Cancelled',
    courier: 'N/A',
    trackingNumber: 'N/A',
    estimatedDeliveryDate: 'Order Cancelled',
    statusHistory: [
      {
        status: 'Placed',
        timestamp: '2026-11-08T10:00:00.000Z',
        note: 'Order initially placed via UPI.',
        updatedBy: 'Buyer'
      },
      {
        status: 'Cancelled',
        timestamp: '2026-11-09T11:30:00.000Z',
        note: 'Order cancelled by customer prior to yarn preparation. Full ₹2,800 refunded to bank source.',
        updatedBy: 'Customer Support'
      }
    ],
    createdAt: '2026-11-08T10:00:00.000Z'
  }
];
