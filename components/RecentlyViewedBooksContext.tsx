import React, { createContext, ReactNode, useContext, useState } from "react";

interface RecentlyViewedBooksContextType {
  recentlyViewed: string[];
  addRecentlyViewed: (bookId: string) => void;
  clearRecentlyViewed: () => void;
}

const RecentlyViewedBooksContext = createContext<
  RecentlyViewedBooksContextType | undefined
>(undefined);

export const RecentlyViewedBooksProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);

  const addRecentlyViewed = (bookId: string) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((id) => id !== bookId);
      const updated = [bookId, ...filtered];
      return updated.slice(0, 10);
    });
  };

  const clearRecentlyViewed = () => setRecentlyViewed([]);

  return (
    <RecentlyViewedBooksContext.Provider
      value={{ recentlyViewed, addRecentlyViewed, clearRecentlyViewed }}
    >
      {children}
    </RecentlyViewedBooksContext.Provider>
  );
};

export const useRecentlyViewedBooks = () => {
  const context = useContext(RecentlyViewedBooksContext);
  if (!context) {
    throw new Error(
      "useRecentlyViewedBooks must be used within a RecentlyViewedBooksProvider"
    );
  }
  return context;
};
