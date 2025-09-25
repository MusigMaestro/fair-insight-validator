import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";

interface DocumentViewerProps {
  isOpen: boolean;
  onClose: () => void;
  documentFile: File | null;
  documentName: string;
}

const DocumentViewer = ({ isOpen, onClose, documentFile, documentName }: DocumentViewerProps) => {
  const createObjectURL = (file: File) => {
    return URL.createObjectURL(file);
  };

  const downloadDocument = () => {
    if (documentFile) {
      const url = createObjectURL(documentFile);
      const a = document.createElement('a');
      a.href = url;
      a.download = documentName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            {documentName}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex justify-end mb-4">
          <Button onClick={downloadDocument} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>

        <div className="border border-border rounded-lg overflow-hidden bg-muted/20">
          {documentFile ? (
            <iframe
              src={createObjectURL(documentFile)}
              className="w-full h-[600px]"
              title={`Document viewer for ${documentName}`}
            />
          ) : (
            <div className="flex items-center justify-center h-[600px] text-muted-foreground">
              <div className="text-center">
                <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No document available to view</p>
                <p className="text-sm">Please upload a document first</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentViewer;