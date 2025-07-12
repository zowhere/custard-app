"use client";
import SignInForm from "@/components/signin";
import { Card, CardContent } from "@/components/ui/card";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-yellow-100 p-4">
      <Card className="w-full max-w-md shadow-lg border-0 bg-white">
        <CardContent className="space-y-6 px-8 pb-8">
          <SignInForm />
        </CardContent>
      </Card>
    </div>
  );
}
