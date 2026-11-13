export const MOCK_BUYERS = [
  {
    id: 'user_demo_1',
    name: 'Ananya Rao',
    kannadaName: 'ಅನನ್ಯಾ ರಾವ್',
    email: 'ananya.rao@gmail.com',
    phone: '+91 98801 23456',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    city: 'Bengaluru, Karnataka',
    address: 'Flat 402, Shanthi Enclave, 12th Main, Indiranagar, Bengaluru - 560038'
  },
  {
    id: 'user_demo_2',
    name: 'Vikram Hegde',
    kannadaName: 'ವಿಕ್ರಮ್ ಹೆಗ್ಡೆ',
    email: 'vikram.hegde@gmail.com',
    phone: '+91 99887 76655',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    city: 'Mysuru, Karnataka',
    address: '15, Malleshwaram 8th Cross, Bengaluru 560003'
  }
];

export const MOCK_ARTISANS = [
  {
    id: 'artisan_kasuti_1',
    name: 'Parvati Bai Deshpande',
    kannadaName: 'ಪಾರ್ವತಿ ಬಾಯಿ ದೇಶಪಾಂಡೆ',
    phone: '+91 98451 23450',
    village: 'Navalgund, Dharwad District',
    craftSpecialty: 'Kasuti',
    bio: 'Master Kasuti artisan practicing traditional Gavanti and Murgi double-running stitches passed down 4 generations from the Chalukyan era. She leads a self-help cooperative of 35 women embroiders in Dharwad.',
    yearsOfExperience: 28,
    profileImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80',
    storyAudioQuote: "Each Kasuti needle move counts every single thread of the handloom. When you wear this, you wear four hundred years of Dharwad temple architecture."
  },
  {
    id: 'artisan_beedu_2',
    name: 'Ganesh Devadiga',
    kannadaName: 'ಗಣೇಶ್ ದೇವಾಡಿಗ',
    phone: '+91 94812 67891',
    village: 'Maravanthe, Udupi Coastal Region',
    craftSpecialty: 'Beedu',
    bio: 'Specialist in sacred coastal Beedu (palm leaf and wild cane lattice) weaving traditionally used in Daiva Aradhane shrines and coastal canopy architecture. He preserves 800-year-old coastal weaving geometry.',
    yearsOfExperience: 22,
    profileImage: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=600&q=80',
    storyAudioQuote: "In Karavali, our palm weaves breathe with coastal air. The Daiva patterns protect grain from sea dampness, tied by hand without a single steel nail."
  },
  {
    id: 'artisan_coastal_3',
    name: 'Kavita Naik',
    kannadaName: 'ಕವಿತಾ ನಾಯ್ಕ್',
    phone: '+91 97410 88234',
    village: 'Kumta & Honnavar, Uttara Kannada',
    craftSpecialty: 'Coastal',
    bio: 'Award-winning coastal artisan transforming discarded coconut shells, weathered driftwood, and natural sea-glass into intricate temple sculptures, lamps, and acoustic rhythm instruments.',
    yearsOfExperience: 16,
    profileImage: 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?auto=format&fit=crop&w=600&q=80',
    storyAudioQuote: "The sea washes up seasoned wood and resilient coconut shells. We carve sacred ripples into what others overlook, giving life to coastal spirit."
  }
];

