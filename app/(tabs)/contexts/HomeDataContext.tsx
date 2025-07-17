import React, { createContext, useContext, useState } from "react";

interface HomeData {
  popularAuthors: string[];
  booksOfMonth: any[];
  suggestedBooks: any[];
}

interface HomeDataContextType {
  homeData: HomeData | null;
  setHomeData: React.Dispatch<React.SetStateAction<HomeData | null>>;
}

const HomeDataContext = createContext<HomeDataContextType | undefined>(undefined);

export const HomeDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [homeData, setHomeData] = useState<HomeData | null>(null);

  return (
    <HomeDataContext.Provider value={{ homeData, setHomeData }}>
      {children}
    </HomeDataContext.Provider>
  );
};

export const useHomeData = () => {
  const context = useContext(HomeDataContext);
  if (!context) {
    throw new Error("useHomeData must be used within a HomeDataProvider");
  }
  return context;
};
