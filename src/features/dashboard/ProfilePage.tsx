import { Eye, EyeOff, Mail, MapPin, Phone, Save, User } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import ProtectedRoute from "../../components/common/ProtectedRoute";
import { useAuth } from "../../hooks/useAuth";
import api from "../../services/ApiConfiguration";
import FooterSection from "../../pages/public/sections/FooterSection";

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  role: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  createdAt: string;
}

interface PasswordUpdateData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState<UserProfile | null>(null);
  const [passwordData, setPasswordData] = useState<PasswordUpdateData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/users/profile");
      const profileData = response.data.data;
      setProfile(profileData);
      setFormData(profileData);
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (!formData) return;

    if (name.includes(".")) {
      const [section, field] = name.split(".");
      if (section === "address") {
        setFormData((prev) => ({
          ...prev!,
          address: {
            ...prev!.address,
            [field]: value,
          },
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev!,
        [name]: value,
      }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData?.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData?.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData?.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!passwordData.currentPassword.trim()) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!passwordData.newPassword.trim()) {
      newErrors.newPassword = "New password is required";
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
    }

    if (!passwordData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your new password";
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !formData) return;

    try {
      setIsUpdating(true);
      const response = await api.put("/users/profile", formData);
      setProfile(response.data.data);
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePassword()) return;

    try {
      setIsUpdating(true);
      await api.put("/users/change-password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setIsChangingPassword(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      toast.success("Password changed successfully");
    } catch (error: any) {
      console.error("Error changing password:", error);
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!profile) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Profile Not Found
            </h2>
            <p className="text-muted-foreground">
              Unable to load your profile information.
            </p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background mt-8 sm:mt-10">
        <div className="max-w-4xl mx-auto pt-2 sm:pt-3 px-3 xs:px-4 sm:px-5 lg:px-6 space-y-4 sm:space-y-5 lg:space-y-6 pb-20 sm:pb-24">
          {}
          <div className="bg-gradient-to-r from-red-50/50 via-purple-50/30 to-pink-50/50 dark:from-red-950/20 dark:via-purple-950/10 dark:to-pink-950/20 border border-border rounded-lg sm:rounded-xl lg:rounded-2xl p-4 sm:p-5 lg:p-6 hover:shadow-xl hover:border-red-200 dark:hover:border-red-800 hover:bg-gradient-to-r hover:from-red-50/70 hover:via-purple-50/50 hover:to-pink-50/70 dark:hover:from-red-950/30 dark:hover:via-purple-950/20 dark:hover:to-pink-950/30 transition-all duration-300 backdrop-blur-sm">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4">
              <div className="space-y-2 sm:space-y-3">
                <h1 className="text-xl xs:text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-red-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  My Profile
                </h1>
                <p className="text-xs xs:text-sm sm:text-base lg:text-lg text-muted-foreground">
                  Manage your account information and preferences
                </p>
                <div className="mt-2 sm:mt-3 flex flex-wrap items-center gap-2 xs:gap-3 sm:gap-4 text-xs xs:text-sm">
                  <span className="inline-flex items-center text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg">
                    <User className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-1.5" />
                    Account Management
                  </span>
                  <span className="inline-flex items-center text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/20 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg">
                    <Save className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-1.5" />
                    Secure & Private
                  </span>
                </div>
              </div>
              <div className="flex items-center">
                <div className="px-3 xs:px-4 py-1.5 xs:py-2 bg-gradient-to-r from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 text-red-600 dark:text-red-400 rounded-full text-xs xs:text-sm font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                  {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
            {}
            <div className="lg:col-span-2">
              <div className="bg-gradient-to-br from-background via-red-50/10 to-purple-50/10 dark:from-background dark:via-red-950/5 dark:to-purple-950/5 rounded-lg sm:rounded-xl shadow-sm border border-border hover:shadow-xl hover:border-red-200 dark:hover:border-red-800 transition-all duration-300 backdrop-blur-sm">
                <div className="p-4 sm:p-5 lg:p-6 border-b border-border">
                  <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2 xs:gap-0">
                    <h2 className="text-base xs:text-lg sm:text-xl font-semibold bg-gradient-to-r from-red-600 to-purple-600 bg-clip-text text-transparent">
                      Personal Information
                    </h2>
                    {!isEditing && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium transition-all duration-300 hover:scale-105 px-3 xs:px-4 py-1.5 xs:py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 border border-transparent hover:border-red-200 dark:hover:border-red-800 text-xs xs:text-sm"
                      >
                        Edit Profile
                      </button>
                    )}
                  </div>
                </div>

                <div className="p-4 sm:p-5 lg:p-6">
                  {isEditing ? (
                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 lg:space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
                        <div>
                          <label className="block text-xs xs:text-sm font-medium text-foreground mb-1.5 sm:mb-2">
                            Full Name
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={formData?.name || ""}
                            onChange={handleInputChange}
                            className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 border rounded-lg text-xs xs:text-sm sm:text-base bg-background text-foreground focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 ${
                              errors.name
                                ? "border-red-500"
                                : "border-border hover:border-red-300"
                            }`}
                          />
                          {errors.name && (
                            <p className="text-red-500 text-xs xs:text-sm mt-1">
                              {errors.name}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs xs:text-sm font-medium text-foreground mb-1.5 sm:mb-2">
                            Email Address
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData?.email || ""}
                            onChange={handleInputChange}
                            className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 border rounded-lg text-xs xs:text-sm sm:text-base bg-background text-foreground focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 ${
                              errors.email
                                ? "border-red-500"
                                : "border-border hover:border-red-300"
                            }`}
                          />
                          {errors.email && (
                            <p className="text-red-500 text-xs xs:text-sm mt-1">
                              {errors.email}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs xs:text-sm font-medium text-foreground mb-1.5 sm:mb-2">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData?.phone || ""}
                            onChange={handleInputChange}
                            className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 border rounded-lg text-xs xs:text-sm sm:text-base bg-background text-foreground focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 ${
                              errors.phone
                                ? "border-red-500"
                                : "border-border hover:border-red-300"
                            }`}
                          />
                          {errors.phone && (
                            <p className="text-red-500 text-xs xs:text-sm mt-1">
                              {errors.phone}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs xs:text-sm font-medium text-foreground mb-1.5 sm:mb-2">
                            Role
                          </label>
                          <input
                            type="text"
                            value={
                              profile.role.charAt(0).toUpperCase() +
                              profile.role.slice(1)
                            }
                            disabled
                            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-border rounded-lg bg-muted text-muted-foreground text-xs xs:text-sm sm:text-base"
                          />
                        </div>
                      </div>

                      {}
                      <div>
                        <h3 className="text-sm xs:text-base sm:text-lg font-medium text-foreground mb-3 sm:mb-4">
                          Address Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                          <div className="md:col-span-2">
                            <label className="block text-xs xs:text-sm font-medium text-foreground mb-1.5 sm:mb-2">
                              Street Address
                            </label>
                            <input
                              type="text"
                              name="address.street"
                              value={formData?.address.street || ""}
                              onChange={handleInputChange}
                              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-border rounded-lg bg-background text-foreground text-xs xs:text-sm sm:text-base focus:ring-2 focus:ring-red-500 focus:border-transparent hover:border-red-300 transition-all duration-300"
                            />
                          </div>

                          <div>
                            <label className="block text-xs xs:text-sm font-medium text-foreground mb-1.5 sm:mb-2">
                              City
                            </label>
                            <input
                              type="text"
                              name="address.city"
                              value={formData?.address.city || ""}
                              onChange={handleInputChange}
                              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-border rounded-lg bg-background text-foreground text-xs xs:text-sm sm:text-base focus:ring-2 focus:ring-red-500 focus:border-transparent hover:border-red-300 transition-all duration-300"
                            />
                          </div>

                          <div>
                            <label className="block text-xs xs:text-sm font-medium text-foreground mb-1.5 sm:mb-2">
                              State
                            </label>
                            <input
                              type="text"
                              name="address.state"
                              value={formData?.address.state || ""}
                              onChange={handleInputChange}
                              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-border rounded-lg bg-background text-foreground text-xs xs:text-sm sm:text-base focus:ring-2 focus:ring-red-500 focus:border-transparent hover:border-red-300 transition-all duration-300"
                            />
                          </div>

                          <div>
                            <label className="block text-xs xs:text-sm font-medium text-foreground mb-1.5 sm:mb-2">
                              ZIP Code
                            </label>
                            <input
                              type="text"
                              name="address.zipCode"
                              value={formData?.address.zipCode || ""}
                              onChange={handleInputChange}
                              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-border rounded-lg bg-background text-foreground text-xs xs:text-sm sm:text-base focus:ring-2 focus:ring-red-500 focus:border-transparent hover:border-red-300 transition-all duration-300"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col xs:flex-row gap-3 sm:gap-4">
                        <button
                          type="submit"
                          disabled={isUpdating}
                          className="w-full xs:w-auto bg-gradient-to-br from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 text-white px-4 xs:px-6 py-2.5 xs:py-3 rounded-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 transition-all duration-300 inline-flex items-center justify-center group border border-red-500/20 hover:border-red-400 text-xs xs:text-sm sm:text-base"
                        >
                          <Save className="mr-2 h-3 w-3 xs:h-4 xs:w-4 group-hover:scale-110 transition-transform duration-300" />
                          {isUpdating ? "Saving..." : "Save Changes"}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsEditing(false);
                            setFormData(profile);
                            setErrors({});
                          }}
                          className="w-full xs:w-auto bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 text-red-600 dark:text-red-400 px-4 xs:px-6 py-2.5 xs:py-3 rounded-lg hover:from-red-200 hover:to-red-300 dark:hover:from-red-800/40 dark:hover:to-red-700/40 hover:scale-105 transition-all duration-300 border border-red-200 dark:border-red-800 text-xs xs:text-sm sm:text-base"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-4 sm:space-y-5 lg:space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
                        <div className="hover:bg-muted/20 p-2 sm:p-3 rounded-lg transition-colors duration-300">
                          <div className="flex items-center space-x-2 sm:space-x-3">
                            <User className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="text-xs xs:text-sm text-muted-foreground">
                                Full Name
                              </p>
                              <p className="font-medium text-foreground text-xs xs:text-sm sm:text-base truncate">
                                {profile.name}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="hover:bg-muted/20 p-2 sm:p-3 rounded-lg transition-colors duration-300">
                          <div className="flex items-center space-x-2 sm:space-x-3">
                            <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="text-xs xs:text-sm text-muted-foreground">
                                Email
                              </p>
                              <p className="font-medium text-foreground text-xs xs:text-sm sm:text-base truncate">
                                {profile.email}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="hover:bg-muted/20 p-2 sm:p-3 rounded-lg transition-colors duration-300">
                          <div className="flex items-center space-x-2 sm:space-x-3">
                            <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="text-xs xs:text-sm text-muted-foreground">
                                Phone
                              </p>
                              <p className="font-medium text-foreground text-xs xs:text-sm sm:text-base">
                                {profile.phone}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="hover:bg-muted/20 p-2 sm:p-3 rounded-lg transition-colors duration-300">
                          <div className="flex items-center space-x-2 sm:space-x-3">
                            <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="text-xs xs:text-sm text-muted-foreground">
                                Member Since
                              </p>
                              <p className="font-medium text-foreground text-xs xs:text-sm sm:text-base">
                                {new Date(
                                  profile.createdAt
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {}
                      <div className="border-t border-border pt-4 sm:pt-5 lg:pt-6">
                        <h3 className="text-sm xs:text-base sm:text-lg font-medium text-foreground mb-3 sm:mb-4">
                          Address Information
                        </h3>
                        <div className="hover:bg-red-50/20 dark:hover:bg-red-950/10 p-3 sm:p-4 rounded-lg transition-colors duration-300 border border-transparent hover:border-red-200 dark:hover:border-red-800">
                          <div className="flex items-start space-x-2 sm:space-x-3">
                            <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 mt-1 flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="font-medium text-foreground text-xs xs:text-sm sm:text-base">
                                {profile.address.street ||
                                  "No street address provided"}
                              </p>
                              <p className="text-muted-foreground text-xs xs:text-sm">
                                {profile.address.city && profile.address.state
                                  ? `${profile.address.city}, ${profile.address.state}`
                                  : "No city/state provided"}{" "}
                                {profile.address.zipCode}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {}
            <div className="space-y-4 sm:space-y-5 lg:space-y-6">
              {}
              <div className="bg-gradient-to-br from-background via-red-50/10 to-purple-50/10 dark:from-background dark:via-red-950/5 dark:to-purple-950/5 rounded-xl shadow-sm border border-border hover:shadow-xl hover:border-red-200 dark:hover:border-red-800 transition-all duration-300 backdrop-blur-sm">
                <div className="p-3 xs:p-4 sm:p-5 lg:p-6 border-b border-border">
                  <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-3 xs:gap-0">
                    <h3 className="text-base xs:text-lg sm:text-xl font-semibold bg-gradient-to-r from-red-600 to-purple-600 bg-clip-text text-transparent">
                      Security
                    </h3>
                    {!isChangingPassword && (
                      <button
                        onClick={() => setIsChangingPassword(true)}
                        className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium transition-all duration-300 hover:scale-105 px-3 xs:px-4 py-1.5 xs:py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 border border-transparent hover:border-red-200 dark:hover:border-red-800 text-xs xs:text-sm"
                      >
                        Change Password
                      </button>
                    )}
                  </div>
                </div>

                <div className="p-3 xs:p-4 sm:p-5 lg:p-6">
                  {isChangingPassword ? (
                    <form onSubmit={handleChangePassword} className="space-y-4 sm:space-y-5 lg:space-y-6">
                      <div>
                        <label className="block text-xs xs:text-sm font-medium text-foreground mb-1.5 sm:mb-2">
                          Current Password
                        </label>
                        <div className="relative">
                          <input
                            type={showCurrentPassword ? "text" : "password"}
                            name="currentPassword"
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                            className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 border rounded-lg bg-background text-foreground text-xs xs:text-sm sm:text-base focus:ring-2 focus:ring-red-500 focus:border-transparent pr-10 transition-all duration-300 ${
                              errors.currentPassword
                                ? "border-red-500"
                                : "border-border hover:border-red-300"
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowCurrentPassword(!showCurrentPassword)
                            }
                            className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-red-400 transition-colors duration-300"
                          >
                            {showCurrentPassword ? (
                              <EyeOff className="h-3 w-3 xs:h-4 xs:w-4 text-red-500" />
                            ) : (
                              <Eye className="h-3 w-3 xs:h-4 xs:w-4 text-red-500" />
                            )}
                          </button>
                        </div>
                        {errors.currentPassword && (
                          <p className="text-red-500 text-[10px] xs:text-xs sm:text-sm mt-1">
                            {errors.currentPassword}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs xs:text-sm font-medium text-foreground mb-1.5 sm:mb-2">
                          New Password
                        </label>
                        <div className="relative">
                          <input
                            type={showNewPassword ? "text" : "password"}
                            name="newPassword"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 border rounded-lg bg-background text-foreground text-xs xs:text-sm sm:text-base focus:ring-2 focus:ring-red-500 focus:border-transparent pr-10 transition-all duration-300 ${
                              errors.newPassword
                                ? "border-red-500"
                                : "border-border hover:border-red-300"
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-red-400 transition-colors duration-300"
                          >
                            {showNewPassword ? (
                              <EyeOff className="h-3 w-3 xs:h-4 xs:w-4 text-red-500" />
                            ) : (
                              <Eye className="h-3 w-3 xs:h-4 xs:w-4 text-red-500" />
                            )}
                          </button>
                        </div>
                        {errors.newPassword && (
                          <p className="text-red-500 text-[10px] xs:text-xs sm:text-sm mt-1">
                            {errors.newPassword}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs xs:text-sm font-medium text-foreground mb-1.5 sm:mb-2">
                          Confirm New Password
                        </label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 border rounded-lg bg-background text-foreground text-xs xs:text-sm sm:text-base focus:ring-2 focus:ring-red-500 focus:border-transparent pr-10 transition-all duration-300 ${
                              errors.confirmPassword
                                ? "border-red-500"
                                : "border-border hover:border-red-300"
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-red-400 transition-colors duration-300"
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-3 w-3 xs:h-4 xs:w-4 text-red-500" />
                            ) : (
                              <Eye className="h-3 w-3 xs:h-4 xs:w-4 text-red-500" />
                            )}
                          </button>
                        </div>
                        {errors.confirmPassword && (
                          <p className="text-red-500 text-[10px] xs:text-xs sm:text-sm mt-1">
                            {errors.confirmPassword}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col xs:flex-row gap-3 sm:gap-4">
                        <button
                          type="submit"
                          disabled={isUpdating}
                          className="w-full xs:w-auto bg-gradient-to-br from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 text-white px-3 xs:px-4 sm:px-5 py-2 xs:py-2.5 rounded-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 transition-all duration-300 border border-red-500/20 hover:border-red-400 text-xs xs:text-sm sm:text-base"
                        >
                          {isUpdating ? "Updating..." : "Update Password"}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsChangingPassword(false);
                            setPasswordData({
                              currentPassword: "",
                              newPassword: "",
                              confirmPassword: "",
                            });
                            setErrors({});
                          }}
                          className="w-full xs:w-auto bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 text-red-600 dark:text-red-400 px-3 xs:px-4 sm:px-5 py-2 xs:py-2.5 rounded-lg hover:from-red-200 hover:to-red-300 dark:hover:from-red-800/40 dark:hover:to-red-700/40 hover:scale-105 transition-all duration-300 border border-red-200 dark:border-red-800 text-xs xs:text-sm sm:text-base"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div>
                      <p className="text-muted-foreground text-xs xs:text-sm">
                        Keep your account secure by using a strong password.
                        Last changed: {new Date().toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {}
              {user?.role === "sender" && (
                <div className="bg-gradient-to-br from-background via-red-50/10 to-purple-50/10 dark:from-background dark:via-red-950/5 dark:to-purple-950/5 rounded-xl shadow-sm border border-border hover:shadow-xl hover:border-red-200 dark:hover:border-red-800 transition-all duration-300 backdrop-blur-sm">
                  <div className="p-3 xs:p-4 sm:p-5 lg:p-6">
                    <h3 className="text-base xs:text-lg sm:text-xl font-semibold bg-gradient-to-r from-red-600 to-purple-600 bg-clip-text text-transparent mb-3 sm:mb-4">
                      Quick Stats
                    </h3>
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex justify-between items-center hover:bg-red-50/20 dark:hover:bg-red-950/10 p-2 sm:p-3 rounded-lg transition-colors duration-300 border border-transparent hover:border-red-200 dark:hover:border-red-800">
                        <span className="text-xs xs:text-sm text-muted-foreground">
                          Account Type
                        </span>
                        <span className="text-xs xs:text-sm font-medium text-red-600 dark:text-red-400">
                          {profile.role.charAt(0).toUpperCase() +
                            profile.role.slice(1)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center hover:bg-red-50/20 dark:hover:bg-red-950/10 p-2 sm:p-3 rounded-lg transition-colors duration-300 border border-transparent hover:border-red-200 dark:hover:border-red-800">
                        <span className="text-xs xs:text-sm text-muted-foreground">
                          Member Since
                        </span>
                        <span className="text-xs xs:text-sm font-medium text-red-600 dark:text-red-400">
                          {new Date(profile.createdAt).getFullYear()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <FooterSection />
    </ProtectedRoute>
  );
};

export default ProfilePage;

