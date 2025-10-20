"use client";

import { Suspense } from "react";
import ResetPasswordContent from "./ResetPasswordContent";
import StoryNestLoader from "@/components/story-nest-loader/StoryNestLoader";

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen">
          <StoryNestLoader />
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
