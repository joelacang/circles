"use client";

import ChatFloatingBar from "@/features/chats/components/chat-floating-bar";
import Sidebar from "@/features/navigation/components";
import TopNavbar from "@/features/navigation/components/top-navbar";
import { useLoggedUser } from "@/features/users/hooks/use-logged-user";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useQuery } from "convex/react";
import { usePathname } from "next/navigation";
import { api } from "../../../convex/_generated/api";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

const AuthenticatedLayoutPage = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const results = useQuery(api.users.getLoggedUserQuery);
  const { loggedUser, onAdd, onRemove } = useLoggedUser();

  useEffect(() => {
    if (results) {
      onAdd(results);
    } else {
      onRemove();
    }
  }, [results, onAdd, onRemove]);

  if (results === undefined) {
    return (
      <div className="flex w-full h-screen flex-col items-center justify-center ">
        <Loader2 className="animate-spin" />
        <p>Loading Account...</p>
      </div>
    );
  }

  return (
    <div className="flex relative w-full flex-row h-screen @container">
      <div className="block @5xl:hidden bg-background/95 supports-[backdrop-filter]:bg-background/60 py-2 px-4 absolute top-0 z-20 border-b backdrop-blur w-full">
        <TopNavbar />
      </div>

      <div className="w-xs hidden @5xl:block border-r z-50">
        <Sidebar />
      </div>

      <div
        className={cn(
          "flex flex-1 items-start justify-center w-full overflow-y-auto h-full  pt-16 @5xl:pt-4 pb-4"
        )}
      >
        <div
          className={cn(
            "w-full h-full",
            !pathname.startsWith(`/messages`) ? "max-w-3xl " : "px-4"
          )}
        >
          {children}
        </div>
      </div>
      {!pathname.startsWith("/messages") && !isMobile && loggedUser && (
        <div className="absolute bottom-0 right-4">
          <ChatFloatingBar />
        </div>
      )}
    </div>
  );
};

export default AuthenticatedLayoutPage;
