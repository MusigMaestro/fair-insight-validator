import { useState } from "react";
import { Upload, FileText, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { useDocument } from "@/context/DocumentContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface UploadedFile {
  id: string;
  name: string;
  size: string;
  status: "uploading" | "validating" | "completed" | "failed";
  progress: number;
  commodity?: string;
}

const DocumentUpload = () => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const { setDocumentInfo } = useDocument();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
  };

  const handleFiles = (files: File[]) => {
    const newFiles: UploadedFile[] = files.map((file, index) => ({
      id: `file-${Date.now()}-${index}`,
      name: file.name,
      size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
      status: "uploading",
      progress: 0,
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);
    
    // Save the first file to document context for analysis
    if (files.length > 0) {
      setDocumentInfo({
        name: files[0].name,
        file: files[0],
        uploadDate: new Date().toISOString(),
      });
    }
    
    // Simulate upload and validation process
    newFiles.forEach(file => {
      simulateFileProcessing(file.id);
    });
    
    toast.success(`${files.length} file(s) uploaded for validation`);
  };

  const simulateFileProcessing = (fileId: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20;
      
      setUploadedFiles(prev => prev.map(file => {
        if (file.id === fileId) {
          if (progress < 50) {
            return { ...file, progress, status: "uploading" };
          } else if (progress < 90) {
            return { 
              ...file, 
              progress, 
              status: "validating",
              commodity: progress > 60 ? "RF Power Module" : undefined
            };
          } else {
            clearInterval(interval);
            const isSuccess = Math.random() > 0.2; // 80% success rate
            return { 
              ...file, 
              progress: 100, 
              status: isSuccess ? "completed" : "failed",
              commodity: "RF Power Module"
            };
          }
        }
        return file;
      }));
    }, 300);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "uploading": return <Clock className="w-4 h-4 text-warning" />;
      case "validating": return <Clock className="w-4 h-4 text-primary animate-spin" />;
      case "completed": return <CheckCircle className="w-4 h-4 text-success" />;
      case "failed": return <AlertCircle className="w-4 h-4 text-destructive" />;
      default: return <FileText className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "uploading": return "Uploading...";
      case "validating": return "Validating against standards...";
      case "completed": return "Validation completed";
      case "failed": return "Validation failed";
      default: return "Unknown";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "uploading": return "text-warning";
      case "validating": return "text-primary";
      case "completed": return "text-success";
      case "failed": return "text-destructive";
      default: return "text-muted-foreground";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-card-foreground">Document Upload</h1>
        <p className="text-muted-foreground mt-1">
          Upload FAIR documents for automated validation against trusted sources
        </p>
      </div>

      {/* Upload Area */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-primary" />
            Upload FAIR Documents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
              dragActive 
                ? "border-primary bg-primary/5" 
                : "border-border hover:border-primary/50 hover:bg-primary/5"
            )}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-card-foreground mb-2">
              Drop your FAIR documents here
            </h3>
            <p className="text-muted-foreground mb-4">
              or click to select files from your computer
            </p>
            <Button 
              variant="outline" 
              onClick={() => document.getElementById('file-input')?.click()}
            >
              Select Files
            </Button>
            <input
              id="file-input"
              type="file"
              multiple
              accept=".pdf"
              className="hidden"
              onChange={handleFileInput}
            />
            <p className="text-xs text-muted-foreground mt-4">
              Supported formats: PDF • Max file size: 50MB
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Processing Queue */}
      {uploadedFiles.length > 0 && (
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Processing Queue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {uploadedFiles.map(file => (
                <div key={file.id} className="border border-border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(file.status)}
                      <div>
                        <p className="font-medium text-card-foreground">{file.name}</p>
                        <p className="text-sm text-muted-foreground">{file.size}</p>
                        {file.commodity && (
                          <p className="text-xs text-primary font-medium">
                            Commodity: {file.commodity}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={cn("text-sm font-medium", getStatusColor(file.status))}>
                        {getStatusText(file.status)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {file.progress.toFixed(0)}%
                      </p>
                    </div>
                  </div>
                  <Progress value={file.progress} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Validation Sources */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Validation Sources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { name: "SAP", status: "active", description: "Material specifications" },
              { name: "PowerBI", status: "active", description: "Analytics & reporting" },
              { name: "iPLM", status: "active", description: "Product lifecycle data" },
              { name: "iQMS", status: "active", description: "Quality management" },
              { name: "MyLam", status: "active", description: "Lam Research portal" },
            ].map(source => (
              <div key={source.name} className="p-4 rounded-lg border border-success/20 bg-success/5">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span className="font-semibold text-card-foreground">{source.name}</span>
                </div>
                <p className="text-xs text-muted-foreground">{source.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentUpload;