import { createContext, useContext, useState } from 'react';

const BannerContext = createContext();

export const useBanner = () => useContext(BannerContext);

export const BannerProvider = ({ children }) => {
  const [reloadBanner, setReloadBanner] = useState(0);

  const triggerReload = () => setReloadBanner(prev => prev + 1);

  return (
    <BannerContext.Provider value={{ reloadBanner, triggerReload }}>
      {children}
    </BannerContext.Provider>
  );
};
