import { UserJSON } from "@clerk/backend";
import { fetchAction } from "convex/nextjs";
import { api } from "../../../../convex/_generated/api";

export async function updateUserFromWebhook(data: UserJSON) {
  const { id, username, first_name, last_name, image_url } = data;
  console.log("Updating logged user's account");

  await fetchAction(api.users.updateUserFromWebhook, {
    clerkId: id,
    username: username ?? "",
    name: `${first_name} ${last_name}`,
    imageUrl: image_url,
  });
}
