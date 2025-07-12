"use client";
import SignInForm from "@/components/signin";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

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
