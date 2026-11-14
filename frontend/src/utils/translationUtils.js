/**
 * Dynamic Content Translation Utility for Craft Stories & Dynamic Text
 * Ensures output audio and UI text match the selected language (kn, hi, ml, en)
 */

import { getTranslation } from '../i18n/translations';

/**
 * Curated product titles for authentic Karnataka craft listings
 */
const PRODUCT_TITLE_MAP = {
  // 1. Kasuti Embroidery
  'Kasuti Temple Gopuram Handwoven Ilkal Saree': {
    kn: 'ಕಸೂತಿ ದೇವಸ್ಥಾನ ಗೋಪುರ ಕೈಮಗ್ಗ ಇಳಕಲ್ ಸೀರೆ',
    hi: 'कसूती मंदिर गोपुरम हथकरघा इलकल साड़ी',
    ml: 'കസൂതി ക്ഷേത്ര ഗോപുരം കൈത്തറി ഇൽക്കൽ സാരി'
  },
  'Hand-Embroidered Kasuti Peacock Khadi Tapestry': {
    kn: 'ಕೈ ಕಸೂತಿ ನವಿಲು ವಿನ್ಯಾಸ ಖಾದಿ ಕಲಾಚಿತ್ರ',
    hi: 'हस्त-कसीदाकारी कसूती मयूर खादी टेपेस्ट्री',
    ml: 'കൈത്തയ്യൽ കസൂതി മയിൽ ഖാദി ടാപെസ്ട്രി'
  },
  'Dharwad Kasuti Chariot & Lotus Silk Dupatta': {
    kn: 'ಧಾರವಾಡ ಕಸೂತಿ ರಥ & ಕಮಲ ಸಿಲ್ಕ್ ದುಪಟ್ಟಾ',
    hi: 'धारवाड़ कसूती रथ और कमल सिल्क दुपट्टा',
    ml: 'ധാർവാഡ് കസൂതി രഥം & താമര പട്ട് ദുപ്പട്ട'
  },
  'Navalgund Hand-Spun Khadi Blouse Piece with Gavanti Border': {
    kn: 'ನವಲಗುಂದ ಕೈನೂಲಿನ ಗವಂತಿ ಅಂಚಿನ ಖಾದಿ ಬ್ಲೌಸ್ ಪೀಸ್',
    hi: 'नवलगुंद खादी ब्लाउज पीस गवंती बॉर्डर के साथ',
    ml: 'നവൽഗുണ്ട് ഖാദി ബ്ലൗസ് പീസ് ഗവന്തി ബോർഡറോടെ'
  },
  'Chalukyan Geometric Chariot Table Runner': {
    kn: 'ಚಾಲುಕ್ಯ ಜ್ಯಾಮಿತೀಯ ರಥ ಟೇಬಲ್ ರನ್ನರ್',
    hi: 'चालुक्य ज्यामितीय रथ टेबल रनर',
    ml: 'ചാലൂക്യ ജ്യാമിതീയ രഥം ടേബിൾ റണ്ണർ'
  },
  'Badami Temple Lotus Kasuti Cushion Covers (Pair of 2)': {
    kn: 'ಬಾದಾಮಿ ದೇವಸ್ಥಾನ ಕಮಲ ಕಸೂತಿ ಕುಶನ್ ಕವರ್ (ಜೋಡಿ)',
    hi: 'बादामी मंदिर कमल कसूती कुशन कवर (जोड़ी)',
    ml: 'ബദാമി ക്ഷേത്ര താമര കസൂതി കുഷ്യൻ കവറുകൾ (ജോടി)'
  },
  'Handloom Cotton Kurta Fabric with Peacock & Mango Buttis': {
    kn: 'ಕೈಮಗ್ಗ ಹತ್ತಿ ಕುರ್ತಾ ಬಟ್ಟೆ ನವಿಲು & ಮಾವಿನ ಬುಟ್ಟಿ ವಿನ್ಯಾಸ',
    hi: 'हथकरघा सूती कुर्ता कपड़ा मयूर और आम की बूटियों के साथ',
    ml: 'കൈത്തറി കോട്ടൺ കുർത്ത തുണി മയിൽ മാങ്ങാ ബൂട്ടികളോടെ'
  },
  'Heavy-Woven Jute-Cotton Kasuti Heritage Market Tote': {
    kn: 'ಸಣಬು-ಹತ್ತಿ ಕಸೂತಿ ಪಾರಂಪರಿಕ ಮಾರುಕಟ್ಟೆ ಬ್ಯಾಗ್',
    hi: 'जूट-कॉटन कसूती हेरिटेज मार्केट टोट बैग',
    ml: 'ചണ-കോട്ടൺ കസൂതി പൈതൃക മാർക്കറ്റ് ബാഗ്'
  },
  'Traditional Kasuti Entrance Toran with Hanging Tassels': {
    kn: 'ಪಾರಂಪರಿಕ ಕಸೂತಿ ಪ್ರವೇಶ ದ್ವಾರದ ತೋರಣ',
    hi: 'पारंपरिक कसूती प्रवेश द्वार तोरण',
    ml: 'പരമ്പരാഗത കസൂതി പ്രവേശന തോരണം'
  },
  'Ahimsa Mulberry Silk Kasuti Stole in Earthy Madder': {
    kn: 'ಅಹಿಂಸಾ ರೇಷ್ಮೆ ಕಸೂತಿ ಶಾಲು ನೈಸರ್ಗಿಕ ಬಣ್ಣ',
    hi: 'अहिंसा रेशम कसूती स्टोल प्राकृतिक रंग',
    ml: 'അഹിംസാ പട്ട് കസൂതി ഷോൾ പ്രകൃതിദത്ത നിറം'
  },

  // 2. Beedu Craft
  'Beedu Sacred Daiva Palm-Lattice Storage Chest': {
    kn: 'ಬೀಡು ಪವಿತ್ರ ದೈವ ತಾಳೆಗರಿ ಹೆಣಿಗೆ ಪೆಟ್ಟಿಗೆ',
    hi: 'बीडू पवित्र दैव ताड़-जालीदार स्टोरेज संदूक',
    ml: 'ബീഡു വിശുദ്ധ പനയോല പെട്ടി'
  },
  'Coastal Heritage Daiva Shrine Canopy Lamp': {
    kn: 'ಕರಾವಳಿ ಪಾರಂಪರಿಕ ದೈವ ಗುಡಿ ತೂಗು ದೀಪ',
    hi: 'तटीय विरासत दैव मंदिर हैंगिंग लैंप',
    ml: 'തീരദേശ പൈതൃക ദൈവ മണ്ഡപ വിളക്ക്'
  },
  'Karavali Coastal Rib-Woven Fruit Platter & Tray': {
    kn: 'ಕರಾವಳಿ ತಾಳೆಗರಿ ಹೆಣಿಗೆಯ ಹಣ್ಣಿನ ತಟ್ಟೆ & ಟ್ರೇ',
    hi: 'तटीय पाम बुनाई फ्रूट प्लैटर और ट्रे',
    ml: 'തീരദേശ പനയോല ഫ്രൂട്ട് പ്ലേറ്റർ & ട്രേ'
  },
  'Coastal Udupi Wild Cane Geometric Pendant Ceiling Light': {
    kn: 'ಕರಾವಳಿ ಉಡುಪಿ ಬೆತ್ತದ ಜ್ಯಾಮಿತೀಯ ಸೀಲಿಂಗ್ ದೀಪ',
    hi: 'तटीय उडुपी बेंत ज्यामितीय पेंडेंट सीलिंग लाइट',
    ml: 'തീരദേശ ഉഡുപ്പി ചൂരൽ ജ്യാമിതീയ സീലിംഗ് ലൈറ്റ്'
  },
  'Aromatic Vetiver & Palmyra Ribbed Floor Meditation Mat': {
    kn: 'ಸುವಾಸಿತ ಲಾವಂಚ & ತಾಳೆಗರಿ ಧ್ಯಾನ ಚಾಪೆ',
    hi: 'सुगंधित खस और ताड़ ध्यान चटाई',
    ml: 'സുഗന്ധ രാമച്ചം പനയോല ധ്യാന പായ'
  },
  'Tall Conical Beedu Palm-Lattice Laundry Basket with Lid': {
    kn: 'ಎತ್ತರದ ಶಂಕುವಿನಾಕಾರದ ಬೀಡು ತಾಳೆಗರಿ ಲಾಂಡ್ರಿ ಬುಟ್ಟಿ',
    hi: 'लंबी शंक्वाकार बीडू ताड़ लॉन्ड्री टोकरी ढक्कन सहित',
    ml: 'ഉയരമുള്ള കോണാകൃതിയിലുള്ള ബീഡു അലക്ക് കുട്ട മൂടിയോടെ'
  },
  'Netted Bamboo & Wild Cane Serving Trays (Set of 2)': {
    kn: 'ಬಿದಿರು & ಬೆತ್ತದ ಸರ್ವಿಂಗ್ ಟ್ರೇಗಳು (೨ ರ ಸೆಟ್)',
    hi: 'बांस और बेंत सर्विंग ट्रे (2 का सेट)',
    ml: 'മുളയും ചൂരലും സെർവിംഗ് ട്രേകൾ (2 എണ്ണം)'
  },
  'Sacred Bootha Kola Ritual Palm-Lattice Wall Mask': {
    kn: 'ಪವಿತ್ರ ಭೂತಕೋಲ ಧಾರ್ಮಿಕ ತಾಳೆಗರಿ ಮುಖವಾಡ',
    hi: 'पवित्र भूत कोला अनुष्ठान ताड़-जालीदार वॉल मास्क',
    ml: 'വിശുദ്ധ ഭൂത കോല അനുഷ്ഠാന പനയോല മുഖംമൂടി'
  },

  // 3. Coastal Wood & Shell
  'Carved Coconut Shell & Brass Accent Oil Diya': {
    kn: 'ಕೆತ್ತನೆಯ ತೆಂಗಿನ ಚಿಪ್ಪು & ಹಿತ್ತಾಳೆ ತೈಲ ದೀಪ',
    hi: 'नक्काशीदार नारियल शेल और पीतल का तेल दीया',
    ml: 'കൊത്തുപണി ചെയ്ത ചിരട്ട & പിച്ചള എണ്ണവിളക്ക്'
  },
  'Driftwood & Marine Shell Acoustic Wind Chime': {
    kn: 'ಸಮುದ್ರ ಮರ & ಕಪ್ಪೆಚಿಪ್ಪಿನ ಧ್ವನಿ ತರಂಗ ಗಾಳಿ ಘಂಟೆ',
    hi: 'ड्रिफ्टवुड और सीप ध्वनिक विंड चाइम',
    ml: 'ഡ്രിഫ്റ്റ് വുഡ് & കക്കത്തോണ്ട് വിൻഡ് ചൈം'
  },
  'Honnavar Driftwood & Sea-Glass Coastal Fisherboat': {
    kn: 'ಹೊನ್ನಾವರ ಸಮುದ್ರ ಮರದ ಕರಾವಳಿ ಮೀನುಗಾರರ ದೋಣಿ',
    hi: 'होन्नावर ड्रिफ्टवुड तटीय मछुआरा नाव',
    ml: 'ഹൊന്നാവർ കടൽത്തടി മത്സ്യബന്ധന വള്ളം'
  },
  'Hand-Polished Coconut Shell Salad Bowls with Wood Spoons (Set of 2)': {
    kn: 'ಪಾಲಿಶ್ ಮಾಡಿದ ತೆಂಗಿನ ಚಿಪ್ಪಿನ ಸಲಾಡ್ ಬೌಲ್‌ಗಳು & ಚಮಚಗಳು (೨ ರ ಸೆಟ್)',
    hi: 'पॉलिश किए गए नारियल शेल सलाद कटोरे लकड़ी के चम्मच सहित (2 का सेट)',
    ml: 'മിനുക്കിയ ചിരട്ട സലാഡ് ബൗളുകൾ തടി സ്പൂണുകളോടെ (2 എണ്ണം)'
  },
  'Aged Arabian Sea Driftwood Wall Keyholder with Brass Hooks': {
    kn: 'ಅರಬ್ಬೀ ಸಮುದ್ರ ಮರದ ಕೀ ಹೋಲ್ಡರ್ ಹಿತ್ತಾಳೆ ಕೊಕ್ಕೆಗಳೊಂದಿಗೆ',
    hi: 'अरब सागर ड्रिफ्टवुड वॉल की-होल्डर पीतल के हुक सहित',
    ml: 'അറബിക്കടൽ കടൽത്തടി കീ ഹോൾഡർ പിച്ചള കൊളുത്തുകളോടെ'
  },
  'Carved Coconut Shell Tealight Lanterns (Set of 3)': {
    kn: 'ಕೆತ್ತನೆಯ ತೆಂಗಿನ ಚಿಪ್ಪಿನ ದೀಪ ಲಾಟೀನುಗಳು (೩ ರ ಸೆಟ್)',
    hi: 'नक्काशीदार नारियल शेल टीलाइट लालटेन (3 का सेट)',
    ml: 'കൊത്തുപണി ചെയ്ത ചിരട്ട ടീലൈറ്റ് വിളക്കുകൾ (3 എണ്ണം)'
  },
  'Reclaimed Jackfruit Wood \'Anjara Petti\' Spice Box': {
    kn: 'ಹಲಸಿನ ಮರದ ಪಾರಂಪರಿಕ \'ಅಂಜರ ಪೆಟ್ಟಿ\' ಸಾಂಬಾರ ಪೆಟ್ಟಿಗೆ',
    hi: 'कटहल की लकड़ी का पारंपरिक \'अंजरा पेटी\' मसाला डिब्बा',
    ml: 'പ്ലാവില തടി കൊണ്ടുള്ള \'അഞ്ചറ പെട്ടി\' മസാലപ്പെട്ടി'
  },
  'Hand-Carved Coastal Tamarind Wood Mortar & Pestle': {
    kn: 'ಕರಾವಳಿ ಹುಣಸೆ ಮರದ ಒರಳು & ಕುಟ್ಟಾಣಿ',
    hi: 'तटीय इमली की लकड़ी का ओखली और मूसल',
    ml: 'തീരദേശ പുളിമര ഉരലും ഉലക്കയും'
  },
  'Sculptural Coastal Driftwood Table Lamp with Khadi Shade': {
    kn: 'ಕರಾವಳಿ ಸಮುದ್ರ ಮರದ ಟೇಬಲ್ ದೀಪ ಖಾದಿ ಶೇಡ್‌ನೊಂದಿಗೆ',
    hi: 'तटीय ड्रिफ्टवुड टेबल लैंप खादी शेड सहित',
    ml: 'തീരദേശ കടൽത്തടി ടേബിൾ ലാമ്പ് ഖാദി ഷേഡോടെ'
  }
};