export const MOCK_PRODUCTS = [
  // --- CATEGORY 1: KASUTI EMBROIDERY ---
  {
    id: 'prod_kasuti_saree',
    artisanId: 'artisan_kasuti_1',
    title: 'Kasuti Temple Gopuram Handwoven Ilkal Saree',
    category: 'Kasuti Embroidery',
    price: 4850,
    stockQuantity: 6,
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=900&q=80'
    ],
    craftStory: {
      hoursSpent: 72,
      materialsUsed: 'Pure Mulberry silk thread, handloom Ilkal cotton body, natural indigo & turmeric dye',
      culturalSignificance: 'Traditional Gopura (temple spire) and chariot motifs derived from the 7th-century Aihole and Pattadakal temples. Stitched purely by thread-counting without drawing on fabric.',
      provenanceLocation: 'Navalgund Cluster, Dharwad, North Karnataka',
      audioNarration: 'This saree took 72 hours of intense thread counting. Parvati Bai worked the sacred temple chariots using the Gavanti double-running stitch, where both front and back of the fabric appear completely identical.'
    },
    priceBreakdown: {
      artisanFairWage: 3950,
      rawMaterialsDyes: 650,
      packagingLogistics: 250
    },
    artisan: MOCK_ARTISANS[0]
  },
  {
    id: 'prod_kasuti_tapestry',
    artisanId: 'artisan_kasuti_1',
    title: 'Hand-Embroidered Kasuti Peacock Khadi Tapestry',
    category: 'Kasuti Embroidery',
    price: 2400,
    stockQuantity: 10,
    images: [
      'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=900&q=80'
    ],
    craftStory: {
      hoursSpent: 36,
      materialsUsed: 'Kashida raw silk threads, unbleached handspun organic cotton khadi canvas',
      culturalSignificance: 'The Mayura (peacock) is stitched using the Neygi weaving stitch and Menthi cross-stitch, symbolizing prosperity and monsoon harvest in the Malaprabha river basin.',
      provenanceLocation: 'Kalghatgi Village, Dharwad, Karnataka',
      audioNarration: 'Woven on unbleached Malaprabha khadi, the dancing peacock brings prosperity to your living space. Over 36 hours of artisan labor went into this piece.'
    },
    priceBreakdown: {
      artisanFairWage: 1980,
      rawMaterialsDyes: 320,
      packagingLogistics: 100
    },
    artisan: MOCK_ARTISANS[0]
  },
  {
    id: 'prod_kasuti_dupatta',
    artisanId: 'artisan_kasuti_1',
    title: 'Dharwad Kasuti Chariot & Lotus Silk Dupatta',
    category: 'Kasuti Embroidery',
    price: 3100,
    stockQuantity: 4,
    images: [
      'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=900&q=80'
    ],
    craftStory: {
      hoursSpent: 42,
      materialsUsed: 'Chanderi Tussar silk, natural madder & indigo embroidery floss',
      culturalSignificance: 'Padma (lotus) motifs stitched with Neygi stitch, symbolizing purity blooming out of adversity, traditional to Dharwad brides.',
      provenanceLocation: 'Navalgund, Dharwad, Karnataka',
      audioNarration: '42 hours of dedicated embroidery by women of Dharwad. This dupatta pairs exquisite Lotus florals with historic Chalukyan geometric precision.'
    },
    priceBreakdown: {
      artisanFairWage: 2500,
      rawMaterialsDyes: 420,
      packagingLogistics: 180
    },
    artisan: MOCK_ARTISANS[0]
  },

  // --- CATEGORY 2: BEEDU CRAFT ---
  {
    id: 'prod_beedu_chest',
    artisanId: 'artisan_beedu_2',
    title: 'Beedu Sacred Daiva Palm-Lattice Storage Chest',
    category: 'Beedu Craft',
    price: 3200,
    stockQuantity: 5,
    images: [
      'https://images.unsplash.com/photo-1584589167171-541ce45f1eea?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1595246140625-573b715d11dc?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=900&q=80'
    ],
    craftStory: {
      hoursSpent: 44,
      materialsUsed: 'Seasoned wild palm ribs, boiled river reeds, herbal neem oil coating',
      culturalSignificance: 'Ancient coastal Beedu geometric weave used historically by Tuluva elders to preserve sacred heirloom seeds and temple manuscripts from coastal humidity and pests.',
      provenanceLocation: 'Maravanthe Estuary, Udupi, Karnataka',
      audioNarration: 'Ganesh Devadiga harvests wild palm ribs during the waning moon when the sap is lowest. Treated with neem oil, this chest protects heirlooms naturally without any chemicals.'
    },
    priceBreakdown: {
      artisanFairWage: 2600,
      rawMaterialsDyes: 420,
      packagingLogistics: 180
    },
    artisan: MOCK_ARTISANS[1]
  },
  {
    id: 'prod_beedu_lamp',
    artisanId: 'artisan_beedu_2',
    title: 'Coastal Heritage Daiva Shrine Canopy Lamp',
    category: 'Beedu Craft',
    price: 1850,
    stockQuantity: 8,
    images: [
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=900&q=80'
    ],
    craftStory: {
      hoursSpent: 28,
      materialsUsed: 'Split forest cane, palm bark fiber, brass-pinned joints, cold-pressed castor seal',
      culturalSignificance: 'Emits a hypnotic warm geometric shadow pattern inspired by traditional Bootha Kola ritual dance canopies of coastal Karavali.',
      provenanceLocation: 'Kundapura Backwaters, Udupi, Karnataka',
      audioNarration: 'When lit in the evening, this canopy lamp casts sacred geometric shadows reminiscent of a coastal Bootha Kola shrine sanctuary.'
    },
    priceBreakdown: {
      artisanFairWage: 1480,
      rawMaterialsDyes: 250,
      packagingLogistics: 120
    },
    artisan: MOCK_ARTISANS[1]
  },
  {
    id: 'prod_beedu_basket',
    artisanId: 'artisan_beedu_2',
    title: 'Karavali Coastal Rib-Woven Fruit Platter & Tray',
    category: 'Beedu Craft',
    price: 1250,
    stockQuantity: 9,
    images: [
      'https://images.unsplash.com/photo-1595246140625-573b715d11dc?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1584589167171-541ce45f1eea?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=900&q=80'
    ],
    craftStory: {
      hoursSpent: 16,
      materialsUsed: 'Peeled wild cane, wild arecanut palm leaf, natural turmeric preservative',
      culturalSignificance: 'Served in Udupi temple feasts during Navaratri celebrations, symbolizing harmony between forest and river.',
      provenanceLocation: 'Maravanthe, Udupi, Karnataka',
      audioNarration: 'Tight, durable palm rib lattice that can last for over twenty years without warping or cracking.'
    },
    priceBreakdown: {
      artisanFairWage: 1020,
      rawMaterialsDyes: 130,
      packagingLogistics: 100
    },
    artisan: MOCK_ARTISANS[1]
  },

  // --- CATEGORY 3: COASTAL WOOD & SHELL ---
  {
    id: 'prod_coastal_diya',
    artisanId: 'artisan_coastal_3',
    title: 'Carved Coconut Shell & Brass Accent Oil Diya',
    category: 'Coastal Wood & Shell',
    price: 950,
    stockQuantity: 15,
    images: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=900&q=80'
    ],
    craftStory: {
      hoursSpent: 14,
      materialsUsed: 'Polished aged coastal coconut shell, recycled bell-metal brass spout, coconut oil polish',
      culturalSignificance: 'Every shell is hand-carved with sea wave ripples (Kadalina Ale), celebrating coastal Karnatakas intimate bond with the Arabian Sea.',
      provenanceLocation: 'Kumta Seashore, Uttara Kannada, Karnataka',
      audioNarration: 'Kavita Naik selects mature coconut shells from Honnavar groves, seasoning them in salt water before delicate chisel work brings out glowing golden grain.'
    },
    priceBreakdown: {
      artisanFairWage: 760,
      rawMaterialsDyes: 110,
      packagingLogistics: 80
    },
    artisan: MOCK_ARTISANS[2]
  },
  {
    id: 'prod_coastal_windchime',
    artisanId: 'artisan_coastal_3',
    title: 'Driftwood & Marine Shell Acoustic Wind Chime',
    category: 'Coastal Wood & Shell',
    price: 1450,
    stockQuantity: 7,
    images: [
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=900&q=80'
    ],
    craftStory: {
      hoursSpent: 18,
      materialsUsed: 'Salt-cured beach driftwood, conical sea whelk shells, jute twine, dried betel nut beads',
      culturalSignificance: 'Artisans gather sea-tumbled shells after the southwest monsoon; when stirred by wind, each hollow shell creates melodic coastal resonance.',
      provenanceLocation: 'Aghanashini Estuary, Gokarna Coastal Belt, Karnataka',
      audioNarration: 'Gathered along the pristine estuary of Aghanashini, these resonant ocean shells produce a calming natural soundscape at the slightest ocean breeze.'
    },
    priceBreakdown: {
      artisanFairWage: 1180,
      rawMaterialsDyes: 170,
      packagingLogistics: 100
    },
    artisan: MOCK_ARTISANS[2]
  },
  {
    id: 'prod_coastal_boat',
    artisanId: 'artisan_coastal_3',
    title: 'Honnavar Driftwood & Sea-Glass Coastal Fisherboat',
    category: 'Coastal Wood & Shell',
    price: 2150,
    stockQuantity: 6,
    images: [
      'https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=900&q=80'
    ],
    craftStory: {
      hoursSpent: 26,
      materialsUsed: 'Weathered teak driftwood, tumbled green sea-glass, turmeric-dyed cotton sail, brass fittings',
      culturalSignificance: 'Modeled after traditional Karavali Pata-Doni fishing boats that navigate the Sharavathi estuary confluence, honoring the fishing and maritime artisan lore of Honnavar.',
      provenanceLocation: 'Honnavar Port Estuary, Uttara Kannada, Karnataka',
      audioNarration: 'Hand-carved from seasoned coastal driftwood washed up on Honnavar beaches, featuring natural sea glass and cotton sails.'
    },
    priceBreakdown: {
      artisanFairWage: 1750,
      rawMaterialsDyes: 250,
      packagingLogistics: 150
    },
    artisan: MOCK_ARTISANS[2]
  }
];

