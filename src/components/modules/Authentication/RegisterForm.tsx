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
import { useAuth } from "@/contexts/AuthContext";
import {
  getCitiesList,
  getDivisionsByCity,
  getPostalCodesByDivision,
} from "@/data/bangladeshData";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const registerSchema = z
  .object({
    name: z
      .string()
      .min(3, {
        message: "Name must be at least 3 characters",
      })
      .max(50, {
        message: "Name must be less than 50 characters",
      }),
    email: z.string().email({
      message: "Please enter a valid email address",
    }),
    phone: z.string().min(10, {
      message: "Phone number must be at least 10 characters",
    }),
    role: z.enum(["sender", "receiver"], {
      message: "Please select a role",
    }),
    password: z.string().min(8, {
      message: "Password must be at least 8 characters",
    }),
    confirmPassword: z.string().min(8, {
      message: "Confirm Password must be at least 8 characters",
    }),
    address: z.object({
      street: z.string().min(1, {
        message: "Street address is required",
      }),
      city: z.string().min(1, {
        message: "City is required",
      }),
      state: z.string().min(1, {
        message: "State is required",
      }),
      zipCode: z.string().min(1, {
        message: "ZIP code is required",
      }),
      country: z.string().min(1, {
        message: "Country is required",
      }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export function RegisterForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { register } = useAuth();
  const router = useRouter();

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      role: "sender" as const,
      password: "",
      confirmPassword: "",
      address: {
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "Bangladesh",
      },
    },
  });

  const onSubmit = async (data: z.infer<typeof registerSchema>) => {
    const userInfo = {
      name: data.name,
      email: data.email,
      password: data.password,
      phone: data.phone,
      role: data.role,
      address: data.address,
    };

    try {
      await register(userInfo);
      toast.success("Account created successfully!");
      router.push("/login");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create account. Please try again.");
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-3xl font-bold">Create your account</h1>
        <p className="text-sm text-muted-foreground">
          Enter your details to create an account
        </p>
      </div>

      <div className="grid gap-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Two Column Grid Layout with Bigger Inputs */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Personal Info */}
              <div className="space-y-5">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Full Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="John Doe"
                          {...field}
                          className="h-12 text-sm"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="john.doe@example.com"
                          type="email"
                          {...field}
                          className="h-12 text-sm"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Phone Number
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="+8801700000001"
                          {...field}
                          className="h-12 text-sm"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Account Type</FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          className="flex h-8 w-full rounded-md border border-input bg-background px-3 py-1 text-xs ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="">Select your role</option>
                          <option value="sender">
                            Sender - Send parcels to others
                          </option>
                          <option value="receiver">
                            Receiver - Receive parcels from others
                          </option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Password</FormLabel>
                      <FormControl>
                        <Password
                          placeholder="Enter your password"
                          {...field}
                          className="h-8 text-xs"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">
                        Confirm Password
                      </FormLabel>
                      <FormControl>
                        <Password
                          placeholder="Confirm your password"
                          {...field}
                          className="h-8 text-xs"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Right Column - Address Info */}
              <div className="space-y-3">
                <div className="pb-1 border-b border-border">
                  <h3 className="text-sm font-medium">Address Information</h3>
                </div>
                <FormField
                  control={form.control}
                  name="address.street"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Street Address</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="123 Main Street"
                          {...field}
                          className="h-8 text-xs"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-2">
                  <FormField
                    control={form.control}
                    name="address.city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">City</FormLabel>
                        <FormControl>
                          <select
                            {...field}
                            onChange={(e) => {
                              field.onChange(e.target.value);
                              form.setValue("address.state", "");
                              form.setValue("address.zipCode", "");
                            }}
                            className="flex h-8 w-full rounded-md border border-input bg-background px-2 py-1 text-xs ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <option value="">Select a city</option>
                            {getCitiesList().map((city) => (
                              <option key={city} value={city}>
                                {city}
                              </option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="address.state"
                    render={({ field }) => {
                      const selectedCity = form.watch("address.city");
                      const divisions = selectedCity
                        ? getDivisionsByCity(selectedCity)
                        : [];

                      return (
                        <FormItem>
                          <FormLabel className="text-xs">Division</FormLabel>
                          <FormControl>
                            <select
                              {...field}
                              onChange={(e) => {
                                field.onChange(e.target.value);
                                form.setValue("address.zipCode", "");
                              }}
                              disabled={!selectedCity}
                              className="flex h-8 w-full rounded-md border border-input bg-background px-2 py-1 text-xs ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <option value="">
                                {selectedCity
                                  ? "Select a division"
                                  : "Select city first"}
                              </option>
                              {divisions.map((division) => (
                                <option key={division} value={division}>
                                  {division}
                                </option>
                              ))}
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <FormField
                    control={form.control}
                    name="address.country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Country</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value="Bangladesh"
                            disabled
                            className="h-8 text-xs bg-muted"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="address.zipCode"
                    render={({ field }) => {
                      const selectedCity = form.watch("address.city");
                      const selectedDivision = form.watch("address.state");
                      const postalCodes =
                        selectedCity && selectedDivision
                          ? getPostalCodesByDivision(
                              selectedCity,
                              selectedDivision
                            )
                          : [];

                      return (
                        <FormItem>
                          <FormLabel className="text-xs">Postal Code</FormLabel>
                          <FormControl>
                            <select
                              {...field}
                              disabled={!selectedDivision}
                              className="flex h-8 w-full rounded-md border border-input bg-background px-2 py-1 text-xs ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <option value="">
                                {selectedDivision
                                  ? "Select postal code"
                                  : "Select division first"}
                              </option>
                              {postalCodes.map((postal) => (
                                <option key={postal.code} value={postal.code}>
                                  {postal.code} - {postal.area}
                                </option>
                              ))}
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-9 text-sm"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting
                ? "Creating Account..."
                : "Create Account"}
            </Button>

            <div className="text-center">
              <p className="px-4 text-xs text-muted-foreground text-center">
                By clicking continue, you agree to our{" "}
                <a
                  href="#terms-of-service"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="#privacy-policy"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Privacy Policy
                </a>
                .
              </p>
            </div>
          </form>
        </Form>

        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="underline underline-offset-4 hover:text-primary font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
