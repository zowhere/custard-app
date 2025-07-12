/* eslint-disable  @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Mail,
  Loader2,
  CheckCircle,
  AlertCircle,
  KeyRound,
  ArrowLeft,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useUserStore } from "@/store/user";
// import { useBusinessStore } from "@/store/business";
import { useTokenStore } from "@/store/token";

type Step = "email" | "code" | "success";

/*
interface User {
  id: string;
  email: string;
  name: string;
  businessName: string;
}
*/

export default function SignInForm() {
  // const { updateBusiness } = useBusinessStore();
  // const { updateToken } = useTokenStore();
  // const { updateUser } = useUserStore();
  const {} = useTokenStore();
  const {} = useUserStore();
  const { setAuth, /*isAuthenticated*/ } = useAuth();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setStep("code");
      startResendCooldown();

      // Track code send event
      if (typeof window !== "undefined" && (window as any).gtag) {
        (window as any).gtag("event", "signin_code_sent", {
          event_category: "authentication",
          event_label: "email_otp",
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Invalid verification code");
      }

      const { token } = data;

      setAuth(token);

      if (typeof window !== "undefined" && (window as any).gtag) {
        (window as any).gtag("event", "signin_success", {
          event_category: "authentication",
          event_label: "email_otp",
        });
      }

      setTimeout(() => {
        window.location.href = data.redirectTo;
      }, 3000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Invalid verification code",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to resend code");
      }

      startResendCooldown();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to resend code");
    } finally {
      setIsLoading(false);
    }
  };

  const startResendCooldown = () => {
    setResendCooldown(60);
    const interval = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const goBackToEmail = () => {
    setStep("email");
    setCode("");
    setError("");
  };

  if (step === "success") {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
           {` Welcome back!`}
          </h3>
          <p className="text-sm text-gray-600 mb-4">
          {"You've successfully signed in to your Abakcus account."}
          </p>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="text-sm">
            <div className="font-medium text-yellow-900">{}</div>
            <div className="text-yellow-700">{}</div>
          </div>
        </div>

        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertDescription className="text-yellow-800 text-sm">
           {"Redirecting you to your dashboard in a few seconds..."}
          </AlertDescription>
        </Alert>

        <Button
          onClick={() => (window.location.href = "/dashboard")}
          className="w-full bg-gradient-to-r from-yellow-600 to-yellow-600 hover:from-yellow-700 hover:to-yellow-700"
        >
          Go to Dashboard
        </Button>
      </div>
    );
  }

  // Code verification step
  if (step === "code") {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <KeyRound className="w-8 h-8 text-yellow-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Check your email
          </h3>
          <p className="text-sm text-gray-600">
           {"We've sent a verification code to"}
            <br />
            <span className="font-mono bg-gray-50 px-2 py-1 rounded text-xs">
              {email}
            </span>
          </p>
        </div>

        <form onSubmit={handleCodeSubmit} className="space-y-4">
          <div>
            <Label
              htmlFor="code"
              className="block text-sm font-medium text-gray-700"
            >
              Verification Code
            </Label>
            <div className="mt-1">
              <Input
                title="input-verify"
                type="text"
                inputMode="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="h-12 text-center text-2xl font-mono tracking-widest"
                placeholder="000000"
                disabled={isLoading}
                autoComplete="one-time-code"
              />
            </div>
          </div>

          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <Button
            title="button-verify"
            type="submit"
            className="w-full h-12 bg-gradient-to-r from-yellow-600 to-yellow-600 hover:from-yellow-700 hover:to-blue-700"
            disabled={isLoading || code.length !== 6}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify Code"
            )}
          </Button>
        </form>

        <div className="text-center space-y-3">
          <div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResendCode}
              disabled={resendCooldown > 0 || isLoading}
              className="text-yellow-600 hover:text-yellow-700"
            >
              {resendCooldown > 0
                ? `Resend code in ${resendCooldown}s`
                : "Resend code"}
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={goBackToEmail}
            className="text-gray-600 hover:text-gray-700"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Use different email
          </Button>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-900 mb-2">
            {"Didn't receive the code?"}
          </h4>
          <ul className="text-xs text-blue-800 space-y-1">
            <li>• Check your spam or junk folder</li>
            <li>• Make sure you entered the correct email address</li>
            <li>• The code expires in 10 minutes</li>
            <li>{"• Try resending the code if it doesn't arrive"}</li>
          </ul>
        </div>
      </div>
    );
  }

  // Email input step
  return (
    <form onSubmit={handleEmailSubmit} className="space-y-6">
      <div>
        <Label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email address
        </Label>
        <div className="mt-1 relative">
          <Input
            title="input-email"
            id="input-email"
            name="input-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 pl-10"
            placeholder="Enter your email address"
            disabled={isLoading}
          />
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
      </div>

      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      <Button
        title="btn-submit"
        type="submit"
        className="w-full h-12 bg-gradient-to-r from-yellow-600 to-yellow-600 hover:from-yellow-700 hover:to-yellow-700"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending code...
          </>
        ) : (
          <>
            <Mail className="mr-2 h-4 w-4" />
            Send verification code
          </>
        )}
      </Button>

      <div className="text-center">
        <p className="text-xs text-gray-500">
          By signing in, you agree to our{" "}
          <a href="/terms" className="underline hover:text-yellow-600">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="/privacy" className="underline hover:text-yollow-600">
            Privacy Policy
          </a>
        </p>
      </div>
    </form>
  );
}
