import { Loader2Icon } from "lucide-react";

interface Props {
  message?: string;
}
const LoadingMessage = ({ message = "Loading..." }: Props) => {
  return (
    <div>
      <div className="flex flex-row gap-2 text-primary">
        <Loader2Icon className="animate-spin" />
        <p>{message}</p>
      </div>
    </div>
  );
};

export default LoadingMessage;