/**
 * Intelligent glossaries for dynamic translations
 */
const GLOSSARY_MAP = {
  kn: [
    ['Kasuti', 'ಕಸೂತಿ'],
    ['Embroidery', 'ಕಲೆ'],
    ['Temple', 'ದೇವಸ್ಥಾನ'],
    ['Gopuram', 'ಗೋಪುರ'],
    ['Handwoven', 'ಕೈಮಗ್ಗ'],
    ['Hand-Embroidered', 'ಕೈ ಕಸೂತಿ'],
    ['Saree', 'ಸೀರೆ'],
    ['Peacock', 'ನವಿಲು'],
    ['Khadi', 'ಖಾದಿ'],
    ['Tapestry', 'ಕಲಾಚಿತ್ರ'],
    ['Chariot', 'ರಥ'],
    ['Lotus', 'ಕಮಲ'],
    ['Silk', 'ರೇಷ್ಮೆ'],
    ['Dupatta', 'ದುಪಟ್ಟಾ'],
    ['Stole', 'ಶಾಲು'],
    ['Blouse', 'ಬ್ಲೌಸ್'],
    ['Beedu', 'ಬೀಡು'],
    ['Sacred', 'ಪವಿತ್ರ'],
    ['Daiva', 'ದೈವ'],
    ['Palm-Lattice', 'ತಾಳೆಗರಿ ಹೆಣಿಗೆ'],
    ['Storage', 'ಹೆಣಿಗೆ'],
    ['Chest', 'ಪೆಟ್ಟಿಗೆ'],
    ['Box', 'ಪೆಟ್ಟಿಗೆ'],
    ['Lamp', 'ದೀಪ'],
    ['Light', 'ದೀಪ'],
    ['Canopy', 'ಗುಡಿ'],
    ['Shrine', 'ಗುಡಿ'],
    ['Coastal', 'ಕರಾವಳಿ'],
    ['Basket', 'ಬುಟ್ಟಿ'],
    ['Cane', 'ಬೆತ್ತ'],
    ['Bamboo', 'ಬಿದಿರು'],
    ['Coconut Shell', 'ತೆಂಗಿನ ಚಿಪ್ಪು'],
    ['Brass', 'ಹಿತ್ತಾಳೆ'],
    ['Driftwood', 'ಸಮುದ್ರ ಮರ'],
    ['Wind Chime', 'ಗಾಳಿ ಘಂಟೆ'],
    ['Fisherboat', 'ದೋಣಿ'],
    ['Boat', 'ದೋಣಿ'],
    ['Carved', 'ಕೆತ್ತನೆ'],
    ['Hand-Carved', 'ಕೈ ಕೆತ್ತನೆ'],
    ['Wall Artwork', 'ಗೋಡೆ ಕಲಾಚಿತ್ರ'],
    ['Clock', 'ಗಡಿಯಾರ'],
    ['Mirror', 'ಕನ್ನಡಿ'],
    ['Tray', 'ಟ್ರೇ'],
    ['Platter', 'ತಟ್ಟೆ']
  ],
  hi: [
    ['Kasuti', 'कसूती'],
    ['Embroidery', 'कढ़ाई'],
    ['Temple', 'मंदिर'],
    ['Gopuram', 'गोपुरम'],
    ['Handwoven', 'हथकरघा'],
    ['Hand-Embroidered', 'हस्त-कसीदाकारी'],
    ['Saree', 'साड़ी'],
    ['Peacock', 'मयूर'],
    ['Khadi', 'खादी'],
    ['Tapestry', 'टेपेस्ट्री'],
    ['Chariot', 'रथ'],
    ['Lotus', 'कमल'],
    ['Silk', 'रेशम'],
    ['Dupatta', 'दुपट्टा'],
    ['Stole', 'स्टोल'],
    ['Blouse', 'ब्लाउज'],
    ['Beedu', 'बीडू'],
    ['Sacred', 'पवित्र'],
    ['Daiva', 'दैव'],
    ['Palm-Lattice', 'ताड़-जालीदार'],
    ['Storage', 'स्टोरेज'],
    ['Chest', 'संदूक'],
    ['Box', 'डिब्बा'],
    ['Lamp', 'लैंप'],
    ['Light', 'लाइट'],
    ['Canopy', 'छतरी'],
    ['Shrine', 'मंदिर'],
    ['Coastal', 'तटीय'],
    ['Basket', 'टोकरी'],
    ['Cane', 'बेंत'],
    ['Bamboo', 'बांस'],
    ['Coconut Shell', 'नारियल शेल'],
    ['Brass', 'पीतल'],
    ['Driftwood', 'ड्रिफ्टवुड'],
    ['Wind Chime', 'विंड चाइम'],
    ['Fisherboat', 'मछुआरा नाव'],
    ['Boat', 'नाव'],
    ['Carved', 'नक्काशीदार'],
    ['Hand-Carved', 'हस्त-नक्काशीदार'],
    ['Wall Artwork', 'वॉल आर्टवर्क'],
    ['Clock', 'घड़ी'],
    ['Mirror', 'दर्पण'],
    ['Tray', 'ट्रे'],
    ['Platter', 'थाली']
  ],
  ml: [
    ['Kasuti', 'കസൂതി'],
    ['Embroidery', 'എംബ്രോയിഡറി'],
    ['Temple', 'ക്ഷേത്ര'],
    ['Gopuram', 'ഗോപുരം'],
    ['Handwoven', 'കൈത്തറി'],
    ['Hand-Embroidered', 'കൈത്തയ്യൽ'],
    ['Saree', 'സാരി'],
    ['Peacock', 'മയിൽ'],
    ['Khadi', 'ഖാദി'],
    ['Tapestry', 'ടാപെസ്ട്രി'],
    ['Chariot', 'രഥം'],
    ['Lotus', 'താമര'],
    ['Silk', 'പട്ട്'],
    ['Dupatta', 'ദുപ്പട്ട'],
    ['Stole', 'ഷോൾ'],
    ['Blouse', 'ബ്ലൗസ്'],
    ['Beedu', 'ബീഡു'],
    ['Sacred', 'വിശുദ്ധ'],
    ['Daiva', 'ദൈവ'],
    ['Palm-Lattice', 'പനയോല'],
    ['Storage', 'സംഭരണ'],
    ['Chest', 'പെട്ടി'],
    ['Box', 'പെട്ടി'],
    ['Lamp', 'വിളക്ക്'],
    ['Light', 'വിളക്ക്'],
    ['Canopy', 'മേൽക്കൂര'],
    ['Shrine', 'ക്ഷേത്രം'],
    ['Coastal', 'തീരദേശ'],
    ['Basket', 'കുട്ട'],
    ['Cane', 'ചൂരൽ'],
    ['Bamboo', 'മുള'],
    ['Coconut Shell', 'ചിരട്ട'],
    ['Brass', 'പിച്ചള'],
    ['Driftwood', 'കടൽത്തടി'],
    ['Wind Chime', 'വിൻഡ് ചൈം'],
    ['Fisherboat', 'വള്ളം'],
    ['Boat', 'തോണി'],
    ['Carved', 'കൊത്തുപണി'],
    ['Hand-Carved', 'കൈകൊണ്ട് കൊത്തിയ'],
    ['Wall Artwork', 'ചുവർ ചിത്രം'],
    ['Clock', 'ക്ലോക്ക്'],
    ['Mirror', 'കണ്ണാടി'],
    ['Tray', 'ട്രേ'],
    ['Platter', 'പ്ലേറ്റർ']
  ]
};

