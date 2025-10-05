import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";

export function ProfileHeader() {
  return (
    <div className="mb-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h1 className="text-xl font-semibold text-foreground">Vinh Trần</h1>
          <p className="text-sm text-muted-foreground">vinhtranh90</p>
          <p className="mt-1 text-sm text-muted-foreground">3 followers</p>
        </div>

        <Avatar className="h-14 w-14">
          <div className="h-full w-full bg-gradient-to-br from-orange-400 via-teal-400 to-purple-400" />
        </Avatar>
      </div>

      <Button
        variant="outline"
        className="mt-4 w-full rounded-xl border-border bg-transparent text-foreground hover:bg-secondary"
      >
        Edit Profile
      </Button>
    </div>
  );
}
