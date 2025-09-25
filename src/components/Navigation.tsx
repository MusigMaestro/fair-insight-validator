import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { BarChart3, Upload, FileText, CheckCircle } from "lucide-react";

const Navigation = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navigationItems = [
    {
      href: "/",
      label: "Dashboard",
      icon: BarChart3,
    },
    {
      href: "/upload",
      label: "Document Upload",
      icon: Upload,
    },
    {
      href: "/analysis",
      label: "Document Analysis",
      icon: FileText,
    },
  ];

  return (
    <nav className="bg-card border-r border-border h-screen w-64 flex flex-col shadow-medium fixed left-0 top-0 z-50">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-light rounded-lg flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-card-foreground">FAIR Validator</h1>
            <p className="text-sm text-muted-foreground">Lam Research</p>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 p-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            
            return (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                    "hover:bg-secondary/50",
                    isActive 
                      ? "bg-primary text-primary-foreground shadow-soft" 
                      : "text-card-foreground"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="text-xs text-muted-foreground">
          <p>Version 1.0.0</p>
          <p>© 2024 Lam Research</p>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;