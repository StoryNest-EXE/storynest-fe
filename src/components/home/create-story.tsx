"use client";

import React from "react";
import { Card } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { getAvatarFromLocalStorage } from "@/lib/localStorage";

function CreateStory() {
  const router = useRouter();
  const avatar = getAvatarFromLocalStorage();
  return (
    <Card>
      <div className="flex row">
        <Avatar className="ml-7">
          <AvatarImage
            src={"https://cdn.storynest.io.vn/" + avatar}
            alt="@shadcn"
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <span
          className="opacity-40 ml-4 flex items-center"
          onClick={() => router.push("/create-story")}
        >
          Có chuyện gì hot!
        </span>
        <div className="flex-1 flex justify-end mr-5">
          <Button
            className="cursor-pointer"
            onClick={() => {
              router.push("/create-story");
            }}
          >
            Kể chuyện ngay
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default CreateStory;
