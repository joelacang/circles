import Hint from "@/components/hint";
import { Button } from "@/components/ui/button";
import { LucideIcon, XIcon } from "lucide-react";

interface Props {
  tooltip: string;
  icon?: LucideIcon;
  count: number;
  color?: string;
  action?: () => void;
  disabled?: boolean;
  filled?: boolean;
}

const PostActionButton = ({
  tooltip,
  icon,
  count,
  color,
  action,
  disabled = false,
  filled = false,
}: Props) => {
  const Icon = icon ?? XIcon;

  return (
    <div className="flex flex-row items-center justify-start gap-1">
      <Hint tooltip={tooltip}>
        <Button
          className="rounded-full"
          variant="ghost"
          size="sm"
          disabled={disabled}
          onClick={(e) => {
            if (action) {
              e.preventDefault();
              e.stopPropagation();
              action();
            }
          }}
        >
          {filled ? <Icon fill={color} color={color} /> : <Icon />}
        </Button>
      </Hint>

      <span className="text-xs text-muted-foreground">{count}</span>
    </div>
  );
};

export default PostActionButton;
