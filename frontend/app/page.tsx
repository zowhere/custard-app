"use client";
import SignInForm from "@/components/signin";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 flex flex-col">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo and header */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center">
              <Image src={"/icon-192.png"} alt="Custard Logo" width={40} height={40} className="rounded-lg" />
            </div>
            <span className="font-bold text-2xl">Custard</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Welcome back</h2> 
        </div>
      </div>
      <Card className="w-full max-w-md shadow-lg border-0 bg-white">
        <CardContent className="space-y-6 px-8 pb-8">
          <SignInForm />
        </CardContent>
      </Card>
    </div>
  );
}