/**
 * Get localized product title in the active language
 * @param {Object|string} productOrTitle - Product object or raw title
 * @param {string} langCode - 'kn-IN', 'hi-IN', 'ml-IN', 'en-IN'
 * @returns {string} Localized title
 */
export function getLocalizedProductTitle(productOrTitle, langCode = 'en-IN') {
  if (!productOrTitle) return '';
  const rawTitle = typeof productOrTitle === 'string' ? productOrTitle : (productOrTitle.title || '');
  const langKey = (langCode || 'en-IN').split('-')[0].toLowerCase();

  // If English, return raw English title
  if (langKey === 'en') {
    return rawTitle;
  }

  // 1. Direct dictionary match
  if (PRODUCT_TITLE_MAP[rawTitle] && PRODUCT_TITLE_MAP[rawTitle][langKey]) {
    return PRODUCT_TITLE_MAP[rawTitle][langKey];
  }

  // Check product id match if product is an object
  if (typeof productOrTitle === 'object' && productOrTitle.id) {
    for (const [key, map] of Object.entries(PRODUCT_TITLE_MAP)) {
      if (key.toLowerCase().includes(productOrTitle.id.replace('prod_', '').replace(/_/g, ' '))) {
        if (map[langKey]) return map[langKey];
      }
    }
  }

  // 2. Intelligent glossary substitution fallback
  const glossaries = GLOSSARY_MAP[langKey];
  if (glossaries) {
    let translated = rawTitle;
    for (const [engWord, targetWord] of glossaries) {
      const reg = new RegExp(`\\b${engWord}\\b`, 'gi');
      translated = translated.replace(reg, targetWord);
    }
    return translated;
  }

  return rawTitle;
}

