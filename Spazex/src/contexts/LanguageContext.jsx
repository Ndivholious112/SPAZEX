import React, { createContext, useContext, useState, useEffect } from 'react';

// Translations object
const translations = {
  en: {
    appName: 'Spazex',
    dashboard: 'Dashboard',
    inventory: 'Inventory',
    sales: 'Sales',
    forecast: 'Forecast',
    aiCoach: 'AI Coach',
    suppliers: 'Suppliers',
    settings: 'Settings',
    welcome: 'Welcome back',
    totalRevenue: 'Total Revenue',
    totalOrders: 'Total Orders',
    lowStock: 'Low Stock Items',
    profitMargin: 'Profit Margin',
  },
  zu: {
    appName: 'Spazex',
    dashboard: 'Ishadi',
    inventory: 'Uhlu lwezinto',
    sales: 'Ukuthengisa',
    forecast: 'Isibikezelo',
    aiCoach: 'Umqeqeshi we-AI',
    suppliers: 'Abahlinzeki',
    settings: 'Izilungiselelo',
    welcome: 'Siyakwamukela',
    totalRevenue: 'Imali etholwayo',
    totalOrders: 'Ama-oda aphelele',
    lowStock: 'Izinto eziphansi',
    profitMargin: 'Inzuzo',
  },
  xh: {
    appName: 'Spazex',
    dashboard: 'Idashibhodi',
    inventory: 'Uluhlu lweempahla',
    sales: 'Intengiso',
    forecast: 'Uqikelelo',
    aiCoach: 'Umqeqeshi we-AI',
    suppliers: 'Ababoneleli',
    settings: 'Izicwangciso',
    welcome: 'Wamkelekile',
    totalRevenue: 'Ingeniso iyonke',
    totalOrders: 'Ii-oda zizonke',
    lowStock: 'Impahla ephantsi',
    profitMargin: 'Inzuzo',
  },
  af: {
    appName: 'Spazex',
    dashboard: 'Paneelbord',
    inventory: 'Voorraad',
    sales: 'Verkope',
    forecast: 'Voorspelling',
    aiCoach: 'AI-Afrigter',
    suppliers: 'Verskaffers',
    settings: 'Instellings',
    welcome: 'Welkom terug',
    totalRevenue: 'Totale Inkomste',
    totalOrders: 'Totale Bestellings',
    lowStock: 'Lae Voorraad',
    profitMargin: 'Winsmarge',
  },
  st: {
    appName: 'Spazex',
    dashboard: 'Dashboard',
    inventory: 'Lethathamo la thepa',
    sales: 'Thekiso',
    forecast: 'Polelo esale pele',
    aiCoach: 'Mokoetlisi wa AI',
    suppliers: 'Bafani',
    settings: 'Dihlophiso',
    welcome: 'Re a go amohela',
    totalRevenue: 'Kakaretso ya madi',
    totalOrders: 'Kakaretso ya di-oda',
    lowStock: 'Thepa e fokolang',
    profitMargin: 'Phala ya phaello',
  },
  ts: {
    appName: 'Spazex',
    dashboard: 'Dashboard',
    inventory: 'Nxaxamelo ya swilo',
    sales: 'Makutiso',
    forecast: 'Mpimo wa ku rhula',
    aiCoach: 'Mudyondzisi wa AI',
    suppliers: 'Varhumi',
    settings: 'Swilungiso',
    welcome: 'Amukela',
    totalRevenue: 'Mali hinkwayo',
    totalOrders: 'Tiodara hinkwato',
    lowStock: 'Swilo swa le hansi',
    profitMargin: 'Vuyelo',
  },
};

// Create the context
const LanguageContext = createContext();

// Create the provider component
export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('spazex_language');
    return saved || 'en';
  });

  useEffect(() => {
    localStorage.setItem('spazex_language', language);
  }, [language]);

  const t = (key) => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  const value = {
    language,
    setLanguage,
    t,
    translations,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// Create the custom hook
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;