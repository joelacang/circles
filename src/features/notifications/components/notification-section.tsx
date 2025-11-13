import { useInfiniteQuery } from "@/hooks/use-infinite-query";
import { api } from "../../../../convex/_generated/api";
import { Notification } from "../types";
import NotificationCard from "./notification-card";
import NotificationCardSkeleton from "./notification-card-skeleton";

const NotificationSection = () => {
  const { results, isLoadingFirstPage } = useInfiniteQuery<
    object,
    Notification
  >(api.notifications.getNotifications, {}, 20);
  if (isLoadingFirstPage) {
    return (
      <div className="space-y-2">
        <NotificationCardSkeleton />
        <NotificationCardSkeleton />
        <NotificationCardSkeleton />
      </div>
    );
  }
  return (
    <div className="px-2 space-y-1">
      {results.map((notif, index) => (
        <NotificationCard notif={notif} key={notif.id} />
      ))}
    </div>
  );
};

export default NotificationSection;
