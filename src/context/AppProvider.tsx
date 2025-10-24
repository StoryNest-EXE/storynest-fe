"use client";

import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "./AuthContext";
import { Toaster } from "sonner";
import { SignalRProvider } from "./SignalRContext";
import { NeatBackground } from "@/components/NeatBackground";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      //   retry: 2, // Retry 2 lần nếu query thất bại
      //   staleTime: 5 * 60 * 1000, // Cache 5 phút
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  },
});

export default function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {/* <NeatBackground /> */}
      <AuthProvider>
        <SignalRProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <Toaster richColors position="top-right" />
            {children}
          </ThemeProvider>
        </SignalRProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
