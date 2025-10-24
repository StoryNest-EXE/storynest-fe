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
import { useRouter } from "next/navigation";

interface MoreOptionsButtonProps {
  storyId: number;
  slug: string;
  isAI: boolean;
}

export default function MoreOptionsButton({
  storyId,
  slug,
  isAI,
}: MoreOptionsButtonProps) {
  const deleteStory = useDeleteStoryMutation();
  const router = useRouter();

  const handleDelete = (storyId: number) => {
    deleteStory.mutate(storyId);
  };

  const handleUpdate = (storyId: number, isAI: boolean, slug: string) => {
    if (!isAI) {
      router.push(`/update-story/${storyId}`);
    } else {
      router.push(`/update-story-ai/${slug}`);
    }
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="p-2 rounded-full hover:bg-muted/70 focus:outline-none border-0 bg-transparent">
          <MoreHorizontal className="h-4 w-4" />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuLabel>Tuỳ chọn</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {!isAI && (
          <DropdownMenuItem onClick={() => handleUpdate(storyId, isAI, slug)}>
            ✏️ Chỉnh sửa
          </DropdownMenuItem>
        )}
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
