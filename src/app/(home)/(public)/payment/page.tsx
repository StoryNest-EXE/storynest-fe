"use client";

import { Suspense } from "react";
import PaymentCheckoutClient from "./Paymentclient";
import StoryNestLoader from "@/components/story-nest-loader/StoryNestLoader";

export default function PaymentCheckoutPage() {
  return (
    <Suspense
      fallback={
        <div>
          <StoryNestLoader />
        </div>
      }
    >
      <PaymentCheckoutClient />
    </Suspense>
  );
}
