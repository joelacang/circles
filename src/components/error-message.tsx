import { cn } from "@/lib/utils";
import { LucideIcon, TriangleAlert } from "lucide-react";
import { HTMLProps } from "react";

interface Props extends HTMLProps<HTMLDivElement> {
  className?: string;
  icon?: LucideIcon;
  message?: string;
  children?: React.ReactNode;
}
const ErrorMessage = ({
  className,
  icon,
  message,
  children,
  ...props
}: Props) => {
  const Icon = icon ?? TriangleAlert;
  return (
    <div
      className={cn(
        "flex items-center justify-center w-full flex-col py-8 gap-4",
        className
      )}
      {...props}
    >
      <div className="p-4 bg-destructive/10 rounded-full border-destructive ">
        <Icon className="text-destructive text-center size-10" />
      </div>

      <p className="text-center font-semibold text-lg text-muted-foreground">
        {message}
      </p>

      {children}
    </div>
  );
};

export default ErrorMessage;
