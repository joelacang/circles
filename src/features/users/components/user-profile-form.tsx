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
import { userProfileSchema, UserProfileSchema } from "../schemas";
import { useUser } from "@clerk/nextjs";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { Input } from "@/components/ui/input";
import { AtSign, Globe } from "lucide-react";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DateSelect } from "@/components/date-select";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useTranslation } from "react-i18next";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

const UserProfileForm = () => {
  const { user } = useUser();
  const updateProfile = useMutation(api.users.updateProfile);
  const { t } = useTranslation();
  const form = useForm<UserProfileSchema>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      profileId: undefined,
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      username: user?.username ?? "",
      dateOfBirth: new Date(),
      website: "",
      bio: "",
      isPrivate: false,
    },
    mode: "onBlur",
  });

  const onSubmit = (values: UserProfileSchema) => {
    updateProfile({
      ...values,
      dateOfBirth: values.dateOfBirth.getTime(),
      profileId: (values.profileId as Id<"profiles">) ?? undefined,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className=" flex flex-col">
        <div className="max-h-[60vh] overflow-y-auto space-y-4 p-4">
          <div className="flex items-center justify-center py-4">
            <Avatar className="size-24">
              <AvatarImage src={user?.imageUrl} />
            </Avatar>
          </div>

          <div className="w-full grid grid-cols-2 gap-4 pb-6">
            <FormField
              name="firstName"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("users:firstName")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("users:firstNamePlaceholder")}
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
            name="username"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("users:username")}</FormLabel>
                <FormControl>
                  <InputGroup>
                    <InputGroupInput
                      placeholder={t("users:usernamePlaceholder")}
                      required
                      {...field}
                    />
                    <InputGroupAddon>
                      <AtSign className="text-primary" />
                    </InputGroupAddon>
                  </InputGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="dateOfBirth"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("users:dateOfBirth")}</FormLabel>
                <FormControl>
                  <DateSelect value={field.value} onChange={field.onChange} />
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
                    />
                    <Label>{t("users:privateProfile")}</Label>
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <DialogFooter className="pt-4">
          <Button>{t("users:updateButton")}</Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default UserProfileForm;
