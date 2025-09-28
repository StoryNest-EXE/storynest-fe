"use client";

import { Suspense } from "react";
import PaymentCheckoutClient from "./Paymentclient";

export default function PaymentCheckoutPage() {
  return (
    <Suspense fallback={<div>Đang tải...</div>}>
      <PaymentCheckoutClient />
    </Suspense>
  );
}
