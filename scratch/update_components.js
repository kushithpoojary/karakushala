const fs = require('fs');

// 1. Update CustomerOrdersPage.jsx
const ordersPath = 'd:/colossus/karakushala/frontend/src/components/CustomerOrdersPage.jsx';
let ordersCode = fs.readFileSync(ordersPath, 'utf8');

// Replace status badge texts
ordersCode = ordersCode.replace("<span>Placed (ಸ್ವೀಕರಿಸಲಾಗಿದೆ)</span>", "<span>{t('statusPlaced')}</span>");
ordersCode = ordersCode.replace("<span>Confirmed (ಖಚಿತಪಡಿಸಲಾಗಿದೆ)</span>", "<span>{t('statusConfirmed')}</span>");
ordersCode = ordersCode.replace("<span>Being crafted (ರಚಿಸಲಾಗುತ್ತಿದೆ)</span>", "<span>{t('statusBeingCrafted')}</span>");
ordersCode = ordersCode.replace("<span>Packed (ಪ್ಯಾಕ್ ಮಾಡಲಾಗಿದೆ)</span>", "<span>{t('statusPacked')}</span>");
ordersCode = ordersCode.replace("<span>Shipped (ರವಾನಿಸಲಾಗಿದೆ)</span>", "<span>{t('statusShipped')}</span>");
ordersCode = ordersCode.replace("<span>Out for Delivery (ವಿತರಣೆಗೆ ಹೊರಟಿದೆ)</span>", "<span>{t('statusOutForDelivery')}</span>");
ordersCode = ordersCode.replace("<span>Delivered (ತಲುಪಿಸಲಾಗಿದೆ)</span>", "<span>{t('statusDelivered')}</span>");
ordersCode = ordersCode.replace("<span>Cancelled (ರದ್ದುಮಾಡಲಾಗಿದೆ)</span>", "<span>{t('statusCancelled')}</span>");

// Replace Header texts
ordersCode = ordersCode.replace("Customer Portal • ಗ್ರಾಹಕರ ಆರ್ಡರ್‌ಗಳು", "{t('customerPortal')}");
ordersCode = ordersCode.replace("<h1 className=\"font-serif text-2xl sm:text-4xl font-bold text-indigo-950\">\r\n            My Handcrafted Orders\r\n          </h1>", "<h1 className=\"font-serif text-2xl sm:text-4xl font-bold text-indigo-950\">\r\n            {t('myOrdersTitle')}\r\n          </h1>");
ordersCode = ordersCode.replace("<h1 className=\"font-serif text-2xl sm:text-4xl font-bold text-indigo-950\">\n            My Handcrafted Orders\n          </h1>", "<h1 className=\"font-serif text-2xl sm:text-4xl font-bold text-indigo-950\">\n            {t('myOrdersTitle')}\n          </h1>");

ordersCode = ordersCode.replace("Track your authentic Karnataka Kasuti, coastal Beedu cane weaves, and wood carvings straight from the master artisan's cluster to your doorstep.", "{t('myOrdersSub')}");
ordersCode = ordersCode.replace('placeholder="Track by Order # or AWB..."', "placeholder={t('trackSearchPlaceholder')}");
ordersCode = ordersCode.replace('<span>Track Order</span>\r\n            <ArrowRight', "<span>{t('trackOrder')}</span>\r\n            <ArrowRight");
ordersCode = ordersCode.replace('<span>Track Order</span>\n            <ArrowRight', "<span>{t('trackOrder')}</span>\n            <ArrowRight");

// Filter pills
ordersCode = ordersCode.replace("{tab === 'All' && 'All Orders (ಎಲ್ಲವೂ)'}", "{tab === 'All' && t('filterAll')}");
ordersCode = ordersCode.replace("{tab === 'In Progress' && 'Active / In Crafting (ಸಿದ್ಧತೆ/ರವಾನೆ)'}", "{tab === 'In Progress' && t('filterInProgress')}");
ordersCode = ordersCode.replace("{tab === 'Delivered' && 'Delivered (ತಲುಪಿದೆ)'}", "{tab === 'Delivered' && t('filterDelivered')}");
ordersCode = ordersCode.replace("{tab === 'Cancelled' && 'Cancelled (ರದ್ದು)'}", "{tab === 'Cancelled' && t('filterCancelled')}");

// Explore button
ordersCode = ordersCode.replace("Explore Heritage Crafts • ಕಲಾಕೃತಿಗಳನ್ನು ನೋಡಿ", "{t('exploreHeritageCrafts') || 'Explore Heritage Crafts'}");

// Shipping strip labels
ordersCode = ordersCode.replace("Estimated Delivery (ತಲುಪುವ ದಿನಾಂಕ)", "{t('estimatedDelivery')}");
ordersCode = ordersCode.replace("Courier Partner (ಕೊರಿಯರ್)", "{t('courierPartner')}");
ordersCode = ordersCode.replace("Tracking Number (AWB)", "{t('trackingNumber')}");

// Cancelled notice banner
ordersCode = ordersCode.replace("Order Cancelled (ರದ್ದುಮಾಡಲಾಗಿದೆ)", "{t('orderCancelledTitle')}");
ordersCode = ordersCode.replace("Refund Processed", "{t('refundProcessed')}");

// Footer action buttons
ordersCode = ordersCode.replace("Cancel Order (ಆರ್ಡರ್ ರದ್ದು)", "{t('cancelOrderBtn')}");
ordersCode = ordersCode.replace("Order Help (ಸಹಾಯ)", "{t('orderHelp')}");
ordersCode = ordersCode.replace("Track Order (ಲೈವ್ ಟ್ರ್ಯಾಕ್)", "{t('trackOrder')}");

fs.writeFileSync(ordersPath, ordersCode, 'utf8');
console.log('CustomerOrdersPage.jsx updated successfully');