/**
 * Translate or adapt a craft story into the selected language
 * @param {string} originalText - The English database narration or story
 * @param {string} artisanName - The artisan's name
 * @param {string} craftTitle - The product title
 * @param {string} category - Craft category (Kasuti Embroidery, Beedu Craft, Coastal Wood & Shell)
 * @param {string} langCode - 'kn-IN', 'hi-IN', 'ml-IN', 'en-IN'
 */
export function getLocalizedCraftStory(originalText, artisanName, craftTitle, category, langCode = 'en-IN') {
  const langKey = (langCode || 'en-IN').split('-')[0].toLowerCase();

  // If language is English, return original narration or standard fallback
  if (langKey === 'en') {
    return originalText || `Namaskara! This authentic piece is handcrafted by ${artisanName || 'master artisans'}. Every stitch and lattice motif represents generations of sacred craft tradition in Karnataka.`;
  }

  // Multilingual translations for craft categories & narratives
  if (langKey === 'kn') {
    // Kannada
    if (category?.includes('Kasuti') || craftTitle?.includes('Kasuti') || craftTitle?.includes('Saree')) {
      return `ನಮಸ್ಕಾರ! ಈ ಅದ್ಭುತ ಕಸೂತಿ ಕಲಾಕೃತಿಯನ್ನು ${artisanName || 'ಧಾರವಾಡದ ಮಾಸ್ಟರ್ ಕಲಾಕಾರರು'} ನೂಲಿನ ಎಣಿಕೆಯ ಪವಿತ್ರ ವಿಧಾನದಲ್ಲಿ ಕೈಯಾರೆ ರಚಿಸಿದ್ದಾರೆ. ಗೋಪುರ, ರಥ ಮತ್ತು ಕಮಲದ ವಿನ್ಯಾಸಗಳು ಶತಮಾನಗಳ ಕರ್ನಾಟಕದ ಪರಂಪರೆಯನ್ನು ಸಾರುತ್ತವೆ. ಪ್ರತಿಯೊಂದು ಹೊಲಿಗೆಯೂ ಶುದ್ಧ ಕೈಕೆಲಸವಾಗಿದೆ.`;
    }
    if (category?.includes('Beedu') || craftTitle?.includes('Beedu') || craftTitle?.includes('Lamp')) {
      return `ನಮಸ್ಕಾರ! ಉಡುಪಿಯ ಕರಾವಳಿ ಪರಂಪರೆಯ ಈ ಪವಿತ್ರ ಬೀಡು ಬೆತ್ತದ ಕಲಾಕೃತಿಯನ್ನು ${artisanName || 'ಗಣೇಶ್ ದೇವಡಿಗ'} ಯಾವುದೇ ಮೊಳೆಗಳಿಲ್ಲದೆ ನೈಸರ್ಗಿಕವಾಗಿ ನೇಯ್ದಿದ್ದಾರೆ. ಇದರ ಜ್ಯಾಮಿತೀಯ ಬೆಳಕಿನ ವಿನ್ಯಾಸವು ದೇವಸ್ಥಾನದ ಮಂಗಳಕರ ಪರಿಸರವನ್ನು ಮನೆಯೊಳಗೆ ತರುತ್ತದೆ.`;
    }
    if (category?.includes('Wood') || category?.includes('Shell') || craftTitle?.includes('Diya')) {
      return `ನಮಸ್ಕಾರ! ಉತ್ತರ ಕನ್ನಡದ ಕಡಲತೀರದ ತೆಂಗಿನ ಚಿಪ್ಪು ಮತ್ತು ನೈಸರ್ಗಿಕ ಮರದಿಂದ ಈ ವಿಶಿಷ್ಟ ಕಲಾಕೃತಿಯನ್ನು ${artisanName || 'ಮಾಸ್ಟರ್ ಕುಶಲಕರ್ಮಿಗಳು'} ನೈಸರ್ಗಿಕ ಎಣ್ಣೆ ಮತ್ತು ನದಿಯ ಮರಳಿನಿಂದ ಹೊಳಪು ನೀಡಿ ತಯಾರಿಸಿದ್ದಾರೆ. ಪರಿಸರಸ್ನೇಹಿ ಮತ್ತು ಚಿರಸ್ಥಾಯಿ ಕಲೆಯಾಗಿದೆ.`;
    }
    return `ನಮಸ್ಕಾರ! ಈ ಅಸಲಿ ಕರಕುಶಲ ಕಲಾಕೃತಿಯನ್ನು ${artisanName || 'ಕರ್ನಾಟಕದ ಕಲಾಕಾರರು'} ಅತ್ಯಂತ ಶ್ರದ್ಧೆಯಿಂದ ಕೈಯಾರೆ ನಿರ್ಮಿಸಿದ್ದಾರೆ. ನಿಮ್ಮ ಪ್ರತಿಯೊಂದು ಖರೀದಿಯೂ ಗ್ರಾಮೀಣ ಕಲಾ ಕುಟುಂಬಗಳಿಗೆ ನೇರವಾಗಿ ತಲುಪುತ್ತದೆ.`;
  }

  if (langKey === 'hi') {
    // Hindi
    if (category?.includes('Kasuti') || craftTitle?.includes('Kasuti') || craftTitle?.includes('Saree')) {
      return `नमस्ते! यह प्रामाणिक कसूती कढ़ाई कलाकृति ${artisanName || 'मास्टर शिल्पकार'} द्वारा धागों की बारीक गिनती से हाथ से तैयार की गई है। इसके मंदिर, रथ और कमल के रूपांकन सदियों पुरानी कर्नाटक की समृद्ध परंपरा को दर्शाते हैं।`;
    }
    if (category?.includes('Beedu') || craftTitle?.includes('Beedu') || craftTitle?.includes('Lamp')) {
      return `नमस्ते! उडुपी की तटीय परंपरा की यह पवित्र बीडू बेंत कलाकृति ${artisanName || 'गणेश देवडिगा'} द्वारा बिना किसी कील के प्राकृतिक रूप से बुनी गई है। इसके ज्यामितीय पैटर्न घर में एक शांत और दिव्य वातावरण लाते हैं।`;
    }
    if (category?.includes('Wood') || category?.includes('Shell') || craftTitle?.includes('Diya')) {
      return `नमस्ते! उत्तर कन्नड़ के समुद्री तटों के नारियल के खोल और प्राकृतिक लकड़ी से यह कलाकृति ${artisanName || 'कारीगरों'} द्वारा तैयार की गई है। इसे प्राकृतिक तेलों से पॉलिश किया गया है जो पर्यावरण के अनुकूल है।`;
    }
    return `नमस्ते! यह प्रामाणिक हस्तशिल्प ${artisanName || 'कर्नाटक के कारीगरों'} द्वारा पूरी निष्ठा से बनाया गया है। आपकी खरीदारी सीधे ग्रामीण कारीगर परिवारों को सशक्त बनाती है।`;
  }

  if (langKey === 'ml') {
    // Malayalam
    if (category?.includes('Kasuti') || craftTitle?.includes('Kasuti') || craftTitle?.includes('Saree')) {
      return `നമസ്കാരം! കസൂതി എംബ്രോയിഡറിയിൽ തീർത്ത ഈ വിശിഷ്ട കലാസൃഷ്ടി ${artisanName || 'വിദഗ്ദ്ധ കരകൗശലത്തൊഴിലാളി'} നൂലുകൾ എണ്ണി കൈകൊണ്ട് നെയ്തതാണ്. ക്ഷേത്ര ഗോപുരങ്ങളുടെയും രഥങ്ങളുടെയും രൂപങ്ങൾ കർണാടകയുടെ സമ്പന്നമായ പാരമ്പര്യത്തെ വിളിച്ചോതുന്നു.`;
    }
    if (category?.includes('Beedu') || craftTitle?.includes('Beedu') || craftTitle?.includes('Lamp')) {
      return `നമസ്കാരം! ഉഡുപ്പിയുടെ തീരദേശ പാരമ്പര്യമായ ഈ വിശുദ്ധ ബീഡു ചൂരൽ ശില്പം ${artisanName || 'ഗണേഷ് ദേവഡിഗ'} ആണികളൊന്നും ഉപയോഗിക്കാതെ സ്വാഭാവികമായി നെയ്തെടുത്തതാണ്. ഇതിന്റെ ജ്യാമിതീയ ഡിസൈൻ വീടുകളിൽ ദൈവിക വെളിച്ചം പരത്തുന്നു.`;
    }
    if (category?.includes('Wood') || category?.includes('Shell') || craftTitle?.includes('Diya')) {
      return `നമസ്കാരം! ഉത്തര കന്നഡ തീരത്തെ ചിരട്ടയും തടിയും ഉപയോഗിച്ച് ${artisanName || 'കരകൗശല വിദഗ്ദ്ധർ'} നിർമ്മിച്ചതാണ് ഈ ഉൽപ്പന്നം. പ്രകൃതിദത്ത എണ്ണകൾ പുരട്ടി പോളിഷ് ചെയ്ത പരിസ്ഥിതി സൗഹൃദ സൃഷ്ടിയാണിത്.`;
    }
    return `നമസ്കാരം! കർണാടകയിലെ പരമ്പരാഗത കരകൗശല വിദഗ്ദ്ധർ ${artisanName || 'കലാകാരന്മാർ'} ഭക്തിയോടെ നിർമ്മിച്ചതാണ് ഈ വിശിഷ്ട സൃഷ്ടി. നിങ്ങളുടെ ഓരോ വാങ്ങലും ഗ്രാമീണ കുടുംബങ്ങൾക്ക് തുണയാകുന്നു.`;
  }

  return originalText;
}
