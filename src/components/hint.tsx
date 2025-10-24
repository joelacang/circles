import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

interface Props {
  tooltip: string;
  children: React.ReactNode;
}
const Hint = ({ tooltip, children }: Props) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent>
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default Hint;
