import type { Metadata } from "next";

import { AuthCallbackHandler } from "@/components/layout/authentication/auth-callback-handler";

export const metadata: Metadata = {
  title: "Signing you in",
  // Carries one-time tokens in the URL: never index it, never send a referrer.
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

export default function AuthCallbackPage() {
  return <AuthCallbackHandler />;
}
