"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ProfileForm } from "./ProfileForm";
import { ChangePasswordForm } from "./ChangePasswordForm";
import { UserProfile } from "@/types/user";

interface EditProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: UserProfile;
}

type TabType = "profile" | "password";

export function EditProfileModal({
  open,
  onOpenChange,
  initialData,
}: EditProfileModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>("profile");

  const handleTabChange = (tab: TabType) => {
    if (tab !== activeTab) {
      setActiveTab(tab);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-background">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa hồ sơ</DialogTitle>
        </DialogHeader>

        {/* Tab Buttons */}
        <div className="flex gap-2 border-b">
          <Button
            variant={activeTab === "profile" ? "default" : "ghost"}
            onClick={() => handleTabChange("profile")}
            className="flex-1 rounded-none border-b-2 border-transparent data-[active=true]:border-primary"
            data-active={activeTab === "profile"}
          >
            Cập nhật hồ sơ
          </Button>
          <Button
            variant={activeTab === "password" ? "default" : "ghost"}
            onClick={() => handleTabChange("password")}
            className="flex-1 rounded-none border-b-2 border-transparent data-[active=true]:border-primary"
            data-active={activeTab === "password"}
          >
            Đổi mật khảu
          </Button>
        </div>

        {/* Content with Slide Animation */}
        <div className="relative overflow-hidden min-h-96">
          {/* Profile Form */}
          <div
            className={`transition-all duration-300 ${
              activeTab === "profile"
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-full absolute"
            }`}
          >
            {activeTab === "profile" && (
              <ProfileForm
                initialData={initialData}
                onSuccess={() => onOpenChange(false)}
              />
            )}
          </div>

          {/* Password Form */}
          <div
            className={`transition-all duration-300 ${
              activeTab === "password"
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-full absolute"
            }`}
          >
            {activeTab === "password" && (
              <ChangePasswordForm onSuccess={() => onOpenChange(false)} />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
