import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useUser } from "@clerk/nextjs";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { Input } from "@/components/ui/input";
import { Globe, Loader2Icon } from "lucide-react";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DateSelect } from "@/components/date-select";
import { useTranslation } from "react-i18next";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import UserAvatar from "../../users/components/user-avatar";
import { SIZE } from "@/types/enum";
import { useConvexMutationHandler } from "@/hooks/use-convex-mutation-handler";
import { UserProfileSchema, userProfileSchema } from "@/features/users/schemas";
import { Profile } from "../types";
import toast from "react-hot-toast";
import { useProfileDialog } from "@/features/users/hooks/use-profile-dialog";

interface Props {
  profile: Profile | null;
  clerkId: string;
}
const UserProfileForm = ({ profile, clerkId }: Props) => {
  const { onClose } = useProfileDialog();
  const updateProfileFn = useMutation(api.profiles.upsert);
  const { mutate: updateProfile, isLoading } =
    useConvexMutationHandler(updateProfileFn);
  const { t } = useTranslation();
  const { user } = useUser();
  const form = useForm<UserProfileSchema>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      profileId: profile?.id,
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      dateOfBirth: profile?.dateOfBirth
        ? new Date(profile?.dateOfBirth)
        : new Date(),
      website: profile?.website ?? "",
      bio: profile?.bio ?? "",
      isPrivate: profile?.isPrivate ?? false,
    },
    mode: "onBlur",
  });

  const onSubmit = async (values: UserProfileSchema) => {
    const { dateOfBirth, profileId, firstName, lastName, ...others } = values;

    if (!user) {
      toast.error("Unauthorized. You are not logged in.");
      return;
    }

    if (user.id !== clerkId) {
      toast.error("Unauthorized. You not allowed to update this profile.");
      return;
    }

    try {
      user.update({
        firstName,
        lastName,
      });

      updateProfile(
        {
          ...others,
          profileId: profileId ? (profileId as Id<"profiles">) : undefined,
          clerkId,
          dateOfBirth: dateOfBirth.getTime(),
        },
        {
          onLoading: () => {
            toast.loading("Updating Profile...", {
              id: "update-profile-toast",
            });
          },
          onSuccess: () => {
            toast.success("Profile has been updated.");
            onClose();
          },
          onError: (error) => {
            toast.error(`Error updating profile: ${error}`);
          },
          onSettled: () => {
            toast.dismiss("update-profile-toast");
          },
        }
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile. Please try again.");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className=" flex flex-col">
        <div className="max-h-[60vh] overflow-y-auto space-y-4 p-4">
          <div className="flex items-center justify-center py-4">
            <UserAvatar imageUrl={user?.imageUrl} size={SIZE.XLARGE} />
          </div>

          <div className="w-full grid grid-cols-2 gap-4 ">
            <FormField
              name="firstName"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("users:firstName")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("users:firstNamePlaceholder")}
                      disabled={isLoading}
                      required
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="lastName"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("users:lastName")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("users:lastNamePlaceholder")}
                      disabled={isLoading}
                      required
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            name="dateOfBirth"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("users:dateOfBirth")}</FormLabel>
                <FormControl>
                  <DateSelect
                    disabled={isLoading}
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="website"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("users:website")}</FormLabel>
                <FormControl>
                  <InputGroup>
                    <InputGroupInput
                      placeholder={t("users:websitePlaceholder")}
                      disabled={isLoading}
                      {...field}
                    />
                    <InputGroupAddon>
                      <Globe className="text-primary" />
                    </InputGroupAddon>
                  </InputGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="bio"
            control={form.control}
            render={({ field }) => {
              const charsLeft = field.value ? 250 - field.value.length : 250;
              return (
                <FormItem>
                  <FormLabel>{t("users:bio")}</FormLabel>
                  <FormControl>
                    <InputGroup>
                      <InputGroupTextarea
                        disabled={isLoading}
                        placeholder={t("users:bioPlaceholder")}
                        className="max-h-24"
                        {...field}
                      />
                      <InputGroupAddon align="block-end">
                        <p
                          className={cn(
                            "text-xs font-light text-muted-foreground",
                            charsLeft < 50 && "text-destructive"
                          )}
                        >
                          {`${charsLeft} ${t("users:charsLeft")}`}
                        </p>
                      </InputGroupAddon>
                    </InputGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            name="isPrivate"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex flex-row gap-4">
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="cursor-pointer"
                      disabled={isLoading}
                    />
                    <Label>{t("users:privateProfile")}</Label>
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <DialogFooter className="pt-4">
          <Button disabled={isLoading}>
            {isLoading && <Loader2Icon className="animate-spin" />}
            {t("users:updateButton")}
            {isLoading ? "..." : ""}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default UserProfileForm;
