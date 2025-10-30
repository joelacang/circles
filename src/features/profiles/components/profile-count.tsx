import Hint from "@/components/hint";
import { Button } from "@/components/ui/button";

interface Props {
  label: string;
  count: number;
  tooltip?: string;
  action?: () => void;
}

const ProfileCount = ({ label, count, tooltip, action }: Props) => {
  return (
    <Hint tooltip={tooltip ?? "Show Dialog"}>
      <Button
        className="flex flex-col items-center h-full w-full hover:bg-muted"
        variant="ghost"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (action) {
            action();
          }
        }}
      >
        <p className="text-lg text-muted-foreground font-semibold">{count}</p>
        <p className="text-sm font-semibold">{label}</p>
      </Button>
    </Hint>
  );
};

export default ProfileCount;
