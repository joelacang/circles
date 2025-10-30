import { ModeDisplay } from "@/types";
import { MODE } from "@/types/enum";
import {
  CheckCircle2,
  File,
  InfoIcon,
  Loader2,
  OctagonAlert,
  TriangleAlert,
} from "lucide-react";

export const ModeValues: Record<MODE, ModeDisplay> = {
  [MODE.DEFAULT]: {
    mode: MODE.DEFAULT,
    icon: File,
    color: "#64748B",
    light: "#F1F5F9",
    dark: "#1E293B",
  },
  [MODE.ERROR]: {
    mode: MODE.ERROR,
    icon: TriangleAlert,
    color: "#DC2626",
    light: "#FEE2E2",
    dark: "#450A0A",
  },
  [MODE.SUCCESS]: {
    mode: MODE.SUCCESS,
    icon: CheckCircle2,
    color: "#16A34A",
    light: "#DCFCE7",
    dark: "#052E16",
  },
  [MODE.INFO]: {
    mode: MODE.INFO,
    icon: InfoIcon,
    color: "#2563EB",
    light: "#DBEAFE",
    dark: "#1E3A8A",
  },
  [MODE.WARNING]: {
    mode: MODE.WARNING,
    icon: OctagonAlert,
    color: "#D97706",
    light: "#FEF3C7",
    dark: "#78350F",
  },
  [MODE.LOADING]: {
    mode: MODE.LOADING,
    icon: Loader2,
    color: "#64748B",
    light: "#F1F5F9",
    dark: "#1E293B",
  },
};
