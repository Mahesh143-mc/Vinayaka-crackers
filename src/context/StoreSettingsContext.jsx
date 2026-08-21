import React, { createContext, useContext, useState, useEffect } from 'react';
import { subscribeStoreSettings, saveStoreSettingsToFirestore } from '../services/firebaseService';
import { useToast } from './ToastContext';

const StoreSettingsContext = createContext();

export const defaultStoreSettings = {
  companyName: 'Karuppa Crackers',
  storeName: 'Karuppa Crackers',
  tagline: 'Direct from Sivakasi • Premium Fireworks Manufacturer',
  logo: 'https://res.cloudinary.com/vf0fqhwo/image/upload/v1786363324/logo_q7lezq.jpg',
  companyLogo: 'https://res.cloudinary.com/vf0fqhwo/image/upload/v1786363324/logo_q7lezq.jpg',
  phone: '8825419454',
  supportPhone: '8825419454',
  whatsapp: '8825419454',
  email: 'chimeratechweb@gmail.com',
  supportEmail: 'chimeratechweb@gmail.com',
  gstNumber: '33AAAAA0000A1Z5',
  address: '124/B, Sivakasi Main Road, Near Bus Stand',
  city: 'Sivakasi',
  state: 'Tamil Nadu',
  pincode: '626123',
  country: 'India',
  gstPercentage: 18,
  festiveDiscount: 80
};

export const StoreSettingsProvider = ({ children }) => {
  const [storeSettings, setStoreSettings] = useState(defaultStoreSettings);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const unsubscribe = subscribeStoreSettings((firestoreData) => {
      if (firestoreData) {
        setStoreSettings(prev => ({
          ...defaultStoreSettings,
          ...firestoreData,
          companyName: firestoreData.companyName || firestoreData.storeName || defaultStoreSettings.companyName,
          storeName: firestoreData.storeName || firestoreData.companyName || defaultStoreSettings.storeName,
          phone: firestoreData.phone || firestoreData.supportPhone || defaultStoreSettings.phone,
          supportPhone: firestoreData.supportPhone || firestoreData.phone || defaultStoreSettings.supportPhone,
          email: firestoreData.email || firestoreData.supportEmail || defaultStoreSettings.email,
          supportEmail: firestoreData.supportEmail || firestoreData.email || defaultStoreSettings.supportEmail
        }));

        const logoUrl = firestoreData.logo || firestoreData.companyLogo;
        if (logoUrl) {
          let link = document.querySelector("link[rel~='icon']");
          if (link) {
            link.href = logoUrl;
          }
        }
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updateStoreSettings = async (newSettings) => {
    try {
      const merged = {
        ...storeSettings,
        ...newSettings
      };
      // Preserve existing logo if not explicitly in newSettings
      if (!newSettings.logo && storeSettings.logo) {
        merged.logo = storeSettings.logo;
        merged.companyLogo = storeSettings.companyLogo || storeSettings.logo;
      }
      setStoreSettings(merged);
      await saveStoreSettingsToFirestore(merged);
      return { success: true };
    } catch (err) {
      console.error("Error saving store settings:", err);
      if (showToast) {
        showToast('Failed to save store settings to database', 'error');
      }
      return { success: false, error: err };
    }
  };

  return (
    <StoreSettingsContext.Provider value={{ storeSettings, updateStoreSettings, isLoading }}>
      {children}
    </StoreSettingsContext.Provider>
  );
};

export const useStoreSettings = () => {
  const context = useContext(StoreSettingsContext);
  if (!context) {
    return {
      storeSettings: defaultStoreSettings,
      updateStoreSettings: async () => {},
      isLoading: false
    };
  }
  return context;
};
