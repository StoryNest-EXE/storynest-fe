import React from "react";
import { Card } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

function CreateStory() {
  const router = useRouter();
  return (
    <Card>
      <div className="flex row">
        <Avatar className="ml-7">
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <span className="opacity-40 ml-4 flex items-center">
          What&apos;s new
        </span>
        <div className="flex-1 flex justify-end mr-5">
          <Button
            onClick={() => {
              router.push("/create-story");
            }}
          >
            Post
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default CreateStory;
