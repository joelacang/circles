import { UserJSON } from "@clerk/backend";
import { fetchMutation } from "convex/nextjs";
import { api } from "../../../../convex/_generated/api";
import { generateId } from "@/helpers";

export async function createUserFromWebhook(data: UserJSON) {
  const {
    id,
    email_addresses,
    username,
    first_name,
    last_name,
    image_url,
    primary_email_address_id,
  } = data;

  const primaryEmailJSON =
    Array.isArray(email_addresses) && email_addresses.length > 0
      ? email_addresses.find((e) => e.id === primary_email_address_id)
      : null;

  const email =
    primaryEmailJSON?.email_address ?? email_addresses[0].email_address;

  if (!email) {
    console.warn("Skipping user creation, no valid email found.");
    return null;
  }
  let updatedUsername: string = username ?? "";

  if (!username) {
    updatedUsername = email.split("@")[0].trim() ?? `user_${generateId(8)}`;
    console.warn(`username missing, generate new username: ${updatedUsername}`);
  }

  const convexUserId = await fetchMutation(api.users.createUser, {
    clerkId: id,
    email,
    name: `${first_name ?? ""} ${last_name ?? ""}`.trim(),
    username: updatedUsername,
    imageUrl: image_url,
  });

  console.log("Created user with convexId: ", convexUserId);
}
