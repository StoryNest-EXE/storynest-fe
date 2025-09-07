"use client";

import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "./AuthContext";

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
      {/* Thêm các provider khác ở đây sau này, ví dụ: <AuthProvider> */}
      <AuthProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
