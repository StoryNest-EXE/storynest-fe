"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export function SearchBar() {
  const [keyword, setKeyword] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    if (!keyword.trim()) return;
    router.push(`/search?keyword=${keyword}`);
  };

  return (
    <div
      className="flex items-center gap-2 w-full max-w-sm 
                 bg-black/30 backdrop-blur-md border border-white/10 
                 rounded-full px-3 py-1 transition hover:bg-black/40"
    >
      <Input
        type="text"
        placeholder="Search..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        className="flex-1 border-none bg-transparent text-white placeholder:text-white/60 focus-visible:ring-0 focus-visible:ring-offset-0"
      />
      <Button
        size="icon"
        variant="ghost"
        onClick={handleSearch}
        className="rounded-full text-white hover:bg-white/10"
      >
        <Search className="h-4 w-4" />
      </Button>
    </div>
  );
}
