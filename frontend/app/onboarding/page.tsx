import type { Metadata } from "next";
import OnboardingFlow from "@/components/onboarding";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Welcome to Custard | Complete Your Setup",
  description: "Complete your profile and business setup to start using Custard",
};

export default function OnboardingPage() {
  return (
    <Suspense>
      <OnboardingFlow />  
    </Suspense>
  );
}
