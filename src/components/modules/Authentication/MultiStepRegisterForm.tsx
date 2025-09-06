"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Password from "@/components/ui/Password";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getCitiesList,
  getDivisionsByCity,
  getPostalCodesByDivision,
} from "@/data/bangladeshData";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Lock,
  Mail,
  MapPin,
  Phone,
  User,
  UserCheck,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

// Step 1 Schema - Basic Information
const step1Schema = z
  .object({
    name: z
      .string()
      .min(3, { message: "Name must be at least 3 characters" })
      .max(50, { message: "Name must be less than 50 characters" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    phone: z.string().regex(/^[\+]?[1-9][\d]{0,15}$/, {
      message:
        "Please enter a valid phone number (e.g., +8801700000000 or 01700000000)",
    }),
    role: z
      .enum(["sender", "receiver"], { message: "Please select a role" })
      .optional(),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z
      .string()
      .min(8, { message: "Confirm Password must be at least 8 characters" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.role, {
    message: "Please select a role",
    path: ["role"],
  });

// Step 2 Schema - Address Information
const step2Schema = z.object({
  address: z
    .string()
    .min(10, { message: "Address must be at least 10 characters" }),
  city: z.string().min(1, { message: "Please select a city" }),
  division: z.string().min(1, { message: "Please select a division" }),
  postalCode: z.string().min(4, { message: "Please select a postal code" }),
});

// Combined Schema
type Step1Data = z.infer<typeof step1Schema>;
type Step2Data = z.infer<typeof step2Schema>;
type FullRegisterData = Step1Data & Step2Data;

export function MultiStepRegisterForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { register } = useAuth();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [step1Data, setStep1Data] = useState<Step1Data | null>(null);

  // Location data state
  const [cities] = useState(getCitiesList());
  const [divisions, setDivisions] = useState<string[]>([]);
  const [postalCodes, setPostalCodes] = useState<string[]>([]);

  // Step 1 Form
  const step1Form = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      role: undefined,
      password: "",
      confirmPassword: "",
    },
  });

  // Step 2 Form
  const step2Form = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      address: "",
      city: "",
      division: "",
      postalCode: "",
    },
  });

  // Watch city changes in step 2
  const selectedCity = step2Form.watch("city");
  const selectedDivision = step2Form.watch("division");

  // Update divisions when city changes
  useEffect(() => {
    if (selectedCity) {
      const cityDivisions = getDivisionsByCity(selectedCity);
      setDivisions(cityDivisions);
      step2Form.setValue("division", "");
      step2Form.setValue("postalCode", "");
      setPostalCodes([]);
    }
  }, [selectedCity, step2Form]);

  // Update postal codes when division changes
  useEffect(() => {
    if (selectedCity && selectedDivision) {
      const divisionPostalCodes = getPostalCodesByDivision(
        selectedCity,
        selectedDivision
      );
      // Handle PostalCode objects with code and area properties
      setPostalCodes(
        divisionPostalCodes.map((item) => {
          if (typeof item === "string") {
            return item;
          } else if (typeof item === "object" && item.code) {
            return item.code;
          } else {
            return item.toString();
          }
        })
      );
      step2Form.setValue("postalCode", "");
    }
  }, [selectedCity, selectedDivision, step2Form]);

  // Handle Step 1 submission
  const handleStep1Submit = async (data: Step1Data) => {
    setStep1Data(data);
    setCurrentStep(2);
    toast.success("Basic information saved! Please provide address details.");
  };

  // Handle Step 2 submission (Final registration)
  const handleStep2Submit = async (data: Step2Data) => {
    if (!step1Data) {
      toast.error("Please complete step 1 first");
      setCurrentStep(1);
      return;
    }

    const fullData: FullRegisterData = { ...step1Data, ...data };

    try {
      const success = await register({
        name: fullData.name,
        email: fullData.email,
        phone: fullData.phone,
        role: fullData.role!,
        password: fullData.password,
        address: {
          street: fullData.address,
          city: fullData.city,
          state: fullData.division,
          zipCode: fullData.postalCode,
          country: "Bangladesh",
        },
      });

      if (success) {
        toast.success("Account created successfully! Welcome to ParcelTrack!");
        router.push("/");
      } else {
        toast.error("Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration failed. Please try again.");
    }
  };

  // Go back to Step 1
  const goBackToStep1 = () => {
    setCurrentStep(1);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      {/* Step Progress Indicator */}
      <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl border border-border/30 p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-all duration-300",
                currentStep === 1
                  ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                  : "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg"
              )}
            >
              {currentStep === 1 ? "1" : <Check className="w-5 h-5" />}
            </div>
            <div>
              <p className="font-semibold text-foreground">Basic Information</p>
              <p className="text-xs text-muted-foreground">
                Personal & Account Details
              </p>
            </div>
          </div>

          <div className="flex-1 mx-4">
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500 ease-out"
                style={{ width: currentStep === 1 ? "50%" : "100%" }}
              ></div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-all duration-300",
                currentStep === 2
                  ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
              )}
            >
              2
            </div>
            <div>
              <p className="font-semibold text-foreground">
                Address Information
              </p>
              <p className="text-xs text-muted-foreground">
                Location & Contact Details
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Step 1 - Basic Information */}
      {currentStep === 1 && (
        <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-3xl border border-border/30 p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl">
              <User className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Create Account
            </h2>
            <p className="text-muted-foreground">
              Let&apos;s start with your basic information
            </p>
          </div>

          <Form {...step1Form}>
            <form
              onSubmit={step1Form.handleSubmit(handleStep1Submit)}
              className="space-y-6"
            >
              <FormField
                control={step1Form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-sm font-bold text-foreground flex items-center gap-2">
                      <User className="w-4 h-4 text-blue-500" />
                      Full Name
                    </FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <Input
                          placeholder="Enter your full name"
                          className="pl-12 h-14 text-base bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-700 border-2 border-gray-200 dark:border-slate-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 rounded-2xl transition-all duration-300 hover:border-gray-300 dark:hover:border-slate-500"
                          {...field}
                        />
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <User className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-300" />
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={step1Form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-sm font-bold text-foreground flex items-center gap-2">
                      <Mail className="w-4 h-4 text-blue-500" />
                      Email Address
                    </FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <Input
                          placeholder="Enter your email address"
                          type="email"
                          className="pl-12 h-14 text-base bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-700 border-2 border-gray-200 dark:border-slate-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 rounded-2xl transition-all duration-300 hover:border-gray-300 dark:hover:border-slate-500"
                          {...field}
                        />
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Mail className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-300" />
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={step1Form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-sm font-bold text-foreground flex items-center gap-2">
                      <Phone className="w-4 h-4 text-blue-500" />
                      Phone Number
                    </FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <Input
                          placeholder="01700000000 or +8801700000000"
                          className="pl-12 h-14 text-base bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-700 border-2 border-gray-200 dark:border-slate-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 rounded-2xl transition-all duration-300 hover:border-gray-300 dark:hover:border-slate-500"
                          {...field}
                        />
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Phone className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-300" />
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs text-red-500" />
                    <p className="text-xs text-muted-foreground">
                      Enter phone number without spaces or dashes (e.g.,
                      01700000000)
                    </p>
                  </FormItem>
                )}
              />

              <FormField
                control={step1Form.control}
                name="role"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-sm font-bold text-foreground flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-blue-500" />
                      Account Type
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ""}
                      >
                        <SelectTrigger className="h-14 text-base bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-700 border-2 border-gray-200 dark:border-slate-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 rounded-2xl transition-all duration-300 hover:border-gray-300 dark:hover:border-slate-500">
                          <SelectValue placeholder="Select your account type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem key="sender" value="sender">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              Sender - Send packages
                            </div>
                          </SelectItem>
                          <SelectItem key="receiver" value="receiver">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              Receiver - Receive packages
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage className="text-xs text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={step1Form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-sm font-bold text-foreground flex items-center gap-2">
                      <Lock className="w-4 h-4 text-blue-500" />
                      Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <Password
                          placeholder="Create a strong password"
                          className="pl-12 h-14 text-base bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-700 border-2 border-gray-200 dark:border-slate-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 rounded-2xl transition-all duration-300 hover:border-gray-300 dark:hover:border-slate-500"
                          {...field}
                        />
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Lock className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-300" />
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={step1Form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-sm font-bold text-foreground flex items-center gap-2">
                      <Lock className="w-4 h-4 text-blue-500" />
                      Confirm Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <Password
                          placeholder="Confirm your password"
                          className="pl-12 h-14 text-base bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-700 border-2 border-gray-200 dark:border-slate-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 rounded-2xl transition-all duration-300 hover:border-gray-300 dark:hover:border-slate-500"
                          {...field}
                        />
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Lock className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-300" />
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs text-red-500" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={step1Form.formState.isSubmitting}
                className="w-full h-14 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-bold text-base rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {step1Form.formState.isSubmitting ? (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Processing...
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <span>Next: Address Information</span>
                    <ArrowRight className="w-5 h-5" />
                  </div>
                )}
              </Button>
            </form>
          </Form>
        </div>
      )}

      {/* Step 2 - Address Information */}
      {currentStep === 2 && (
        <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-3xl border border-border/30 p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Address Information
            </h2>
            <p className="text-muted-foreground">
              Complete your profile with location details
            </p>
          </div>

          <Form {...step2Form}>
            <form
              onSubmit={step2Form.handleSubmit(handleStep2Submit)}
              className="space-y-6"
            >
              <FormField
                control={step2Form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-sm font-bold text-foreground flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-green-500" />
                      Street Address
                    </FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <Input
                          placeholder="Enter your full address"
                          className="pl-12 h-14 text-base bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-700 border-2 border-gray-200 dark:border-slate-600 focus:border-green-500 focus:ring-4 focus:ring-green-500/20 rounded-2xl transition-all duration-300 hover:border-gray-300 dark:hover:border-slate-500"
                          {...field}
                        />
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <MapPin className="w-5 h-5 text-gray-400 group-focus-within:text-green-500 transition-colors duration-300" />
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={step2Form.control}
                name="city"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-sm font-bold text-foreground">
                      City
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ""}
                      >
                        <SelectTrigger className="h-14 text-base bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-700 border-2 border-gray-200 dark:border-slate-600 focus:border-green-500 focus:ring-4 focus:ring-green-500/20 rounded-2xl transition-all duration-300 hover:border-gray-300 dark:hover:border-slate-500">
                          <SelectValue placeholder="Select your city" />
                        </SelectTrigger>
                        <SelectContent>
                          {cities.map((city, index) => (
                            <SelectItem
                              key={`city-${index}-${city}`}
                              value={city}
                            >
                              {city}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage className="text-xs text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={step2Form.control}
                name="division"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-sm font-bold text-foreground">
                      Division
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ""}
                        disabled={!selectedCity}
                      >
                        <SelectTrigger className="h-14 text-base bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-700 border-2 border-gray-200 dark:border-slate-600 focus:border-green-500 focus:ring-4 focus:ring-green-500/20 rounded-2xl transition-all duration-300 hover:border-gray-300 dark:hover:border-slate-500 disabled:opacity-50">
                          <SelectValue placeholder="Select your division" />
                        </SelectTrigger>
                        <SelectContent>
                          {divisions.map((division, index) => (
                            <SelectItem
                              key={`division-${index}-${division}`}
                              value={division}
                            >
                              {division}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage className="text-xs text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={step2Form.control}
                name="postalCode"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-sm font-bold text-foreground">
                      Postal Code
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ""}
                        disabled={!selectedDivision}
                      >
                        <SelectTrigger className="h-14 text-base bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-700 border-2 border-gray-200 dark:border-slate-600 focus:border-green-500 focus:ring-4 focus:ring-green-500/20 rounded-2xl transition-all duration-300 hover:border-gray-300 dark:hover:border-slate-500 disabled:opacity-50">
                          <SelectValue placeholder="Select your postal code" />
                        </SelectTrigger>
                        <SelectContent>
                          {postalCodes.map((code, index) => (
                            <SelectItem
                              key={`postal-${index}-${code}`}
                              value={code}
                            >
                              {code}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage className="text-xs text-red-500" />
                  </FormItem>
                )}
              />

              <div className="flex gap-4">
                <Button
                  type="button"
                  onClick={goBackToStep1}
                  variant="outline"
                  className="flex-1 h-14 border-2 border-gray-300 dark:border-gray-600 text-foreground hover:border-gray-400 dark:hover:border-gray-500 rounded-2xl transition-all duration-300 hover:scale-[1.02]"
                >
                  <div className="flex items-center gap-3">
                    <ArrowLeft className="w-5 h-5" />
                    <span>Back</span>
                  </div>
                </Button>

                <Button
                  type="submit"
                  disabled={step2Form.formState.isSubmitting}
                  className="flex-1 h-14 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 text-white font-bold text-base rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {step2Form.formState.isSubmitting ? (
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Creating Account...
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <UserCheck className="w-5 h-5" />
                      <span>Create Account</span>
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      )}

      {/* Additional Info */}
      <div className="text-center space-y-4">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-blue-600 hover:text-blue-700 transition-colors duration-300 hover:underline"
          >
            Sign in here
          </Link>
        </p>
        <p className="text-xs text-muted-foreground">
          By creating an account, you agree to our Terms of Service and Privacy
          Policy.
        </p>
      </div>
    </div>
  );
}
