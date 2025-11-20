import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useFollowDialog } from "../hooks/use-follow-dialog";
import { Input } from "@/components/ui/input";
import FollowersSection from "./followers-section";
import FollowingSection from "./following-section";

const FollowDialog = () => {
  const { open, onClose, isPending, data } = useFollowDialog();

  if (!data) return null;

  const { user, mode, count } = data;

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        if (isPending) return;

        onClose();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {data.mode === "followers" ? "Followers" : "Following"}
          </DialogTitle>
          <DialogDescription>
            {mode === "followers"
              ? `${user.name} currently has ${count} follower${count !== 1 ? "s" : ""}.`
              : count > 0
                ? `${user.name} currently follows ${count} people.`
                : `${user.name} is not following anybody.`}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Input placeholder="Enter user's name to search..." />
          {data.mode === "followers" ? (
            <FollowersSection userId={data.user.id} />
          ) : data.mode === "following" ? (
            <FollowingSection userId={data.user.id} />
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FollowDialog;
