import { LucideIcon } from "lucide-react";
import { IconType } from "react-icons/lib";

export type MenuItem = {
  id: string;
  label: string;
  icon?: LucideIcon | IconType;
  disabled?: boolean;
  hidden?: boolean;
  withSeparator?: boolean;
  action?: () => void;
  subMenus?: MenuItem[];
  children?: React.ReactNode;
  mode?: "default" | "destructive";
  count?: number;
  highlighted?: boolean;
};
