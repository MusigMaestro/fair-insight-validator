import { createContext, useContext, useState, ReactNode } from 'react';

interface DocumentInfo {
  name: string;
  file: File | null;
  uploadDate: string;
}

interface DocumentContextType {
  documentInfo: DocumentInfo | null;
  setDocumentInfo: (info: DocumentInfo | null) => void;
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

export const useDocument = () => {
  const context = useContext(DocumentContext);
  if (context === undefined) {
    throw new Error('useDocument must be used within a DocumentProvider');
  }
  return context;
};

interface DocumentProviderProps {
  children: ReactNode;
}

export const DocumentProvider = ({ children }: DocumentProviderProps) => {
  const [documentInfo, setDocumentInfo] = useState<DocumentInfo | null>(null);

  return (
    <DocumentContext.Provider value={{ documentInfo, setDocumentInfo }}>
      {children}
    </DocumentContext.Provider>
  );
};