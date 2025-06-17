export const REQUIRED_DOCUMENTS = [
  "Piece d'identite",
  "Assurance",
  "Kibis ou registre de commerce",
  "URSSAF",
  "Rib",
  "Diplome et certification"
];

export const calculateUploadedDocuments = (userId) => {
  if (typeof window === 'undefined' || !userId) return 0;
  
  return REQUIRED_DOCUMENTS.reduce((count, docTitle) => {
    const storageKey = `${userId}-${docTitle}`;
    return localStorage.getItem(storageKey) ? count + 1 : count;
  }, 0);
};
