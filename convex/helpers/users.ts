import { User } from "@/features/users/types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getProfileByClerkId(clerkId: string): Promise<any> {
  const res = await fetch(`https://api.clerk.com/v1/users/${clerkId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(`Failed to fetch Clerk User: ${error}`);
  }

  const user = await res.json();
}
