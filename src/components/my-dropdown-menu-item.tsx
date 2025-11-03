import { MenuItem } from "@/features/navigation/types";
import { DropdownMenuItem, DropdownMenuSeparator } from "./ui/dropdown-menu";
import MyDropdownMenuItemSub from "./my-dropdown-menu-item-sub";
import { cn } from "@/lib/utils";

interface Props {
  item: MenuItem;
}

const MyDropdownMenuItem = ({ item }: Props) => {
  if (item.subMenus && item.subMenus.length > 0) {
    return <MyDropdownMenuItemSub item={item} />;
  }

  return (
    <div>
      {!item.hidden && (
        <>
          <DropdownMenuItem
            className={cn(
              "cursor-pointer group p-3 flex items-center justify-between"
            )}
            onClick={(e) => {
              e.stopPropagation();
              if (item.action) {
                item.action();
              }
            }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="flex flex-row items-center justify-start gap-3">
              {item.icon && (
                <item.icon className="group-hover:text-accent-foreground" />
              )}
              <span>{item.label}</span>
            </div>

            <div>{item.children}</div>
          </DropdownMenuItem>
          {item.withSeparator && <DropdownMenuSeparator />}
        </>
      )}
    </div>
  );
};

export default MyDropdownMenuItem;
