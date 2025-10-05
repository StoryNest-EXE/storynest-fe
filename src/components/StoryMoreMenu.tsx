import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useDeleteStoryMutation } from "@/queries/story.queries";
import { MoreHorizontal } from "lucide-react";

interface MoreOptionsButtonProps {
  storyId: number;
  isAI: boolean;
}

export default function MoreOptionsButton({
  storyId,
  isAI,
}: MoreOptionsButtonProps) {
  const deleteStory = useDeleteStoryMutation();
  const handleDelete = (storyId: number) => {
    deleteStory.mutate(storyId);
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="p-2 rounded-full hover:bg-muted/70 focus:outline-none border-0 bg-transparent">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuLabel>Tuỳ chọn</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => console.log("Chỉnh sửa")}>
          ✏️ Chỉnh sửa
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleDelete(storyId)}>
          🗑️ Xoá
        </DropdownMenuItem>
        {/* <DropdownMenuItem onClick={() => console.log("Chia sẻ")}>
          📤 Chia sẻ
        </DropdownMenuItem> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
