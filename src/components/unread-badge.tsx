import { bgGradientPrimary, bgGradientSecondary } from "@/lib/get-values";
import { cn } from "@/lib/utils";

interface Props {
  count: number;
  mode?: "default" | "secondary";
}
const UnreadBadge = ({ count, mode = "default" }: Props) => {
  return (
    <div
      className={cn(
        " min-w-6 flex items-center justify-center p-1 rounded-full leading-none size-fit",
        mode === "default" ? bgGradientPrimary : bgGradientSecondary
      )}
    >
      <p className="text-xs font-semibold text-primary-foreground">{count}</p>
    </div>
  );
};

export default UnreadBadge;
