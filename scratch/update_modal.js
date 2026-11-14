const fs = require('fs');

const modalPath = 'd:/colossus/karakushala/frontend/src/components/OrderCancellationModal.jsx';
let modalCode = fs.readFileSync(modalPath, 'utf8');

// 1. Replace CANCELLATION_REASONS definition
const oldReasonsStart = "  const CANCELLATION_REASONS = [";
const oldReasonsEnd = "  ];\r\n\r\n  // Selected reason state";
const oldReasonsEndLF = "  ];\n\n  // Selected reason state";

const newReasons = `  const CANCELLATION_REASONS = [
    {
      id: 'mistake',
      title: {
        en: 'Placed order by mistake / Accidental order',
        kn: 'ಆಕಸ್ಮಿಕವಾಗಿ ಅಥವಾ ತಪ್ಪಾಗಿ ಆರ್ಡರ್ ಮಾಡಲಾಗಿದೆ',
        hi: 'गलती से ऑर्डर दिया गया / अनजाने में ऑर्डर',
        ml: 'അബദ്ധത്തിൽ ഓർഡർ നൽകി / മാറ്റം വരുത്താൻ'
      },
      desc: {
        en: 'Accidental click, duplicate order, or changed mind.',
        kn: 'ತಪ್ಪಾದ ಕ್ಲಿಕ್, ನಕಲಿ ಆರ್ಡರ್ ಅಥವಾ ಮನಸ್ಸು ಬದಲಾಗಿದೆ.',
        hi: 'गलत क्लिक, डुप्लीकेट ऑर्डर, या मन बदल गया।',
        ml: 'അബദ്ധവശാൽ ക്ലിക്ക് ചെയ്തു, ഇരട്ട ഓർഡർ, അല്ലെങ്കിൽ മനസ്സ് മാറി.'
      },
      keywords: ['mistake', 'accidental', 'accident', 'wrong', 'duplicate', 'ತಪ್ಪು', 'ಆಕಸ್ಮಿಕ', 'ಬೇಡ', 'गलती', 'रद्द', 'തെറ്റ്']
    },
    {
      id: 'delivery_delay',
      title: {
        en: 'Delivery time is too long / Delayed arrival',
        kn: 'ತಲುಪಲು ಹೆಚ್ಚು ಸಮಯ ಬೇಕು / ವಿತರಣೆ ತಡವಾಗಿದೆ',
        hi: 'डिलीवरी का समय बहुत लंबा है / देरी से आगमन',
        ml: 'ഡെലിവറി സമയം വളരെ കൂടുതലാണ് / വൈകുന്നു'
      },
      desc: {
        en: 'Estimated arrival date is too late for my requirement.',
        kn: 'ಅಂದಾಜು ದಿನಾಂಕವು ನನ್ನ ಅಗತ್ಯಕ್ಕೆ ತಡವಾಗಿದೆ.',
        hi: 'अनुमानित आगमन तिथि मेरी आवश्यकता के लिए बहुत देर है।',
        ml: 'കണക്കാക്കിയ തീയതി എന്റെ ആവശ്യത്തിന് വളരെ വൈകിയാണ്.'
      },
      keywords: ['delay', 'late', 'long', 'slow', 'urgent', 'time', 'days', 'hours', 'ತಡ', 'ಸಮಯ', 'ಬೇಗ', 'देरी', 'समय', 'വൈകി']
    },
    {
      id: 'address_change',
      title: {
        en: 'Incorrect delivery address or contact number',
        kn: 'ತಪ್ಪಾದ ವಿಳಾಸ ಅಥವಾ ಫೋನ್ ಸಂಖ್ಯೆ',
        hi: 'गलत डिलीवरी पता या संपर्क नंबर',
        ml: 'തെറ്റായ ഡെലിവറി വിലാസം അല്ലെങ്കിൽ ഫോൺ നമ്പർ'
      },
      desc: {
        en: 'Need to change delivery location, door number, or phone.',
        kn: 'ವಿತರಣಾ ಸ್ಥಳ, ಮನೆ ಸಂಖ್ಯೆ ಅಥವಾ ಫೋನ್ ಬದಲಾಯಿಸಬೇಕು.',
        hi: 'डिलीवरी स्थान, मकान नंबर, या फ़ोन बदलने की आवश्यकता है।',
        ml: 'ഡെലിവറി ലൊക്കേഷൻ അല്ലെങ്കിൽ ഫോൺ നമ്പർ മാറ്റണം.'
      },
      keywords: ['address', 'location', 'phone', 'contact', 'city', 'pincode', 'ವಿಳಾಸ', 'ಫೋನ್', 'ಜಾಗ', 'पता', 'फोन', 'വിലാസം']
    },
    {
      id: 'item_change',
      title: {
        en: 'Want to change craft, style, color or size',
        kn: 'ಬೇರೆ ಕಲಾಕೃತಿ, ಗಾತ್ರ, ಬಣ್ಣ ಅಥವಾ ವಿನ್ಯಾಸ ಬೇಕು',
        hi: 'शिल्प, शैली, रंग या आकार बदलना चाहते हैं',
        ml: 'കരകൗശലം, ശൈലി, നിറം അല്ലെങ്കിൽ വലിപ്പം മാറ്റണം'
      },
      desc: {
        en: 'Wish to select a different Kasuti saree, Beedu weave, or craft.',
        kn: 'ಬೇರೆ ಕಸೂತಿ ಸೀರೆ, ಬೀಡು ಹೆಣಿಗೆ ಅಥವಾ ಕಲಾಕೃತಿ ಆಯ್ಕೆ ಮಾಡಲು ಬಯಸುತ್ತೇನೆ.',
        hi: 'अलग कसूती साड़ी, बीड़ू बुनाई या शिल्प चुनना चाहते हैं।',
        ml: 'മറ്റൊരു കസൂതി സാരിയോ കരകൗശല വസ്തുവോ തിരഞ്ഞെടുക്കാൻ ആഗ്രഹിക്കുന്നു.'
      },
      keywords: ['change', 'color', 'size', 'motif', 'saree', 'craft', 'style', 'ಬಣ್ಣ', 'ಗಾತ್ರ', 'ಬೇರೆ', 'रंग', 'साइज', 'നിറം']
    },
    {
      id: 'price_issue',
      title: {
        en: 'Price or shipping cost issue / Found better deal',
        kn: 'ಬೆಲೆ ಅಥವಾ ಶಿಪ್ಪಿಂಗ್ ವೆಚ್ಚದ ಸಮಸ್ಯೆ / ಬೇರೆ ಕಡೆ ಸಿಕ್ಕಿದೆ',
        hi: 'मूल्य या शिपिंग लागत की समस्या / बेहतर डील मिली',
        ml: 'വില അല്ലെങ്കിൽ ഷിപ്പിംഗ് നിരക്ക് പ്രശ്നം / മെച്ചപ്പെട്ട ഡീൽ ലഭിച്ചു'
      },
      desc: {
        en: 'Found alternative at lower price or budget changed.',
        kn: 'ಕಡಿಮೆ ಬೆಲೆಗೆ ಬೇರೆ ಕಡೆ ಲಭ್ಯವಿದೆ ಅಥವಾ ಬಜೆಟ್ ಬದಲಾಗಿದೆ.',
        hi: 'कम कीमत पर विकल्प मिला या बजट बदल गया।',
        ml: 'കുറഞ്ഞ വിലയിൽ മറ്റെവിടെയെങ്കിലും ലഭ്യമായി അല്ലെങ്കിൽ ബജറ്റ് മാറി.'
      },
      keywords: ['price', 'cost', 'expensive', 'deal', 'cheap', 'budget', 'ಬೆಲೆ', 'ಹಣ', 'दाम', 'कीमत', 'വില']
    },
    {
      id: 'payment_issue',
      title: {
        en: 'Payment method issue / Change to COD or UPI',
        kn: 'ಪಾವತಿ ವಿಧಾನದಲ್ಲಿ ಸಮಸ್ಯೆ / COD ಅಥವಾ UPI ಬದಲಾವಣೆ',
        hi: 'भुगतान विधि की समस्या / COD या UPI में बदलें',
        ml: 'പേയ്മെന്റ് രീതിയിലെ പ്രശ്നം / COD അല്ലെങ്കിൽ UPI ലേക്ക് മാറ്റുക'
      },
      desc: {
        en: 'Want to re-order using a different payment option.',
        kn: 'ಬೇರೆ ಪಾವತಿ ವಿಧಾನವನ್ನು ಬಳಸಿಕೊಂಡು ಮರು-ಆರ್ಡರ್ ಮಾಡಲು ಬಯಸುತ್ತೇನೆ.',
        hi: 'अलग भुगतान विकल्प का उपयोग करके फिर से ऑर्डर करना चाहते हैं।',
        ml: 'മറ്റൊരു പേയ്മെന്റ് ഓപ്ഷൻ ഉപയോഗിച്ച് വീണ്ടും ഓർഡർ ചെയ്യാൻ ആഗ്രഹിക്കുന്നു.'
      },
      keywords: ['payment', 'upi', 'cod', 'cash', 'card', 'bank', 'gpay', 'phonepe', 'ಪಾವತಿ', 'भुगतान', 'പണം']
    },
    {
      id: 'other',
      title: {
        en: 'Other reason (Specify with voice or typing)',
        kn: 'ಇತರ ಕಾರಣ (ಧ್ವನಿ ಅಥವಾ ಟೈಪ್ ಮೂಲಕ ತಿಳಿಸಿ)',
        hi: 'अन्य कारण (आवाज या टाइप करके बताएं)',
        ml: 'മറ്റ് കാരണം (വോയ്‌സ് അല്ലെങ്കിൽ ടൈപ്പ് വഴി വ്യക്തമാക്കുക)'
      },
      desc: {
        en: 'Speak or type any specific reason in the box below.',
        kn: 'ಕೆಳಗಿನ ಬಾಕ್ಸ್‌ನಲ್ಲಿ ಯಾವುದೇ ನಿರ್ದಿಷ್ಟ ಕಾರಣವನ್ನು ಮಾತನಾಡಿ ಅಥವಾ ಟೈಪ್ ಮಾಡಿ.',
        hi: 'नीचे दिए गए बॉक्स में कोई विशिष्ट कारण बोलें या टाइप करें।',
        ml: 'താഴെ നൽകിയിരിക്കുന്ന ബോക്സിൽ കാരണം സംസാരിക്കുകയോ ടൈപ്പ് ചെയ്യുകയോ ചെയ്യുക.'
      },
      keywords: ['other', 'different', 'reason', 'something else', 'ಇತರ', 'ಕಾರಣ', 'अन्य', 'കാരണം']
    }
  ];

  const getReasonTitle = (r) => (r && typeof r.title === 'object' ? (r.title[currentLanguage] || r.title.en) : r?.title || '');
  const getReasonDesc = (r) => (r && typeof r.desc === 'object' ? (r.desc[currentLanguage] || r.desc.en) : r?.desc || '');

  // Selected reason state`;

