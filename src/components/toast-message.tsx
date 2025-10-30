import { cn } from "@/lib/utils";
import { MODE } from "@/types/enum";
import { ModeValues } from "@/utils/get-values";
import { LucideIcon } from "lucide-react";

interface Props {
  message: string;
  description?: string;
  icon?: LucideIcon;
  mode?: MODE;
  children?: React.ReactNode;
  footer?: React.ReactNode;
}

const ToastMessage = ({
  message,
  icon,
  description,
  mode = MODE.DEFAULT,
  footer,
  children,
}: Props) => {
  const modeDisplay = ModeValues[mode];
  const Icon = icon ?? modeDisplay.icon;
  return (
    <div className="border w-full max-w-lg  p-4 rounded-xl shadow-lg bg-card m-2">
      <div className="w-full flex flex-row items-start justify-start gap-6">
        <div className="">
          <Icon
            className={cn(
              "size-12",
              mode === MODE.LOADING ? "animate-spin" : "animate-none"
            )}
            color={modeDisplay.color}
          />
        </div>

        <div className="flex-1 w-full flex flex-col  pr-4">
          <p className="font-semibold" style={{ color: modeDisplay.color }}>
            {message}
          </p>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}

          {children && <div className="pt-4 w-full">{children}</div>}
          {footer && (
            <div className="pt-4 flex w-full items-center justify-end">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ToastMessage;
