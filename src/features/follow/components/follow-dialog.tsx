import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useFollowDialog } from "../hooks/use-follow-dialog";

const FollowDialog = () => {
  const { open, onClose, isPending, data } = useFollowDialog();

  if (!data) return null;

  const { user, mode, count } = data;
  const name = `${user.firstName} ${user.lastName}`;

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
              ? `${name} currently has ${count} follower${count !== 1 ? "s" : ""}.`
              : count > 0
                ? `${name} currently follows ${count} people.`
                : `${name} is not following anybody.`}
          </DialogDescription>
        </DialogHeader>
        <div>
          <p>This is the follows dialog.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FollowDialog;
