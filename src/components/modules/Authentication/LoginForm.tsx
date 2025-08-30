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
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Mail, Package, Shield, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
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

// Test credentials for easy testing
const testCredentials = [
  { role: "Admin", email: "admin@parceldelivery.com", password: "Admin123!" },
  { role: "Sender", email: "sender@example.com", password: "password123" },
  { role: "Receiver", email: "receiver@example.com", password: "password123" },
];

export function LoginForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { login } = useAuth();
  const router = useRouter();

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
        toast.success("Welcome back!");
        // Redirect admin to admin dashboard, others to home
        if (result.user.role === "admin") {
          router.push("/admin");
        } else {
          router.push("/");
        }
      } else {
        toast.error("Invalid email or password");
      }
    } catch (error) {
      console.error(error);
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
      {/* Enhanced Test Credentials Section */}
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

      {/* Enhanced Login Form Section */}
      <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-3xl border border-border/30 p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl">
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
                href="/forgot-password"
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

        {/* Social Login Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border"></span>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-4 text-muted-foreground font-medium">
              Or continue with
            </span>
          </div>
        </div>

        {/* Google Login Button */}
        <Button
          type="button"
          variant="outline"
          className="w-full h-12 bg-background/50 border-border/50 hover:bg-accent/50 hover:border-border text-foreground font-medium transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-0.5 group"
          onClick={() => toast.info("Google authentication coming soon!")}
        >
          <div className="flex items-center gap-3">
            <svg
              className="w-5 h-5 group-hover:scale-110 transition-transform duration-300"
              viewBox="0 0 24 24"
            >
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC04"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span>Continue with Google</span>
          </div>
        </Button>
      </div>

      {/* Footer */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
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
