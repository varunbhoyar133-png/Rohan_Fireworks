import React, { createContext, useContext, useState, useEffect } from 'react';
import { useStoreSettings } from './StoreSettingsContext';

const EnquiryContext = createContext();

const STORAGE_KEY = 'rohan_festive_wishlist';

export const EnquiryProvider = ({ children }) => {
  const { settings } = useStoreSettings();
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn('Failed to save enquiry list to local storage:', e);
    }
  }, [items]);

  const addItem = (product, quantity = 1) => {
    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((i) => i.productId === product._id);
      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [
          ...prevItems,
          {
            productId: product._id,
            name: product.name,
            sku: product.sku,
            price: product.price,
            originalPrice: product.originalPrice,
            packSize: product.packSize,
            image: product.images?.[0] || '',
            stock: product.stock,
            isGreenCracker: product.isGreenCracker,
            quantity: Math.max(1, quantity),
          },
        ];
      }
    });
    setIsDrawerOpen(true);
  };

  const removeItem = (productId) => {
    setItems((prevItems) => prevItems.filter((i) => i.productId !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearEnquiry = () => {
    setItems([]);
  };

  const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalEstimatedAmount = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const getWhatsAppEnquiryMessage = (customerName = '', city = '') => {
    const lines = [
      `*🪔 Festive Enquiry — Rohan Fireworks*`,
      `Namaste Rohan Fireworks! I would like to enquire about the availability and delivery of the following fireworks items:`,
      '',
    ];

    items.forEach((item, index) => {
      lines.push(`${index + 1}. *${item.name}* (${item.sku})`);
      lines.push(`   Qty: ${item.quantity} ${item.packSize || 'pack'} | Approx: ₹${item.price * item.quantity}`);
    });

    lines.push('');
    lines.push(`*Estimated Catalogue Total:* ₹${totalEstimatedAmount.toLocaleString('en-IN')}`);
    
    if (customerName) {
      lines.push(`*Customer Name:* ${customerName}`);
    }
    if (city) {
      lines.push(`*Delivery City:* ${city}`);
    }

    lines.push('');
    lines.push(`Please share quotation confirmation, payment options, and delivery timeline. Thank you!`);

    return encodeURIComponent(lines.join('\n'));
  };

  const openWhatsAppEnquiry = (customerName = '', city = '') => {
    const rawPhone = settings?.businessInfo?.whatsapp || '+919876543210';
    const cleanPhone = rawPhone.replace(/[^0-9]/g, '');
    const message = getWhatsAppEnquiryMessage(customerName, city);
    const url = `https://wa.me/${cleanPhone}?text=${message}`;
    window.open(url, '_blank');
  };

  return (
    <EnquiryContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearEnquiry,
        totalItemsCount,
        totalEstimatedAmount,
        isDrawerOpen,
        openDrawer: () => setIsDrawerOpen(true),
        closeDrawer: () => setIsDrawerOpen(false),
        isSubmitModalOpen,
        openSubmitModal: () => setIsSubmitModalOpen(true),
        closeSubmitModal: () => setIsSubmitModalOpen(false),
        openWhatsAppEnquiry,
        getWhatsAppEnquiryMessage,
      }}
    >
      {children}
    </EnquiryContext.Provider>
  );
};

export const useEnquiry = () => {
  const context = useContext(EnquiryContext);
  if (!context) {
    throw new Error('useEnquiry must be used within an EnquiryProvider');
  }
  return context;
};
