import { Button, buttonVariants } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { usePostFormDialog } from "../hooks/use-post-form-dialog";
import { useTranslation } from "react-i18next";
import { HTMLProps } from "react";
import { cn } from "@/lib/utils";
import { VariantProps } from "class-variance-authority";

interface Props extends React.ComponentProps<"button"> {
  className?: string;
}
const CreatePostButton = ({ className, ...props }: Props) => {
  const { onOpen } = usePostFormDialog();
  const { t } = useTranslation();
  return (
    <Button type="button" className={cn(className)} onClick={onOpen} {...props}>
      <Plus />
      <span>{t("sidebar:createPost")}</span>
    </Button>
  );
};

export default CreatePostButton;