if (modalCode.includes(oldReasonsEnd)) {
  const startIndex = modalCode.indexOf(oldReasonsStart);
  const endIndex = modalCode.indexOf(oldReasonsEnd) + oldReasonsEnd.length;
  modalCode = modalCode.slice(0, startIndex) + newReasons + modalCode.slice(endIndex);
  console.log('Replaced CANCELLATION_REASONS (CRLF)');
} else if (modalCode.includes(oldReasonsEndLF)) {
  const startIndex = modalCode.indexOf(oldReasonsStart);
  const endIndex = modalCode.indexOf(oldReasonsEndLF) + oldReasonsEndLF.length;
  modalCode = modalCode.slice(0, startIndex) + newReasons + modalCode.slice(endIndex);
  console.log('Replaced CANCELLATION_REASONS (LF)');
} else {
  console.log('Could not find CANCELLATION_REASONS block');
}

// 2. Add language sync effect
const sttSyncMarker = "  const [speechSupported, setSpeechSupported] = useState(false);";
const sttSyncCode = `  const [speechSupported, setSpeechSupported] = useState(false);

  useEffect(() => {
    const locale = currentLangConfig?.sttLocale || (currentLanguage === 'kn' ? 'kn-IN' : currentLanguage === 'hi' ? 'hi-IN' : currentLanguage === 'ml' ? 'ml-IN' : 'en-IN');
    setSelectedLanguage(locale);
  }, [currentLanguage, currentLangConfig]);`;

