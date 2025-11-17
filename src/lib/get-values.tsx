import { SIZE } from "@/types/enum";

export function getAvatarSize(size: SIZE): string {
  switch (size) {
    case SIZE.MICRO:
      return "size-6";
    case SIZE.MINI:
      return "size-8";
    case SIZE.SMALL:
      return "size-10";
    case SIZE.DEFAULT:
      return "size-12";
    case SIZE.LARGE:
      return "size-16";
    case SIZE.XLARGE:
      return "size-24";
  }
}

export function getAvatarTextSize(size: SIZE): string {
  switch (size) {
    case SIZE.MICRO:
      return "text-sm";
    case SIZE.MINI:
      return "text-lg";
    case SIZE.SMALL:
      return "text-xl";
    case SIZE.DEFAULT:
      return "text-3xl";
    case SIZE.LARGE:
      return "text-4xl";
    case SIZE.XLARGE:
      return "text-6xl";
  }
}
