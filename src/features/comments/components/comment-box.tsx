import Hint from "@/components/hint";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { PlusIcon, SendIcon, XIcon } from "lucide-react";
import { Id } from "../../../../convex/_generated/dataModel";
import { useForm } from "react-hook-form";
import { CreateComment, createCommentSchema } from "../schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useConvexMutationHandler } from "@/hooks/use-convex-mutation-handler";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import toast from "react-hot-toast";

interface Props {
  postId: Id<"posts">;
  parentCommentId: Id<"comments"> | null;
  onClose: () => void;
}
const CommentBox = ({ postId, parentCommentId, onClose }: Props) => {
  const { mutate: createComment, isLoading } = useConvexMutationHandler(
    useMutation(api.comments.create)
  );
  const form = useForm<CreateComment>({
    resolver: zodResolver(createCommentSchema),
    defaultValues: {
      body: "",
      postId,
      parentCommentId,
    },
  });

  const onSubmit = (values: CreateComment) => {
    createComment(
      {
        ...values,
        postId: values.postId as Id<"posts">,
        parentCommentId: (values.parentCommentId as Id<"comments">) ?? null,
      },
      {
        onLoading: () => {
          toast.loading("Creating Comment...", { id: "create-comment-toast" });
        },
        onSuccess: () => {
          toast.success("Comment successfully submitted.");
          form.reset();
          onClose();
        },
        onError: (error) => {
          toast.error(`Error submitting comment: ${error}`);
        },
        onSettled: () => {
          toast.dismiss("create-comment-toast");
        },
      }
    );
  };

  return (
    <Form {...form}>
      <form className="p-3" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          name="body"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <InputGroup className="bg-background rounded-xl flex items-start">
                <FormControl>
                  <InputGroupTextarea
                    placeholder="Write your comment..."
                    className="min-h-18"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                {/* <InputGroupAddon align="inline-start">
                  <Hint tooltip="Attach Image">
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="rounded-full"
                      disabled={isLoading}
                    >
                      <PlusIcon />
                    </Button>
                  </Hint>
                </InputGroupAddon> */}
                <InputGroupAddon
                  className="w-full flex justify-end"
                  align="block-end"
                >
                  <Hint tooltip="Cancel Comment">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="rounded-lg cursor-pointer border-destructive text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={onClose}
                    >
                      <XIcon />
                      Cancel
                    </Button>
                  </Hint>
                  <Hint tooltip="Submit Comment">
                    <Button
                      type="submit"
                      size="sm"
                      variant="default"
                      className="rounded-lg"
                      disabled={!form.formState.isValid || isLoading}
                    >
                      <SendIcon />
                      Comment
                    </Button>
                  </Hint>
                </InputGroupAddon>
              </InputGroup>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default CommentBox;
