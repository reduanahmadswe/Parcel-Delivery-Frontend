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
import { useAuth } from "../../hooks/useAuth";
import { useAuthNavigation } from "../../hooks/useAuthNavigation";
import { cn } from "../../utils/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Mail, Package, Shield, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
});

const testCredentials = [
  { role: "Admin", email: "admin@parceldelivery.com", password: "Admin123!" },
  { role: "Sender", email: "sender@example.com", password: "password123" },
  { role: "Receiver", email: "receiver@example.com", password: "password123" },
];

export function LoginForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { login, user } = useAuth();
  const { navigateAfterLogin } = useAuthNavigation();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    try {
      const result = await login(data.email, data.password);

      if (result.success && result.user) {
        toast.success(`Welcome back, ${result.user.name}!`);

        // Wait for state to properly update before navigation
        // This ensures all state updates are complete
        await new Promise(resolve => setTimeout(resolve, 400));

        // Use the custom navigation hook for reliable navigation
        navigateAfterLogin(result.user);
      } else {
        console.error("❌ [LoginForm] Login failed:", result);
        toast.error("Invalid email or password");
      }
    } catch (error) {
      console.error("💥 [LoginForm] Login error:", error);
      toast.error("Login failed. Please try again.");
    }
  };

  const fillTestCredentials = (email: string, password: string) => {
    form.setValue("email", email);
    form.setValue("password", password);
    toast.info("Test credentials filled!");
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      {}
      <div className="relative overflow-hidden rounded-2xl border border-border/40 bg-gradient-to-br from-blue-50/50 via-indigo-50/50 to-purple-50/50 dark:from-blue-950/20 dark:via-indigo-950/20 dark:to-purple-950/20 p-6 backdrop-blur-sm shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-indigo-500/5 to-purple-500/5"></div>
        <div className="relative">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-md">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">
                🚀 Demo Accounts
              </h3>
              <p className="text-sm text-muted-foreground">
                Click any account to auto-fill login credentials
              </p>
            </div>
          </div>
          <div className="grid gap-3">
            {testCredentials.map((cred, index) => (
              <button
                key={index}
                type="button"
                onClick={() => fillTestCredentials(cred.email, cred.password)}
                className="group relative overflow-hidden text-left p-4 rounded-xl border border-border/50 bg-background/60 backdrop-blur-sm transition-all duration-300 hover:border-red-300 hover:bg-background/80 hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm group-hover:scale-110 transition-transform duration-300">
                    {cred.role === "Admin" ? (
                      <Shield className="w-5 h-5" />
                    ) : cred.role === "Sender" ? (
                      <Package className="w-5 h-5" />
                    ) : (
                      <User className="w-5 h-5" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-foreground text-sm">
                      {cred.role}
                    </div>
                    <div className="text-muted-foreground text-xs">
                      {cred.email}
                    </div>
                    <div className="text-muted-foreground text-xs font-mono">
                      {cred.password}
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
              </button>
            ))}
          </div>
          <p className="text-xs mt-3 text-muted-foreground flex items-center gap-1">
            <Mail className="w-3 h-3" />
            Click any account above to automatically fill the login form
          </p>
        </div>
      </div>

      {}
      <div className="bg-white/70 dark:bg-background/70 backdrop-blur-sm rounded-3xl border border-border/30 p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-600 dark:from-red-600 dark:to-red-700 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl">
            <Package className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Sign In</h2>
          <p className="text-muted-foreground">
            Access your delivery dashboard
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    Email Address
                  </FormLabel>
                  <FormControl>
                    <div className="relative group">
                      <Input
                        placeholder="Enter your email address"
                        type="email"
                        className="pl-12 h-12 text-base bg-background/50 border-border/50 focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition-all duration-300 group-hover:border-border"
                        {...field}
                      />
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className="w-5 h-5 text-muted-foreground group-focus-within:text-red-500 transition-colors duration-300" />
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Lock className="w-4 h-4 text-muted-foreground" />
                    Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative group">
                      <Password
                        placeholder="Enter your password"
                        className="pl-12 h-12 text-base bg-background/50 border-border/50 focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition-all duration-300"
                        {...field}
                      />
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="w-5 h-5 text-muted-foreground group-focus-within:text-red-500 transition-colors duration-300" />
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded border-border focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-red-500"
                />
                <span className="text-muted-foreground">Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-red-500 hover:text-red-600 transition-colors duration-300 font-medium"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 hover:from-red-600 hover:to-red-700 dark:hover:from-red-700 dark:hover:to-red-800 text-white font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-0.5"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Signing in...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Sign in to Dashboard
                </div>
              )}
            </Button>
          </form>
        </Form>
      </div>

      {}
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="text-red-500 hover:text-red-600 transition-colors duration-300 font-semibold hover:underline underline-offset-4"
          >
            Sign up for free
          </Link>
        </p>
        <p className="text-xs text-muted-foreground mt-4 flex items-center justify-center gap-1">
          <Shield className="w-3 h-3" />
          Your data is protected with end-to-end encryption
        </p>
      </div>
    </div>
  );
}

