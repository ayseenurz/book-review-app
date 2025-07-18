export const fetchAuthorImage = async (authorId: string) => {
    // authorId: 'OL12345A' gibi olmalı
    const response = await fetch(
      `https://firestore.googleapis.com/v1/projects/book-69486/databases/(default)/documents/authors/${authorId}`
    );
    if (!response.ok) {
      console.log('Firestore response not ok:', response.status, response.statusText);
      return null;
    }
    const data = await response.json();
    console.log('Firestore author data:', data); // DEBUG: Firestore'dan dönen tüm veri
    if (data.fields && data.fields.imageUrl && data.fields.imageUrl.stringValue) {
      console.log('Firestore imageUrl:', data.fields.imageUrl.stringValue); // DEBUG: imageUrl
      return data.fields.imageUrl.stringValue;
    }
    return null;
  };