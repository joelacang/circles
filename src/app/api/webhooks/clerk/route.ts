import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest } from "next/server";
import { createUserFromWebhook } from "@/features/users/helpers/create-user-from-webhook";
import { updateUserFromWebhook } from "@/features/users/helpers/update-user-from-webhook";

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req);

    if (evt.type === "user.created") {
      await createUserFromWebhook(evt.data);
    } else if (evt.type === "user.updated") {
      await updateUserFromWebhook(evt.data);
    } else {
      console.log(`Other clerk events not yet supported`, evt.type);
    }

    return new Response("Webhook received", { status: 200 });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error verifying webhook", { status: 400 });
  }
}
