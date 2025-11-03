import { MenuItem } from "@/features/navigation/types";
import {
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "./ui/dropdown-menu";
import MyDropdownMenuItem from "./my-dropdown-menu-item";

interface Props {
  item: MenuItem;
}
const MyDropdownMenuItemSub = ({ item }: Props) => {
  if (!item.subMenus || item.subMenus.length === 0) {
    return null;
  }

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        <div className="flex flex-row gap-2 px-1 py-2 ">
          {item.icon && <item.icon />}
          <span>{item.label}</span>
        </div>
      </DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent className="z-[70] min-w-40 m-2">
          {item.subMenus.map((subMenuItem) => (
            <MyDropdownMenuItem key={subMenuItem.id} item={subMenuItem} />
          ))}
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  );
};

export default MyDropdownMenuItemSub;
