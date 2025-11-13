"use client";
import Sidebar from "@/features/navigation/components";
import WelcomeScreen from "@/features/docs/components/welcome-screen";
import { useIsMobile } from "@/hooks/use-mobile";
import { Authenticated, Unauthenticated } from "convex/react";
import React from "react";
import TopNavbar from "@/features/navigation/components/top-navbar";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import ChatFloatingBar from "@/features/messages/components/chat-floating-bar";

const SiteLayout = ({ children }: { children: React.ReactNode }) => {
  const isMobile = useIsMobile();
  const pathname = usePathname();
  return (
    <main>
      <Authenticated>
        <div className="flex relative w-full flex-row h-screen ">
          {isMobile ? (
            <div className="bg-background/95 supports-[backdrop-filter]:bg-background/60 py-2 px-4 absolute top-0 z-20 border-b backdrop-blur w-full">
              <TopNavbar />
            </div>
          ) : (
            <div className="w-xs border-r z-50">
              <Sidebar />
            </div>
          )}
          <div
            className={cn(
              "flex flex-1 justify-center w-full overflow-y-auto h-full px-4",
              isMobile ? " pt-16 pb-4" : "py-4"
            )}
          >
            <div className={cn("w-full", pathname !== `/messages`)}>
              {children}
            </div>
          </div>
          {!pathname.startsWith("/messages") && !isMobile && (
            <div className="absolute bottom-0 right-4">
              <ChatFloatingBar />
            </div>
          )}
        </div>
      </Authenticated>
      <Unauthenticated>
        <WelcomeScreen />
      </Unauthenticated>
    </main>
  );
};

export default SiteLayout;
