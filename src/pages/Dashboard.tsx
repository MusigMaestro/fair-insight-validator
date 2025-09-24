import { FileCheck, FileX, AlertTriangle, Clock } from "lucide-react";
import KPICard from "@/components/KPICard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const Dashboard = () => {
  const kpiData = [
    {
      title: "Documents Processed Today",
      value: "247",
      subtitle: "Total FAIR documents",
      icon: <FileCheck className="w-5 h-5 text-primary" />,
      trend: { value: 12, isPositive: true },
    },
    {
      title: "Validation Pass Rate",
      value: "94.2%",
      subtitle: "Documents passed validation",
      icon: <FileCheck className="w-5 h-5 text-success" />,
      variant: "success" as const,
      trend: { value: 3.1, isPositive: true },
    },
    {
      title: "Failed Validations",
      value: "14",
      subtitle: "Require manual review",
      icon: <FileX className="w-5 h-5 text-destructive" />,
      variant: "destructive" as const,
      trend: { value: -8, isPositive: true },
    },
    {
      title: "Average Processing Time",
      value: "2.3 min",
      subtitle: "Per document",
      icon: <Clock className="w-5 h-5 text-warning" />,
      variant: "warning" as const,
      trend: { value: -15, isPositive: true },
    },
  ];

  const commonFailureReasons = [
    { reason: "Specification Mismatch", count: 8, percentage: 57 },
    { reason: "Drawing Inconsistency", count: 4, percentage: 29 },
    { reason: "Missing Test Results", count: 2, percentage: 14 },
  ];

  const recentDocuments = [
    { id: "FAIR-2024-0089", commodity: "RF Power Module", status: "passed", time: "2 min ago" },
    { id: "FAIR-2024-0088", commodity: "Ceramic Heater", status: "failed", time: "5 min ago" },
    { id: "FAIR-2024-0087", commodity: "Vacuum Sensor", status: "passed", time: "8 min ago" },
    { id: "FAIR-2024-0086", commodity: "Control Board", status: "passed", time: "12 min ago" },
    { id: "FAIR-2024-0085", commodity: "Gas Line Assembly", status: "reviewing", time: "15 min ago" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "passed": return "text-success";
      case "failed": return "text-destructive";
      case "reviewing": return "text-warning";
      default: return "text-muted-foreground";
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case "passed": return "bg-success/10 border-success/20";
      case "failed": return "bg-destructive/10 border-destructive/20";
      case "reviewing": return "bg-warning/10 border-warning/20";
      default: return "bg-muted border-border";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-card-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Real-time FAIR document validation metrics and insights
        </p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => (
          <KPICard key={index} {...kpi} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Common Failure Reasons */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-warning" />
              Common Failure Reasons
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {commonFailureReasons.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-card-foreground font-medium">{item.reason}</span>
                  <span className="text-muted-foreground">{item.count} documents</span>
                </div>
                <Progress value={item.percentage} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Documents */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-primary" />
              Recent Document Processing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentDocuments.map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-secondary/30 transition-colors">
                  <div className="flex-1">
                    <p className="font-medium text-card-foreground text-sm">{doc.id}</p>
                    <p className="text-xs text-muted-foreground">{doc.commodity}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2 py-1 rounded-full border font-medium capitalize ${getStatusBg(doc.status)} ${getStatusColor(doc.status)}`}>
                      {doc.status}
                    </span>
                    <span className="text-xs text-muted-foreground">{doc.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>System Integration Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {["SAP", "PowerBI", "iPLM", "iQMS", "MyLam"].map((system) => (
              <div key={system} className="flex items-center gap-2 p-3 rounded-lg bg-success/5 border border-success/20">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span className="text-sm font-medium text-card-foreground">{system}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;