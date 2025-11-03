import { useTranslation } from "react-i18next";
import SidebarContent from "./sidebar-content";
import SidebarFooter from "./sidebar-footer";

const Sidebar = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col h-full gap-4 w-full items-start justify-between p-4 overflow-y-auto bg-background">
      {/* Header */}
      <div className="w-full flex flex-col items-center justify-center">
        <p className="text-primary text-3xl font-black leading-none">circles</p>
        <p className="text-xs font-light text-muted-foreground">
          {t("sidebar:slogan")}
        </p>
      </div>

      {/* Main content */}
      <div className="flex-1 w-full">
        <SidebarContent />
      </div>

      {/* Footer */}
      <div className="w-full flex items-center justify-center">
        <SidebarFooter />
      </div>
    </div>
  );
};

export default Sidebar;
