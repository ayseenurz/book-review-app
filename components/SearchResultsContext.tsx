import React, { createContext, ReactNode, useContext, useState } from 'react';

export type Book = any; // Dilersen tipini detaylandırabilirsin

interface SearchResultsContextType {
  results: Book[];
  setResults: (books: Book[]) => void;
}

const SearchResultsContext = createContext<SearchResultsContextType | undefined>(undefined);

export const SearchResultsProvider = ({ children }: { children: ReactNode }) => {
  const [results, setResults] = useState<Book[]>([]);
  return (
    <SearchResultsContext.Provider value={{ results, setResults }}>
      {children}
    </SearchResultsContext.Provider>
  );
};

export const useSearchResults = () => {
  const context = useContext(SearchResultsContext);
  if (!context) {
    throw new Error('useSearchResults must be used within a SearchResultsProvider');
  }
  return context;
}; 