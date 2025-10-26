"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMeQuery } from "@/queries/user.queries";
import { useState } from "react";
import { EditProfileModal } from "@/app/(home)/(private)/(user)/profile/modals/EditProfileModal";

export function ProfileHeader() {
  const [modalOpen, setModalOpen] = useState(false);
  const { data } = useMeQuery();
  console.log("data nè:", data);

  return (
    <div className="mb-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h1 className="text-xl font-semibold text-foreground">
            {data?.data.username}
          </h1>
          <p className="text-sm text-muted-foreground">{data?.data.email}</p>
        </div>

        <Avatar className="h-14 w-14">
          <AvatarImage
            src={`https://cdn.storynest.io.vn/${data?.data.avatarUrl}`}
          />
          <AvatarFallback>Your avatar</AvatarFallback>
        </Avatar>
      </div>

      <Button
        variant="outline"
        className="mt-4 w-full rounded-xl border-border bg-transparent text-foreground hover:bg-secondary"
        onClick={() => setModalOpen(true)}
        size="lg"
      >
        Edit Profile
      </Button>
      <EditProfileModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        initialData={data?.data}
      />
    </div>
  );
}