if (modalCode.includes(sttSyncMarker)) {
  modalCode = modalCode.replace(sttSyncMarker, sttSyncCode);
  console.log('Added language sync effect');
}

// 3. Update header titles
modalCode = modalCode.replace(
  "{isCancelledSuccess ? 'Order Cancellation Confirmed' : 'Select Reason to Cancel Order'}",
  "{isCancelledSuccess ? (t('orderCancellationConfirmed') || 'Order Cancellation Confirmed') : (t('selectReasonToCancel') || 'Select Reason to Cancel Order')}"
);
modalCode = modalCode.replace("Cancel Order • ಕಾರಣಗಳು", "{t('cancelOrderBtn') || 'Cancel Order'}");

// 4. Update reason item rendering
modalCode = modalCode.replace("{r.title}", "{getReasonTitle(r)}");
modalCode = modalCode.replace("{r.desc}", "{getReasonDesc(r)}");
modalCode = modalCode.replace(
  `<span className="text-[10px] text-terracotta-700 font-semibold block">\r\n                            {r.kannada}\r\n                          </span>`,
  ""
);
modalCode = modalCode.replace(
  `<span className="text-[10px] text-terracotta-700 font-semibold block">\n                            {r.kannada}\n                          </span>`,
  ""
);

// 5. Update selected reason display in settlement card
modalCode = modalCode.replace("{selectedReasonObj?.title}", "{getReasonTitle(selectedReasonObj)}");

