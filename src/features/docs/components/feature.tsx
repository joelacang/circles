import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface Props {
  icon: LucideIcon;
  text: string;
  fromColor: string;
  toColor: string;
}

const Feature = ({ icon: Icon, text, fromColor, toColor }: Props) => {
  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          "rounded-full p-1",
          "bg-gradient-to-br from-[_var(--col-from)] to-[_var(--col-to)]"
        )}
        style={
          {
            "--col-from": fromColor,
            "--col-to": toColor,
          } as React.CSSProperties
        }
      >
        <Icon className="size-4 text-white" />
      </div>
      <span>{text}</span>
    </div>
  );
};

export default Feature;
