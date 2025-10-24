import i18n from "@/i18n";
import { convexId } from "@/utils";
import { z } from "zod";

export const dateOfBirthSchema = z.date().refine(
  (date) => {
    const today = new Date();
    const minBirthDate = new Date(
      today.getFullYear() - 13,
      today.getMonth(),
      today.getDate()
    );
    return date <= minBirthDate;
  },
  {
    message: i18n.t("users:minAgeError"),
  }
);

export const userProfileSchema = z.object({
  profileId: convexId("profiles").optional(),
  firstName: z.string().min(1, i18n.t("users:firstNameError")),
  lastName: z.string().min(1, i18n.t("users:lastNameError")),
  username: z
    .string()
    .min(4, i18n.t("usernameMinError"))
    .max(64, i18n.t("usernameMaxError"))
    .regex(/^[a-zA-Z0-9_-]+$/, i18n.t("invalidUsernameError")),
  dateOfBirth: dateOfBirthSchema,
  website: z.url(i18n.t("users:invalidUrlError")).or(z.literal("")),
  bio: z
    .union([
      z
        .string()
        .min(4, i18n.t("users:bioMinError"))
        .max(250, i18n.t("users:bioMaxError")),
      z.literal(""),
    ])
    .optional(),

  isPrivate: z.boolean(),
});

export type UserProfileSchema = z.infer<typeof userProfileSchema>;
