const fs = require('fs');
const filePath = 'd:/colossus/karakushala/frontend/src/i18n/translations.js';
let content = fs.readFileSync(filePath, 'utf8');

const additions = {
  en: {
    cancelOrderBtn: 'Cancel Order',
    refundProcessed: 'Refund Processed',
    selectReasonToCancel: 'Select Reason to Cancel Order',
    orderCancellationConfirmed: 'Order Cancellation Confirmed',
    closeAndViewOrders: 'Close & View My Orders'
  },
  kn: {
    cancelOrderBtn: 'ಆರ್ಡರ್ ರದ್ದುಮಾಡಿ',
    refundProcessed: 'ಮರುಪಾವತಿ ಪ್ರಕ್ರಿಯೆಗೊಳಿಸಲಾಗಿದೆ',
    selectReasonToCancel: 'ಆರ್ಡರ್ ರದ್ದುಮಾಡಲು ಕಾರಣವನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    orderCancellationConfirmed: 'ಆರ್ಡರ್ ರದ್ದತಿ ಖಚಿತವಾಗಿದೆ',
    closeAndViewOrders: 'ಮುಕ್ತಾಯ ಮತ್ತು ನನ್ನ ಆರ್ಡರ್‌ಗಳನ್ನು ವೀಕ್ಷಿಸಿ'
  },
  hi: {
    cancelOrderBtn: 'ऑर्डर रद्द करें',
    refundProcessed: 'रिफंड संसाधित हुआ',
    selectReasonToCancel: 'ऑर्डर रद्द करने का कारण चुनें',
    orderCancellationConfirmed: 'ऑर्डर रद्दीकरण की पुष्टि हुई',
    closeAndViewOrders: 'बंद करें और मेरे ऑर्डर देखें'
  },
  ml: {
    cancelOrderBtn: 'ഓർഡർ റദ്ദാക്കുക',
    refundProcessed: 'റീഫണ്ട് നൽകി',
    selectReasonToCancel: 'ഓർഡർ റദ്ദാക്കാനുള്ള കാരണം തിരഞ്ഞെടുക്കുക',
    orderCancellationConfirmed: 'ഓർഡർ റദ്ദാക്കൽ സ്ഥിരീകരിച്ചു',
    closeAndViewOrders: 'അടച്ച് എന്റെ ഓർഡറുകൾ കാണുക'
  }
};

for (const [lang, keys] of Object.entries(additions)) {
  const searchAnchor = lang === 'en' ? "orderHelp: 'Order Help'," :
                       lang === 'kn' ? "orderHelp: 'ಆರ್ಡರ್ ಸಹಾಯ'," :
                       lang === 'hi' ? "orderHelp: 'ऑर्डर सहायता'," :
                       "orderHelp: 'ഓർഡർ സഹായം',";
  
  const entriesStr = Object.entries(keys)
    .map(([k, v]) => `    ${k}: '${v}',`)
    .join('\r\n');

  if (content.includes(searchAnchor)) {
    content = content.replace(searchAnchor, searchAnchor + '\r\n' + entriesStr);
    console.log('Added keys for ' + lang);
  } else {
    console.log('Anchor not found for ' + lang);
  }
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('translations.js updated successfully');