export const MOCK_ORDERS = [
  {
    id: 'order_demo_1',
    orderNumber: 'KK-2026-1082',
    buyerName: 'Ananya Sharma',
    buyerPhone: '+91 98201 54321',
    shippingAddress: '42, Lavelle Road, Shanthala Nagar, Bengaluru, Karnataka 560001',
    items: [
      {
        productId: 'prod_kasuti_saree',
        title: 'Kasuti Temple Gopuram Handwoven Ilkal Saree',
        quantity: 1,
        priceAtPurchase: 4850
      }
    ],
    totalAmount: 4850,
    paymentMethod: 'Mocked UPI (GPay)',
    paymentStatus: 'Paid - Mock',
    orderStatus: 'Accepted',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
  },
  {
    id: 'order_demo_2',
    orderNumber: 'KK-2026-9421',
    buyerName: 'Rohan Iyer',
    buyerPhone: '+91 97112 33445',
    shippingAddress: 'Flat 304, Green Palms, Marine Drive, Kochi, Kerala 682011',
    items: [
      {
        productId: 'prod_beedu_lamp',
        title: 'Coastal Heritage Daiva Shrine Canopy Lamp',
        quantity: 1,
        priceAtPurchase: 1850
      }
    ],
    totalAmount: 1850,
    paymentMethod: 'Mocked UPI (PhonePe)',
    paymentStatus: 'Paid - Mock',
    orderStatus: 'Shipped',
    createdAt: new Date(Date.now() - 3600000 * 26).toISOString()
  }
];

