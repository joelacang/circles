import { MODE } from "@/types/enum";
import { ModeValues } from "@/utils/get-values";
import Image from "next/image";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface Props {
  imageUrl: string;
  message: string;
  children?: React.ReactNode;
  className?: string;
}

const InfoMessage = ({ imageUrl, message, children, className }: Props) => {
  return (
    <div className="flex flex-col items-center justify-center py-8  gap-4">
      <div className={cn("relative w-full aspect-square", className)}>
        <Image
          fill
          src={imageUrl}
          alt={message}
          className="object-contain object-center"
        />
      </div>
      <div className="flex flex-col gap-4 items-center justify-center">
        <p className="text-lg text-muted-foreground text-center">{message}</p>
        {children}
      </div>
    </div>
  );
};

export default InfoMessage;
