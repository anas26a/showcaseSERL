import { createContext, useContext, useState } from 'react';

const FullScreenContext = createContext();

export const FullScreenProvider = ({ children }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  return (
    <FullScreenContext.Provider value={{ isFullScreen, setIsFullScreen }}>
      {children}
    </FullScreenContext.Provider>
  );
};

export const useFullScreen = () => useContext(FullScreenContext);