// 6. Update Close button
modalCode = modalCode.replace("Close & View My Orders (ಮುಕ್ತಾಯ)", "{t('closeAndViewOrders') || 'Close & View My Orders'}");

// 7. Update language buttons to all 4 languages
const oldLangButtonsTarget = `<div className="flex items-center gap-1 bg-white p-0.5 rounded-xl border border-cream-300 text-[11px] font-bold">
                    <button
                      type="button"
                      onClick={() => setSelectedLanguage('en-IN')}
                      className={\`px-2 py-0.5 rounded-lg transition-all \${
                        selectedLanguage === 'en-IN'
                          ? 'bg-indigo-950 text-white shadow-xs'
                          : 'text-stone-600 hover:text-stone-900'
                      }\`}
                    >
                      English
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedLanguage('kn-IN')}
                      className={\`px-2 py-0.5 rounded-lg transition-all \${
                        selectedLanguage === 'kn-IN'
                          ? 'bg-terracotta-600 text-white shadow-xs'
                          : 'text-stone-600 hover:text-stone-900'
                      }\`}
                    >
                      ಕನ್ನಡ
                    </button>
                  </div>`;

const newLangButtons = `<div className="flex items-center gap-1 bg-white p-0.5 rounded-xl border border-cream-300 text-[11px] font-bold">
                    {[
                      { code: 'en-IN', label: 'English' },
                      { code: 'kn-IN', label: 'ಕನ್ನಡ' },
                      { code: 'hi-IN', label: 'हिंदी' },
                      { code: 'ml-IN', label: 'മലയാളം' }
                    ].map(lang => (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => setSelectedLanguage(lang.code)}
                        className={\`px-2 py-0.5 rounded-lg transition-all \${
                          selectedLanguage === lang.code
                            ? 'bg-indigo-950 text-white shadow-xs'
                            : 'text-stone-600 hover:text-stone-900'
                        }\`}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </div>`;

modalCode = modalCode.replace(oldLangButtonsTarget.replace(/\r\n/g, '\n'), newLangButtons);
modalCode = modalCode.replace(oldLangButtonsTarget.replace(/\n/g, '\r\n'), newLangButtons);

// 8. Update section headers (remove hardcoded Kannada parentheticals)
modalCode = modalCode.replace(
  `<span className="text-terracotta-700 font-semibold">(ರದ್ದತಿಗೆ ಕಾರಣವನ್ನು ಆಯ್ಕೆಮಾಡಿ)</span>`,
  ""
);
modalCode = modalCode.replace(
  `<span className="text-terracotta-700 font-semibold">(ಧ್ವನಿ ಅಥವಾ ಸಂಖ್ಯೆಗಳನ್ನು ಹೇಳಿ)</span>`,
  ""
);

fs.writeFileSync(modalPath, modalCode, 'utf8');
console.log('OrderCancellationModal.jsx updated successfully');
