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
} from "../../constants/bangladeshData";
import { useAuth } from "../../hooks/useAuth";
import { cn } from "../../utils/utils";
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
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

const step1Schema = z
  .object({
    name: z
      .string()
      .min(3, { message: "Name must be at least 3 characters" })
      .max(50, { message: "Name must be less than 50 characters" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    phone: z.string().regex(/^(\+8801|01)[3-9]\d{8}$/, {
      message:
        "Please enter a valid Bangladesh phone number (e.g., +8801700000000 or 01700000000)",
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

const step2Schema = z.object({
  address: z
    .string()
    .min(10, { message: "Address must be at least 10 characters" }),
  city: z.string().min(1, { message: "Please select a city" }),
  division: z.string().min(1, { message: "Please select a division" }),
  postalCode: z.string().min(4, { message: "Please select a postal code" }),
});

type Step1Data = z.infer<typeof step1Schema>;
type Step2Data = z.infer<typeof step2Schema>;
type FullRegisterData = Step1Data & Step2Data;

export function MultiStepRegisterForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [step1Data, setStep1Data] = useState<Step1Data | null>(null);

  const [cities] = useState(getCitiesList());
  const [divisions, setDivisions] = useState<string[]>([]);
  const [postalCodes, setPostalCodes] = useState<string[]>([]);

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

  const step2Form = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      address: "",
      city: "",
      division: "",
      postalCode: "",
    },
  });

  const selectedCity = step2Form.watch("city");
  const selectedDivision = step2Form.watch("division");

  useEffect(() => {
    if (selectedCity) {
      const cityDivisions = getDivisionsByCity(selectedCity);
      setDivisions(cityDivisions);
      step2Form.setValue("division", "");
      step2Form.setValue("postalCode", "");
      setPostalCodes([]);
    }
  }, [selectedCity, step2Form]);

  useEffect(() => {
    if (selectedCity && selectedDivision) {
      const divisionPostalCodes = getPostalCodesByDivision(
        selectedCity,
        selectedDivision
      );
      
      setPostalCodes(
        divisionPostalCodes.map((item: any) => {
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

  const handleStep1Submit = async (data: Step1Data) => {
    setStep1Data(data);
    setCurrentStep(2);
    toast.success("Basic information saved! Please provide address details.");
  };

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
        navigate("/", { replace: true });
      } else {
        toast.error("Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration failed. Please try again.");
    }
  };

  const goBackToStep1 = () => {
    setCurrentStep(1);
  };

  return (
    <div className={cn("flex flex-col gap-4 sm:gap-5", className)} {...props}>
      {}
      <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-border/30 p-3 sm:p-4 shadow-lg">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <div
              className={cn(
                "w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-300 flex-shrink-0",
                currentStep === 1
                  ? "bg-gradient-to-r from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 text-white shadow-lg"
                  : "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg"
              )}
            >
              {currentStep === 1 ? "1" : <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-foreground text-xs sm:text-sm truncate">Basic Info</p>
              <p className="text-xs text-muted-foreground hidden md:block">
                Personal & Account
              </p>
            </div>
          </div>

          <div className="flex-1 mx-2 sm:mx-3 min-w-[30px] max-w-[80px]">
            <div className="h-1.5 sm:h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 transition-all duration-500 ease-out"
                style={{ width: currentStep === 1 ? "50%" : "100%" }}
              ></div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <div
              className={cn(
                "w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-300 flex-shrink-0",
                currentStep === 2
                  ? "bg-gradient-to-r from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 text-white shadow-lg"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
              )}
            >
              2
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-foreground text-xs sm:text-sm truncate">
                Address
              </p>
              <p className="text-xs text-muted-foreground hidden md:block">
                Location & Contact
              </p>
            </div>
          </div>
        </div>
      </div>

      {}
      {currentStep === 1 && (
        <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl sm:rounded-3xl border border-border/30 p-4 sm:p-6 lg:p-7 shadow-2xl">
          <div className="text-center mb-4 sm:mb-6">
            <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-r from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-xl">
              <User className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
            </div>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground mb-1.5 sm:mb-2">
              Create Account
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Let&apos;s start with your basic information
            </p>
          </div>

          <Form {...step1Form}>
            <form
              onSubmit={step1Form.handleSubmit(handleStep1Submit)}
              className="space-y-4 sm:space-y-5"
            >
              <FormField
                control={step1Form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="space-y-2 sm:space-y-3">
                    <FormLabel className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-2">
                      <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-500 dark:text-red-400" />
                      Full Name
                    </FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <Input
                          placeholder="Enter your full name"
                          className="pl-10 sm:pl-12 h-11 sm:h-12 lg:h-14 text-sm sm:text-base bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-700 border-2 border-gray-200 dark:border-slate-600 focus:border-red-500 dark:focus:border-red-400 focus:ring-4 focus:ring-red-500/20 dark:focus:ring-red-400/20 rounded-xl sm:rounded-2xl transition-all duration-300 hover:border-gray-300 dark:hover:border-slate-500"
                          {...field}
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                          <User className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 dark:text-gray-500 group-focus-within:text-red-500 dark:group-focus-within:text-red-400 transition-colors duration-300" />
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
                  <FormItem className="space-y-2 sm:space-y-3">
                    <FormLabel className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-500 dark:text-red-400" />
                      Email Address
                    </FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <Input
                          placeholder="Enter your email address"
                          type="email"
                          className="pl-10 sm:pl-12 h-11 sm:h-12 lg:h-14 text-sm sm:text-base bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-700 border-2 border-gray-200 dark:border-slate-600 focus:border-red-500 dark:focus:border-red-400 focus:ring-4 focus:ring-red-500/20 dark:focus:ring-red-400/20 rounded-xl sm:rounded-2xl transition-all duration-300 hover:border-gray-300 dark:hover:border-slate-500"
                          {...field}
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                          <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 dark:text-gray-500 group-focus-within:text-red-500 dark:group-focus-within:text-red-400 transition-colors duration-300" />
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
                  <FormItem className="space-y-2 sm:space-y-3">
                    <FormLabel className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-500 dark:text-red-400" />
                      Phone Number
                    </FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <Input
                          placeholder="01700000000 or +8801700000000"
                          className="pl-10 sm:pl-12 h-11 sm:h-12 lg:h-14 text-sm sm:text-base bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-700 border-2 border-gray-200 dark:border-slate-600 focus:border-red-500 dark:focus:border-red-400 focus:ring-4 focus:ring-red-500/20 dark:focus:ring-red-400/20 rounded-xl sm:rounded-2xl transition-all duration-300 hover:border-gray-300 dark:hover:border-slate-500"
                          {...field}
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                          <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 dark:text-gray-500 group-focus-within:text-red-500 dark:group-focus-within:text-red-400 transition-colors duration-300" />
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs text-red-500" />
                    <p className="text-xs text-muted-foreground">
                      Format: 01XXXXXXXXX or +8801XXXXXXXXX (Bangladesh numbers only)
                    </p>
                  </FormItem>
                )}
              />

              <FormField
                control={step1Form.control}
                name="role"
                render={({ field }) => (
                  <FormItem className="space-y-2 sm:space-y-3">
                    <FormLabel className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-2">
                      <UserCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-500 dark:text-red-400" />
                      Account Type
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ""}
                      >
                        <SelectTrigger className="h-11 sm:h-12 lg:h-14 text-sm sm:text-base bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-700 border-2 border-gray-200 dark:border-slate-600 focus:border-red-500 dark:focus:border-red-400 focus:ring-4 focus:ring-red-500/20 dark:focus:ring-red-400/20 rounded-xl sm:rounded-2xl transition-all duration-300 hover:border-gray-300 dark:hover:border-slate-500">
                          <SelectValue placeholder="Select your account type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem key="sender" value="sender">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-red-500 dark:bg-red-400 rounded-full"></div>
                              Sender - Send packages
                            </div>
                          </SelectItem>
                          <SelectItem key="receiver" value="receiver">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-orange-500 dark:bg-orange-400 rounded-full"></div>
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
                  <FormItem className="space-y-2 sm:space-y-3">
                    <FormLabel className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-500 dark:text-red-400" />
                      Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <Password
                          placeholder="Create a strong password"
                          className="pl-10 sm:pl-12 h-11 sm:h-12 lg:h-14 text-sm sm:text-base bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-700 border-2 border-gray-200 dark:border-slate-600 focus:border-red-500 dark:focus:border-red-400 focus:ring-4 focus:ring-red-500/20 dark:focus:ring-red-400/20 rounded-xl sm:rounded-2xl transition-all duration-300 hover:border-gray-300 dark:hover:border-slate-500"
                          {...field}
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                          <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 dark:text-gray-500 group-focus-within:text-red-500 dark:group-focus-within:text-red-400 transition-colors duration-300" />
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
                  <FormItem className="space-y-2 sm:space-y-3">
                    <FormLabel className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-500 dark:text-red-400" />
                      Confirm Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <Password
                          placeholder="Confirm your password"
                          className="pl-10 sm:pl-12 h-11 sm:h-12 lg:h-14 text-sm sm:text-base bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-700 border-2 border-gray-200 dark:border-slate-600 focus:border-red-500 dark:focus:border-red-400 focus:ring-4 focus:ring-red-500/20 dark:focus:ring-red-400/20 rounded-xl sm:rounded-2xl transition-all duration-300 hover:border-gray-300 dark:hover:border-slate-500"
                          {...field}
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                          <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 dark:text-gray-500 group-focus-within:text-red-500 dark:group-focus-within:text-red-400 transition-colors duration-300" />
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
                className="w-full h-11 sm:h-12 lg:h-14 bg-gradient-to-r from-red-600 via-red-700 to-orange-600 hover:from-red-700 hover:via-red-800 hover:to-orange-700 dark:from-red-700 dark:via-red-800 dark:to-orange-700 dark:hover:from-red-800 dark:hover:via-red-900 dark:hover:to-orange-800 text-white font-bold text-sm sm:text-base rounded-xl sm:rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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

      {}
      {currentStep === 2 && (
        <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl sm:rounded-3xl border border-border/30 p-4 sm:p-6 lg:p-7 shadow-2xl">
          <div className="text-center mb-4 sm:mb-6">
            <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-r from-orange-500 to-red-600 dark:from-orange-600 dark:to-red-700 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-xl">
              <MapPin className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
            </div>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground mb-1.5 sm:mb-2">
              Address Information
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Complete your profile with location details
            </p>
          </div>

          <Form {...step2Form}>
            <form
              onSubmit={step2Form.handleSubmit(handleStep2Submit)}
              className="space-y-4 sm:space-y-5"
            >
              <FormField
                control={step2Form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="space-y-2 sm:space-y-3">
                    <FormLabel className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-500 dark:text-orange-400" />
                      Street Address
                    </FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <Input
                          placeholder="Enter your full address"
                          className="pl-10 sm:pl-12 h-11 sm:h-12 lg:h-14 text-sm sm:text-base bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-700 border-2 border-gray-200 dark:border-slate-600 focus:border-orange-500 dark:focus:border-orange-400 focus:ring-4 focus:ring-orange-500/20 dark:focus:ring-orange-400/20 rounded-xl sm:rounded-2xl transition-all duration-300 hover:border-gray-300 dark:hover:border-slate-500"
                          {...field}
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                          <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 dark:text-gray-500 group-focus-within:text-orange-500 dark:group-focus-within:text-orange-400 transition-colors duration-300" />
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
                  <FormItem className="space-y-2 sm:space-y-3">
                    <FormLabel className="text-xs sm:text-sm font-bold text-foreground">
                      City
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ""}
                      >
                        <SelectTrigger className="h-11 sm:h-12 lg:h-14 text-sm sm:text-base bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-700 border-2 border-gray-200 dark:border-slate-600 focus:border-orange-500 dark:focus:border-orange-400 focus:ring-4 focus:ring-orange-500/20 dark:focus:ring-orange-400/20 rounded-xl sm:rounded-2xl transition-all duration-300 hover:border-gray-300 dark:hover:border-slate-500">
                          <SelectValue placeholder="Select your city" />
                        </SelectTrigger>
                        <SelectContent>
                          {cities.map((city: any, index: number) => (
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
                  <FormItem className="space-y-2 sm:space-y-3">
                    <FormLabel className="text-xs sm:text-sm font-bold text-foreground">
                      Division
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ""}
                        disabled={!selectedCity}
                      >
                        <SelectTrigger className="h-11 sm:h-12 lg:h-14 text-sm sm:text-base bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-700 border-2 border-gray-200 dark:border-slate-600 focus:border-orange-500 dark:focus:border-orange-400 focus:ring-4 focus:ring-orange-500/20 dark:focus:ring-orange-400/20 rounded-xl sm:rounded-2xl transition-all duration-300 hover:border-gray-300 dark:hover:border-slate-500 disabled:opacity-50">
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
                  <FormItem className="space-y-2 sm:space-y-3">
                    <FormLabel className="text-xs sm:text-sm font-bold text-foreground">
                      Postal Code
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ""}
                        disabled={!selectedDivision}
                      >
                        <SelectTrigger className="h-11 sm:h-12 lg:h-14 text-sm sm:text-base bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-700 border-2 border-gray-200 dark:border-slate-600 focus:border-orange-500 dark:focus:border-orange-400 focus:ring-4 focus:ring-orange-500/20 dark:focus:ring-orange-400/20 rounded-xl sm:rounded-2xl transition-all duration-300 hover:border-gray-300 dark:hover:border-slate-500 disabled:opacity-50">
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

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
                <Button
                  type="button"
                  onClick={goBackToStep1}
                  variant="outline"
                  className="flex-1 h-11 sm:h-12 lg:h-14 border-2 border-gray-300 dark:border-gray-600 text-foreground hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-xl sm:rounded-2xl transition-all duration-300 hover:scale-[1.02]"
                >
                  <div className="flex items-center justify-center gap-2 sm:gap-3">
                    <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-sm sm:text-base font-semibold">Back</span>
                  </div>
                </Button>

                <Button
                  type="submit"
                  disabled={step2Form.formState.isSubmitting}
                  className="flex-1 h-11 sm:h-12 lg:h-14 bg-gradient-to-r from-red-600 via-orange-600 to-red-700 hover:from-red-700 hover:via-orange-700 hover:to-red-800 dark:from-red-700 dark:via-orange-700 dark:to-red-800 dark:hover:from-red-800 dark:hover:via-orange-800 dark:hover:to-red-900 text-white font-bold text-sm sm:text-base rounded-xl sm:rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {step2Form.formState.isSubmitting ? (
                    <div className="flex items-center justify-center gap-2 sm:gap-3">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Creating...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2 sm:gap-3">
                      <UserCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>Create Account</span>
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      )}

      {}
      <div className="text-center space-y-3 sm:space-y-4">
        <p className="text-xs sm:text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-red-600 dark:text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors duration-300 hover:underline"
          >
            Sign in here
          </Link>
        </p>
        <p className="text-xs text-muted-foreground hidden sm:block">
          By creating an account, you agree to our Terms of Service and Privacy
          Policy.
        </p>
      </div>
    </div>
  );
}

