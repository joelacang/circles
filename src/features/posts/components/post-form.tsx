import Hint from "@/components/hint";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import UserAvatar from "@/features/users/components/user-avatar";
import { cn } from "@/lib/utils";
import { AUDIENCE, SIZE } from "@/types/enum";
import { useUser } from "@clerk/nextjs";
import { ImageIcon, Loader2Icon, SmileIcon, WandIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { CreatePost, createPostSchema } from "../schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
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
import { FaUser, FaUsers } from "react-icons/fa";
import { DialogFooter } from "@/components/ui/dialog";

const PostForm = () => {
  const { user } = useUser();
  const { t } = useTranslation();
  const { onClose } = usePostFormDialog();
  const { mutate: createPost, isLoading } = useConvexMutationHandler(
    useMutation(api.posts.create)
  );

  const form = useForm<CreatePost>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      body: "",
      attachments: [],
      audience: AUDIENCE.PUBLIC,
    },
  });

  const onSubmit = async (values: CreatePost) => {
    console.log("Post Values: ", values);
    createPost(
      {
        ...values,
        quotedPostId: values.quotedPostId as Id<"posts">,
        attachments: values.attachments as Id<"_storage">[],
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex w-full flex-row gap-4">
          <UserAvatar imageUrl={user?.imageUrl} size={SIZE.SMALL} />
          <div className="w-full space-y-2">
            <FormField
              name="body"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputGroup>
                      <InputGroupTextarea
                        className="max-h-28"
                        placeholder={t("posts:textareaPlaceholder")}
                        {...field}
                        disabled={isLoading}
                      />
                      <InputGroupAddon
                        className="flex items-center justify-between gap-4"
                        align="block-end"
                      >
                        <p
                          className={cn(
                            "text-xs font-light text-muted-foreground"
                          )}
                        >
                          <span
                            className={cn(
                              field.value.length > 350 && "text-destructive"
                            )}
                          >{`${field.value.length}/350 ${t("users:charsLeft")}`}</span>
                        </p>
                      </InputGroupAddon>
                    </InputGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-row items-center justify-between">
              <div>
                <Hint tooltip={t("posts:imageTooltip")}>
                  <Button
                    type="button"
                    className="rounded-full cursor-pointer"
                    variant="ghost"
                    size="sm"
                    disabled={isLoading}
                  >
                    <ImageIcon />
                  </Button>
                </Hint>

                <Hint tooltip={t("posts:emojiTooltip")}>
                  <Button
                    type="button"
                    className="rounded-full cursor-pointer"
                    variant="ghost"
                    size="sm"
                    disabled={isLoading}
                  >
                    <SmileIcon />
                  </Button>
                </Hint>
              </div>
              <div className="flex flex-row items-center justify-start gap-4">
                <FaUsers />
                <FormField
                  name="audience"
                  control={form.control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
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
                  )}
                />
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
          <Button type="submit" className="cursor-pointer" disabled={isLoading}>
            {isLoading && <Loader2Icon className="animate-spin" />}
            {t("posts:createPostButton")}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default PostForm;
