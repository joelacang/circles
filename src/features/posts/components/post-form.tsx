import { Button } from "@/components/ui/button";
import UserAvatar from "@/features/users/components/user-avatar";
import { AUDIENCE, MODE, SIZE } from "@/types/enum";
import { useUser } from "@clerk/nextjs";
import { Loader2Icon, WandIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
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
import { LocalFile } from "@/features/attachments/types";
import { useUploadFiles } from "@/features/attachments/hooks/use-upload-files";
import ToastMessage from "@/components/toast-message";
import { useRouter } from "next/navigation";
import { AttachmentDetail } from "@/types";

const PostForm = () => {
  const { user } = useUser();
  const { t } = useTranslation();
  const { onClose } = usePostFormDialog();
  const { mutate: createPost, isLoading: creatingPost } =
    useConvexMutationHandler(useMutation(api.posts.create));
  const [body, setBody] = useState("");
  const [localFiles, setLocalFiles] = useState<LocalFile[]>([]);
  const [audience, setAudience] = useState<AUDIENCE>(AUDIENCE.PUBLIC);
  const { uploadFiles, uploading, error: uploadError } = useUploadFiles();
  const isLoading = creatingPost || uploading;
  const router = useRouter();

  const handleLocalFileChange = (files: LocalFile[]) => {
    setLocalFiles(files);
  };

  const onSubmit = async () => {
    let attachments: AttachmentDetail[] = [];

    if (localFiles.length > 0) {
      const filesToBeUploaded = localFiles.map((f) => f.file);

      toast.custom(
        () => <ToastMessage mode={MODE.LOADING} message="Uploading Files..." />,
        { id: "uploading-files-toast" }
      );

      const { success, attachments: attachmentsData } =
        await uploadFiles(filesToBeUploaded);

      toast.dismiss("uploading-files-toast");

      if (!success) {
        if (uploadError) {
          toast.custom(() => (
            <ToastMessage
              message="Error uploading files"
              description={uploadError}
              mode={MODE.ERROR}
            />
          ));
        }

        return;
      }

      attachments = attachmentsData;
    }

    createPost(
      {
        body,
        audience,
        attachments,
      },
      {
        onLoading: () => {
          toast.custom(
            () => (
              <ToastMessage message="Creating Post..." mode={MODE.LOADING} />
            ),
            { id: "create-post-toast" }
          );
        },
        onSuccess: (response) => {
          toast.custom(() => (
            <ToastMessage
              message="Post Created Successfully."
              mode={MODE.SUCCESS}
              footer={
                <Button
                  onClick={() => router.push(`/posts/${response.postId}`)}
                  size="sm"
                >
                  View Post
                </Button>
              }
            />
          ));
          console.log("New Post: ", response.postId);
          onClose();
        },
        onError: (error) => {
          toast.error(error);
        },
        onSettled: () => {
          toast.dismiss("create-post-toast");
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
            onFilesChange={handleLocalFileChange}
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
