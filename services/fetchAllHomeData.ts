export const fetchAllHomeData = async () => {
    const [
      authorsRes,
      booksOfMonthRes,
      suggestedBooksRes
    ] = await Promise.all([
      fetch("https://www.googleapis.com/books/v1/volumes?q=fiction"),
      fetch("https://www.googleapis.com/books/v1/volumes?q=fiction&orderBy=newest&printType=books&maxResults=40"),
      fetch("https://www.googleapis.com/books/v1/volumes?q=fiction")
    ]);
  
    const authorsData = await authorsRes.json();
    const booksOfMonthData = await booksOfMonthRes.json();
    const suggestedBooksData = await suggestedBooksRes.json();
  
    // Popüler yazarları ayıklayalım
    const authorSet = new Set<string>();
    authorsData.items?.forEach((item: any) => {
      item.volumeInfo?.authors?.forEach((author: string) => {
        authorSet.add(author);
      });
    });
    const popularAuthors = Array.from(authorSet).slice(0, 10);
  
    return {
      popularAuthors,
      booksOfMonth: booksOfMonthData.items || [],
      suggestedBooks: suggestedBooksData.items || []
    };
  };
  