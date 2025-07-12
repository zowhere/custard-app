/* eslint-disable  @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  User,
  Building2,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Sparkles,
  MapPin,
  Globe,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useSearchParams } from "next/navigation";

type OnboardingStep = "profile" | "business" | "token" | "complete";

interface UserProfile {
  name: string;
}

interface BusinessProfile {
  businessName: string;
  businessType: string;
  businessAddress: string;
  website: string;
  description: string;
}

interface LoyaltyToken {
  tokenName: string;
  tokenSymbol: string;
  description: string;
}

const businessTypes = [
  "Restaurant",
  "Retail Store",
  "Service Business",
  "Health & Beauty",
  "Fitness & Wellness",
  "Professional Services",
  "Entertainment",
  "Other",
];

export default function OnboardingFlow() {
  // const { user } = useUserStore();
  const searchParams = useSearchParams();
  const profileCompleted = searchParams.get("profileCompleted");
  const tokenCompleted = searchParams.get("tokenCompleted");
  const businessCompleted = searchParams.get("businessCompleted");
  const { makeAuthenticatedRequest } = useAuth();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("profile");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "",
  });
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile>({
    businessName: "",
    businessType: "",
    businessAddress: "",
    website: "",
    description: "",
  });

  const [loyaltyToken, setLoyaltyToken] = useState<LoyaltyToken>({
    tokenName: "",
    tokenSymbol: "",
    description: "",
  });

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        if (!profileCompleted || profileCompleted === "false") {
          setCurrentStep("profile");
        } else if (!businessCompleted || businessCompleted === "false") {
          setCurrentStep("business");
        } else if (!tokenCompleted || tokenCompleted === "false") {
          setCurrentStep("token");
        } else {
          setCurrentStep("complete");
        }
      } catch (error) {
        console.error("Failed to check onboarding status:", error);
      }
    };

    checkOnboardingStatus();
  }, []);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await makeAuthenticatedRequest("/api/user", {
        method: "PUT",
        body: JSON.stringify({
          ...userProfile,
        }),
      });

      if (response.ok) {
        setCurrentStep("business");
        return;
      }

      throw Error("Failed to save profile. Please try again.");
    } catch (err) {
      console.log(err)
      setError("Failed to save profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBusinessSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {

      const response = await makeAuthenticatedRequest("/api/business", {
        method: "PUT",
        body: JSON.stringify({
          ...businessProfile,
        }),
      });

      if (response.ok) {
        console.log("Business profile saved:", businessProfile);
        setCurrentStep("token");

        if (typeof window !== "undefined" && (window as any).gtag) {
          (window as any).gtag("event", "onboarding_completed", {
            event_category: "user_journey",
            event_label: "business_setup",
          });
        }
        return;
      }

      // Track onboarding completion
      throw Error("Failed to save profile. Please try again.");
    } catch (err) {
      console.log(err);
      setError("Failed to save business profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const goToDashboard = () => {
    window.location.href = "/dashboard";
  };

  const renderProgressBar = () => {
    const steps = [
      { key: "profile", label: "Profile", icon: User },
      { key: "business", label: "Business", icon: Building2 },
      { key: "token", label: "Token", icon: Sparkles },
      { key: "complete", label: "Complete", icon: CheckCircle },
    ];

    const currentIndex = steps.findIndex((step) => step.key === currentStep);

    return (
      <div className="flex items-center justify-center mb-8">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index === currentIndex;
          const isCompleted = index < currentIndex;
          const isLast = index === steps.length - 1;

          return (
            <div key={step.key} className="flex items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  isCompleted
                    ? "bg-green-500 border-green-500 text-white"
                    : isActive
                      ? "bg-yellow-600 border-yellow-600 text-white"
                      : "bg-gray-100 border-gray-300 text-gray-400"
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div className="ml-2 mr-4">
                <div
                  className={`text-sm font-medium ${isCompleted || isActive ? "text-gray-900" : "text-gray-400"}`}
                >
                  {step.label}
                </div>
              </div>
              {!isLast && (
                <div
                  className={`w-12 h-0.5 ${isCompleted ? "bg-green-500" : "bg-gray-300"} mr-4`}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const handleTokenSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await makeAuthenticatedRequest("/api/token", {
        method: "POST",
        body: JSON.stringify({
          ...loyaltyToken,
        }),
      });

      if (response.ok) {
        setCurrentStep("complete");

        // Track token creation completion
        if (typeof window !== "undefined" && (window as any).gtag) {
          (window as any).gtag("event", "token_created", {
            event_category: "onboarding",
            event_label: "loyalty_token",
            token_symbol: loyaltyToken.tokenSymbol,
          });
        }
        return;
      }
      throw new Error("Failed to create loyalty token. Please try again.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create loyalty token. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-yellow-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-600 to-yellow-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="font-bold text-2xl">Custard</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to Custard!
          </h1>
          <p className="text-gray-600">
            {"Let's set up your account to get started with your loyalty program."}
          </p>
        </div>

        {renderProgressBar()}

        {/* Profile Step */}
        {currentStep === "profile" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2 text-yellow-600" />
                Personal Information
              </CardTitle>
              <p className="text-sm text-gray-600">
                Tell us a bit about yourself
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                <div>
                  <Label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Full Name *
                  </Label>
                  <Input
                    title={"input-name"}
                    id="name"
                    type="text"
                    required
                    value={userProfile.name}
                    onChange={(e) =>
                      setUserProfile({ ...userProfile, name: e.target.value })
                    }
                    className="mt-1 h-12"
                    placeholder="Enter your full name"
                    disabled={isLoading}
                  />
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
                  title={"button-submit-name"}
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-yellow-600 to-yellow-600 hover:from-yellow-700 hover:to-yellow-700"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      Continue
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Business Step */}
        {currentStep === "business" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building2 className="w-5 h-5 mr-2 text-yellow-600" />
                Business Information
              </CardTitle>
              <p className="text-sm text-gray-600">
                Set up your business profile for your loyalty program
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleBusinessSubmit} className="space-y-6">
                <div>
                  <Label
                    htmlFor="businessName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Business Name *
                  </Label>
                  <Input
                    title={"input-business-name"}
                    id="businessName"
                    type="text"
                    required
                    value={businessProfile.businessName}
                    onChange={(e) =>
                      setBusinessProfile({
                        ...businessProfile,
                        businessName: e.target.value,
                      })
                    }
                    className="mt-1 h-12"
                    placeholder="Enter your business name"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <Label
                    htmlFor="businessType"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Business Type *
                  </Label>
                  <Select
                    value={businessProfile.businessType}
                    onValueChange={(value) =>
                      setBusinessProfile({
                        ...businessProfile,
                        businessType: value,
                      })
                    }
                    disabled={isLoading}
                  >
                    <SelectTrigger className="mt-1 h-12">
                      <SelectValue placeholder="Select your business type" />
                    </SelectTrigger>
                    <SelectContent>
                      {businessTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label
                    htmlFor="businessAddress"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Business Address
                  </Label>
                  <div className="mt-1 relative">
                    <Input
                      title={"input-business-address"}
                      id="businessAddress"
                      type="text"
                      value={businessProfile.businessAddress}
                      onChange={(e) =>
                        setBusinessProfile({
                          ...businessProfile,
                          businessAddress: e.target.value,
                        })
                      }
                      className="h-12 pl-10"
                      placeholder="123 Main St, City, State"
                      disabled={isLoading}
                    />
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor="website"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Website
                  </Label>
                  <div className="mt-1 relative">
                    <Input
                      title={"input-business-website"}
                      id="website"
                      type="url"
                      value={businessProfile.website}
                      onChange={(e) =>
                        setBusinessProfile({
                          ...businessProfile,
                          website: e.target.value,
                        })
                      }
                      className="h-12 pl-10"
                      placeholder="https://yourbusiness.com"
                      disabled={isLoading}
                    />
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Business Description
                  </Label>
                  <Textarea
                    title={"input-business-description"}
                    id="description"
                    value={businessProfile.description}
                    onChange={(e) =>
                      setBusinessProfile({
                        ...businessProfile,
                        description: e.target.value,
                      })
                    }
                    className="mt-1"
                    placeholder="Tell us about your business..."
                    rows={3}
                    disabled={isLoading}
                  />
                </div>

                {error && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="flex space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep("profile")}
                    className="flex-1 h-12"
                    disabled={isLoading}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <Button
                    title={"button-submit-business"}
                    type="submit"
                    className="flex-1 h-12 bg-gradient-to-r from-yellow-600 to-yellow-600 hover:from-yellow-700 hover:to-yellow-700"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        Complete Setup
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Token Step */}
        {currentStep === "token" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-yellow-600" />
                Create Your Loyalty Token
              </CardTitle>
              <p className="text-sm text-gray-600">
                Design your unique loyalty token that customers will earn and
                redeem
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleTokenSubmit} className="space-y-6">
                <div>
                  <Label
                    htmlFor="tokenName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Token Name *
                  </Label>
                  <Input
                    title={"input-token-name"}
                    id="tokenName"
                    type="text"
                    required
                    value={loyaltyToken.tokenName}
                    onChange={(e) =>
                      setLoyaltyToken({
                        ...loyaltyToken,
                        tokenName: e.target.value,
                      })
                    }
                    className="mt-1 h-12"
                    placeholder="e.g., Bloom Points, TechFix Coins, Artisan Rewards"
                    disabled={isLoading}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    This is what customers will see when earning rewards
                  </p>
                </div>

                <div>
                  <Label
                    htmlFor="tokenSymbol"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Token Symbol *
                  </Label>
                  <Input
                    title={"input-token-symbol"}
                    id="tokenSymbol"
                    type="text"
                    required
                    value={loyaltyToken.tokenSymbol}
                    onChange={(e) =>
                      setLoyaltyToken({
                        ...loyaltyToken,
                        tokenSymbol: e.target.value.toUpperCase().slice(0, 6),
                      })
                    }
                    className="mt-1 h-12"
                    placeholder="e.g., BLOOM, TECH, ART"
                    disabled={isLoading}
                    maxLength={6}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Short abbreviation (max 6 characters)
                  </p>
                </div>

                <div>
                  <Label
                    htmlFor="tokenDescription"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Token Description
                  </Label>
                  <Textarea
                    title={"input-token-description"}
                    id="tokenDescription"
                    value={loyaltyToken.description}
                    onChange={(e) =>
                      setLoyaltyToken({
                        ...loyaltyToken,
                        description: e.target.value,
                      })
                    }
                    className="mt-1"
                    placeholder="Describe what makes your loyalty token special..."
                    rows={3}
                    disabled={isLoading}
                  />
                </div>

                {/* Token Preview */}
                {(loyaltyToken.tokenName || loyaltyToken.tokenSymbol) && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-yellow-900 mb-3">
                      Token Preview
                    </h4>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-yellow-600 to-yellow-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {loyaltyToken.tokenSymbol || "?"}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-yellow-900">
                          {loyaltyToken.tokenName || "Your Token Name"}
                        </div>
                        <div className="text-sm text-yellow-700">
                          Symbol: {loyaltyToken.tokenSymbol || "SYMBOL"}
                        </div>
                        {loyaltyToken.description && (
                          <div className="text-xs text-yellow-600 mt-1">
                            {loyaltyToken.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Example tokens for inspiration */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-yellow-900 mb-2">
                    Need inspiration?
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    <div className="text-yellow-800">
                      <strong>Coffee Shop:</strong> Brew Points (BREW)
                    </div>
                    <div className="text-yellow-800">
                      <strong>Fitness:</strong> Fit Coins (FIT)
                    </div>
                    <div className="text-yellow-800">
                      <strong>Retail:</strong> Style Stars (STYLE)
                    </div>
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

                <div className="flex space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep("business")}
                    className="flex-1 h-12"
                    disabled={isLoading}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <Button
                    title={"button-submit-token"}
                    onClick={handleTokenSubmit}
                    className="flex-1 h-12 bg-gradient-to-r from-yellow-600 to-yellow-600 hover:from-yellow-700 hover:to-yellow-700"
                    disabled={
                      isLoading ||
                      !loyaltyToken.tokenName ||
                      !loyaltyToken.tokenSymbol
                    }
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Token...
                      </>
                    ) : (
                      <>
                        Create Token
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Complete Step */}
        {currentStep === "complete" && (
          <Card>
            <CardContent className="text-center py-12">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {"🎉 Welcome to Custard!"}
              </h2>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {"Your account is all set up! You're ready to start building customer loyalty and growing your business."}
              </p>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-yellow-900 mb-2">
                 {"What's next?"}
                </h3>
                <ul className="text-sm text-yellow-800 space-y-1">
                  <li>• Set up your loyalty program rules</li>
                  <li>• Customize your rewards and points system</li>
                  <li>• Start inviting customers to join</li>
                  <li>{" What's next?"}</li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={goToDashboard}
                  className="bg-gradient-to-r from-yellow-600 to-yellow-600 hover:from-yellow-700 hover:to-yellow-700 px-8"
                >
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline">Watch Tutorial</Button>
              </div>

              <div className="mt-8 flex justify-center">
                <Badge
                  variant="secondary"
                  className="bg-yellow-100 text-yellow-700"
                >
                  Beta Access • Free during launch period
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
