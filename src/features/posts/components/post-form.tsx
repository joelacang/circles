import Hint from "@/components/hint";
import { Button } from "@/components/ui/button";
import UserAvatar from "@/features/users/components/user-avatar";
import { cn } from "@/lib/utils";
import { AUDIENCE, SIZE } from "@/types/enum";
import { useUser } from "@clerk/nextjs";
import { Loader2Icon, WandIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import toast from "react-hot-toast";
import { useConvexMutationHandler } from "@/hooks/use-convex-mutation-handler";
import { usePostFormDialog } from "../hooks/use-post-form-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FaUsers } from "react-icons/fa";
import { DialogFooter } from "@/components/ui/dialog";
import InputTextareaGroup from "@/components/input-textarea-group";
import { useState } from "react";

const PostForm = () => {
  const { user } = useUser();
  const { t } = useTranslation();
  const { onClose } = usePostFormDialog();
  const { mutate: createPost, isLoading } = useConvexMutationHandler(
    useMutation(api.posts.create)
  );
  const [body, setBody] = useState("");
  const [attachments, setAttachments] = useState<Id<"_storage">[]>([]);
  const [audience, setAudience] = useState<AUDIENCE>(AUDIENCE.PUBLIC);

  const onSubmit = async () => {
    createPost(
      {
        body,
        audience,
        attachments,
      },
      {
        onLoading: () =>
          toast.loading("Creating Post...", { id: "createPostToast" }),
        onSuccess: (response) => {
          toast.success(`Post created successfully.`);
          console.log("New Post: ", response.postId);
          onClose();
        },
        onError: (error) => {
          toast.error(error);
        },
        onSettled: () => {
          toast.dismiss("createPostToast");
        },
      }
    );
  };

  return (
    <div>
      <div className="flex w-full flex-row gap-4">
        <UserAvatar imageUrl={user?.imageUrl} size={SIZE.SMALL} />
        <div className="w-full space-y-2">
          <InputTextareaGroup
            placeholder="What's happening?"
            value={body}
            onChangeValue={setBody}
            clearButton
            emojiPicker
            attachImage
            maxCharacters={350}
            charLimitLabel
          />

          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row items-center justify-start gap-4">
              <FaUsers />

              <Select
                value={audience}
                onValueChange={(value) => setAudience(value as AUDIENCE)}
              >
                <SelectTrigger className="py-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(AUDIENCE).map((audience) => (
                    <SelectItem key={audience} value={audience}>
                      <span className="text-sm">{audience}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* UNCOMMENT IF THERE ARE ANY SCHEMA ERRORS */}
          {/* <pre>{JSON.stringify(form.formState.errors, null, 2)}</pre> */}

          {/* Footer Here */}
        </div>
      </div>

      <DialogFooter className="pt-4">
        <Button
          type="button"
          className="bg-gradient-to-br from-blue-400 to-medium-purple-700"
          disabled={isLoading}
        >
          <WandIcon />
          {t("posts:improveWithAIButton")}
        </Button>
        <Button
          type="submit"
          onClick={onSubmit}
          className="cursor-pointer"
          disabled={isLoading}
        >
          {isLoading && <Loader2Icon className="animate-spin" />}
          {t("posts:createPostButton")}
        </Button>
      </DialogFooter>
    </div>
  );
};

export default PostForm;