export const CATEGORIES = [
  'All Crafts',
  'Kasuti Embroidery',
  'Beedu Craft',
  'Coastal Wood & Shell'
];

export const STORY_TEMPLATES = [
  {
    craft: 'Kasuti Embroidery',
    templateTitle: 'Temple Gopuram (ಗೋಪುರ)',
    hoursSpent: 48,
    materials: 'Pure Ilkal silk thread, unbleached handloom khadi, indigo dye',
    significance: 'Stitched with double-running Gavanti stitch inspired by Chalukyan temple spires in Badami. Done thread-by-thread without stenciling.',
    provenance: 'Navalgund, Dharwad'
  },
  {
    craft: 'Beedu Craft',
    templateTitle: 'Daiva Aradhane Lattice (ದೈವಾರಾಧನೆ)',
    hoursSpent: 32,
    materials: 'Wild palm rib, split forest cane, boiled river reeds, herbal neem oil',
    significance: 'Ancient coastal Karavali geometric weave traditionally used in Bootha Kola ritual sanctums to repel humidity and insects.',
    provenance: 'Maravanthe, Udupi'
  },
  {
    craft: 'Coastal Wood & Shell',
    templateTitle: 'Kadalina Ale (ಸಮುದ್ರದ ಅಲೆ)',
    hoursSpent: 16,
    materials: 'Seasoned beach driftwood, aged coconut shell, recycled brass nozzle',
    significance: 'Carved with repeating coastal tide ripples, celebrating coastal Karnataka harmony with the Arabian Sea.',
    provenance: 'Kumta, Uttara Kannada'
  }
];
