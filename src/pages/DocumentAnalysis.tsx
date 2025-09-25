import { useState } from "react";
import { 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Eye, 
  Download,
  Image,
  Ruler,
  Zap
} from "lucide-react";
import { useDocument } from "@/context/DocumentContext";
import DocumentViewer from "@/components/DocumentViewer";
import * as XLSX from 'xlsx';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface ValidationResult {
  field: string;
  expected: string;
  actual: string;
  status: "passed" | "failed" | "warning";
  source: string;
}

const DocumentAnalysis = () => {
  const [selectedDocument] = useState("FAIR-2024-0088");
  const [documentViewerOpen, setDocumentViewerOpen] = useState(false);
  const { documentInfo } = useDocument();

  const currentDocumentInfo = {
    id: "FAIR-2024-0088",
    name: documentInfo?.name || "Ceramic_Heater_FAIR_Rev_C.pdf",
    commodity: "Ceramic Heater Assembly",
    uploadDate: documentInfo?.uploadDate || "2024-01-15 14:32:00",
    processedDate: "2024-01-15 14:34:23",
    overallStatus: "failed",
    confidence: 87,
  };

  const validationResults: ValidationResult[] = [
    {
      field: "Operating Temperature",
      expected: "400°C ± 5°C",
      actual: "420°C ± 3°C",
      status: "failed",
      source: "SAP Material Master",
    },
    {
      field: "Power Rating",
      expected: "2.5 kW",
      actual: "2.5 kW",
      status: "passed",
      source: "iPLM Specifications",
    },
    {
      field: "Voltage Rating",
      expected: "240V AC",
      actual: "240V AC",
      status: "passed",
      source: "iQMS Standards",
    },
    {
      field: "Resistance Value",
      expected: "23.04 Ω ± 2%",
      actual: "23.04 Ω ± 2%",
      status: "passed",
      source: "SAP Material Master",
    },
    {
      field: "Thermal Uniformity",
      expected: "± 2°C",
      actual: "± 3°C",
      status: "warning",
      source: "MyLam Standards",
    },
    {
      field: "Insulation Resistance",
      expected: "> 100 MΩ",
      actual: "> 100 MΩ",
      status: "passed",
      source: "iQMS Standards",
    },
  ];

  const imageAnalysis = [
    {
      type: "Product Photo",
      status: "passed",
      confidence: 94,
      description: "Product matches reference images from drawing database",
    },
    {
      type: "Engineering Drawing",
      status: "passed",
      confidence: 91,
      description: "Dimensional specifications match CAD references",
    },
    {
      type: "Test Setup",
      status: "warning",
      confidence: 78,
      description: "Test configuration differs slightly from standard setup",
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "passed": return <CheckCircle className="w-4 h-4 text-success" />;
      case "failed": return <XCircle className="w-4 h-4 text-destructive" />;
      case "warning": return <AlertTriangle className="w-4 h-4 text-warning" />;
      default: return <AlertTriangle className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "passed": return "text-success";
      case "failed": return "text-destructive";
      case "warning": return "text-warning";
      default: return "text-muted-foreground";
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case "passed": return "bg-success/10 border-success/20";
      case "failed": return "bg-destructive/10 border-destructive/20";
      case "warning": return "bg-warning/10 border-warning/20";
      default: return "bg-muted border-border";
    }
  };

  const passedCount = validationResults.filter(r => r.status === "passed").length;
  const failedCount = validationResults.filter(r => r.status === "failed").length;
  const warningCount = validationResults.filter(r => r.status === "warning").length;

  const exportToExcel = () => {
    // Create worksheet with validation results
    const wsData = [
      ['FAIR Document Analysis Report'],
      [''],
      ['Document Information'],
      ['Document ID', currentDocumentInfo.id],
      ['Document Name', currentDocumentInfo.name],
      ['Commodity', currentDocumentInfo.commodity],
      ['Upload Date', currentDocumentInfo.uploadDate],
      ['Overall Status', currentDocumentInfo.overallStatus],
      ['Confidence Score', `${currentDocumentInfo.confidence}%`],
      [''],
      ['Validation Results'],
      ['Field', 'Expected Value', 'Actual Value', 'Status', 'Source'],
      ...validationResults.map(result => [
        result.field,
        result.expected,
        result.actual,
        result.status,
        result.source
      ]),
      [''],
      ['Summary'],
      ['Tests Passed', passedCount],
      ['Warnings', warningCount],
      ['Failed Tests', failedCount],
      [''],
      ['Image Analysis'],
      ['Type', 'Status', 'Confidence', 'Description'],
      ...imageAnalysis.map(analysis => [
        analysis.type,
        analysis.status,
        `${analysis.confidence}%`,
        analysis.description
      ])
    ];

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Analysis Report');
    
    // Save the file
    XLSX.writeFile(wb, `FAIR_Analysis_${currentDocumentInfo.name.replace('.pdf', '')}_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-card-foreground">Document Analysis</h1>
          <p className="text-muted-foreground mt-1">
            Detailed validation results for {currentDocumentInfo.name}
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" onClick={() => setDocumentViewerOpen(true)}>
            <Eye className="w-4 h-4 mr-2" />
            View Document
          </Button>
          <Button variant="outline" size="sm" onClick={exportToExcel}>
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Document Overview */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Document Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-muted-foreground">Document ID</p>
              <p className="font-semibold text-card-foreground">{currentDocumentInfo.id}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Commodity</p>
              <p className="font-semibold text-card-foreground">{currentDocumentInfo.commodity}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Overall Status</p>
              <Badge 
                className={cn(
                  "font-medium capitalize",
                  getStatusBg(currentDocumentInfo.overallStatus),
                  getStatusColor(currentDocumentInfo.overallStatus)
                )}
              >
                {currentDocumentInfo.overallStatus}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Confidence Score</p>
              <div className="flex items-center gap-2">
                <Progress value={currentDocumentInfo.confidence} className="h-2 flex-1" />
                <span className="font-semibold text-card-foreground">{currentDocumentInfo.confidence}%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Validation Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className={cn("shadow-soft", getStatusBg("passed"))}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-card-foreground">{passedCount}</p>
                <p className="text-sm text-muted-foreground">Tests Passed</p>
              </div>
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className={cn("shadow-soft", getStatusBg("warning"))}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-card-foreground">{warningCount}</p>
                <p className="text-sm text-muted-foreground">Warnings</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card className={cn("shadow-soft", getStatusBg("failed"))}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-card-foreground">{failedCount}</p>
                <p className="text-sm text-muted-foreground">Failed Tests</p>
              </div>
              <XCircle className="w-8 h-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analysis */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Detailed Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="specifications" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="specifications" className="flex items-center gap-2">
                <Ruler className="w-4 h-4" />
                Specifications
              </TabsTrigger>
              <TabsTrigger value="images" className="flex items-center gap-2">
                <Image className="w-4 h-4" />
                Image Analysis
              </TabsTrigger>
              <TabsTrigger value="electrical" className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Electrical Tests
              </TabsTrigger>
            </TabsList>

            <TabsContent value="specifications" className="mt-6">
              <div className="space-y-4">
                {validationResults.map((result, index) => (
                  <div key={index} className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(result.status)}
                        <h4 className="font-semibold text-card-foreground">{result.field}</h4>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {result.source}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Expected Value</p>
                        <p className="font-medium text-card-foreground">{result.expected}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Actual Value</p>
                        <p className={cn("font-medium", getStatusColor(result.status))}>
                          {result.actual}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="images" className="mt-6">
              <div className="space-y-4">
                {imageAnalysis.map((analysis, index) => (
                  <div key={index} className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(analysis.status)}
                        <h4 className="font-semibold text-card-foreground">{analysis.type}</h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Confidence:</span>
                        <span className="font-semibold text-card-foreground">{analysis.confidence}%</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{analysis.description}</p>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="electrical" className="mt-6">
              <div className="space-y-4">
                {validationResults
                  .filter(r => r.field.includes("Voltage") || r.field.includes("Power") || r.field.includes("Resistance"))
                  .map((result, index) => (
                    <div key={index} className="border border-border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(result.status)}
                          <h4 className="font-semibold text-card-foreground">{result.field}</h4>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {result.source}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Expected Value</p>
                          <p className="font-medium text-card-foreground">{result.expected}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Actual Value</p>
                          <p className={cn("font-medium", getStatusColor(result.status))}>
                            {result.actual}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <DocumentViewer
        isOpen={documentViewerOpen}
        onClose={() => setDocumentViewerOpen(false)}
        documentFile={documentInfo?.file || null}
        documentName={currentDocumentInfo.name}
      />
    </div>
  );
};

export default DocumentAnalysis;