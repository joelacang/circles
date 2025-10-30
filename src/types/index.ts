import { LucideIcon } from "lucide-react";
import { MODE } from "./enum";

export type ModeDisplay = {
  mode: MODE;
  color: string;
  icon: LucideIcon;
  light: string;
  dark: string;
};
