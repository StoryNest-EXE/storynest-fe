"use client";

import { Button } from "@/components/ui/button";
import { useRefreshToken } from "@/lib/useRefreshToken";
import React from "react";

function TestRefresh() {
  const refresh = useRefreshToken();
  return (
    <div>
      <Button onClick={() => refresh}>refresh</Button>
    </div>
  );
}

export default TestRefresh;
