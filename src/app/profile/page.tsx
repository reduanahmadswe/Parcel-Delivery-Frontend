"use client";

import api from "@/lib/ApiConfiguration";
import { Eye, EyeOff, Mail, MapPin, Phone, Save, User } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

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

export default function ProfilePage() {
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

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData?.name?.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData?.phone?.trim()) {
      newErrors.phone = "Phone is required";
    }

    if (!formData?.address?.street?.trim()) {
      newErrors["address.street"] = "Street address is required";
    }

    if (!formData?.address?.city?.trim()) {
      newErrors["address.city"] = "City is required";
    }

    if (!formData?.address?.state?.trim()) {
      newErrors["address.state"] = "State is required";
    }

    if (!formData?.address?.zipCode?.trim()) {
      newErrors["address.zipCode"] = "ZIP code is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
    }

    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your new password";
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsUpdating(true);
      const response = await api.patch("/users/profile", formData);
      setProfile(response.data.data);
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (error: unknown) {
      console.error("Error updating profile:", error);
      const apiError = error as { response?: { data?: { message?: string } } };
      toast.error(
        apiError.response?.data?.message || "Failed to update profile"
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePasswordForm()) return;

    try {
      setIsUpdating(true);
      await api.patch("/users/change-password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setIsChangingPassword(false);
      toast.success("Password changed successfully");
    } catch (error: unknown) {
      console.error("Error changing password:", error);
      const apiError = error as { response?: { data?: { message?: string } } };
      toast.error(
        apiError.response?.data?.message || "Failed to change password"
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const cancelEdit = () => {
    setFormData(profile);
    setIsEditing(false);
    setErrors({});
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Profile Not Found
          </h2>
          <p className="text-muted-foreground">
            Unable to load your profile information.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Profile Settings
          </h1>
          <p className="mt-2 text-muted-foreground">
            Manage your account information and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Overview */}
          <div className="lg:col-span-1">
            <div className="bg-background rounded-lg shadow border border-border p-6 hover:shadow-lg transition-all duration-300">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-red-500/10 to-green-500/10 border border-red-200 dark:border-red-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-10 w-10 text-green-500" />
                </div>
                <h2 className="text-xl font-bold text-foreground">
                  {profile.name}
                </h2>
                <p className="text-muted-foreground">{profile.email}</p>
                <span className="inline-block mt-2 px-3 py-1 bg-gradient-to-r from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 text-white text-sm font-medium rounded-full capitalize">
                  {profile.role}
                </span>
                <p className="text-sm text-muted-foreground mt-4">
                  Member since{" "}
                  {new Date(profile.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-background rounded-lg shadow border border-border hover:shadow-lg transition-all duration-300">
              <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">
                  Personal Information
                </h3>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-green-500 hover:text-green-600 text-sm font-medium transition-colors duration-300"
                  >
                    Edit
                  </button>
                )}
              </div>

              <div className="p-6">
                {isEditing ? (
                  <form onSubmit={handleUpdateProfile} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData?.name || ""}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 ${
                            errors.name ? "border-red-500" : "border-border"
                          }`}
                        />
                        {errors.name && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.name}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-2">
                          Phone Number
                        </label>
                        <input
                          type="text"
                          name="phone"
                          value={formData?.phone || ""}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 ${
                            errors.phone ? "border-red-500" : "border-border"
                          }`}
                        />
                        {errors.phone && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.phone}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">
                        Street Address
                      </label>
                      <input
                        type="text"
                        name="address.street"
                        value={formData?.address?.street || ""}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 ${
                          errors["address.street"]
                            ? "border-red-500"
                            : "border-border"
                        }`}
                      />
                      {errors["address.street"] && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors["address.street"]}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City
                        </label>
                        <input
                          type="text"
                          name="address.city"
                          value={formData?.address?.city || ""}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors["address.city"]
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        />
                        {errors["address.city"] && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors["address.city"]}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          State
                        </label>
                        <input
                          type="text"
                          name="address.state"
                          value={formData?.address?.state || ""}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors["address.state"]
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        />
                        {errors["address.state"] && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors["address.state"]}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          ZIP Code
                        </label>
                        <input
                          type="text"
                          name="address.zipCode"
                          value={formData?.address?.zipCode || ""}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors["address.zipCode"]
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        />
                        {errors["address.zipCode"] && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors["address.zipCode"]}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex space-x-4">
                      <button
                        type="submit"
                        disabled={isUpdating}
                        className="bg-gradient-to-br from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 text-white px-4 py-2 rounded-lg hover:shadow-lg disabled:opacity-50 flex items-center transition-all duration-300"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        {isUpdating ? "Saving..." : "Save Changes"}
                      </button>
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="bg-muted text-muted-foreground px-4 py-2 rounded-lg hover:bg-gradient-to-r hover:from-red-50/10 hover:to-green-50/10 dark:hover:from-red-950/5 dark:hover:to-green-950/5 transition-all duration-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <User className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-600">Full Name</p>
                        <p className="font-medium">{profile.name}</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <Mail className="h-5 w-5 text-green-500 mr-3" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Email Address
                        </p>
                        <p className="font-medium text-foreground">
                          {profile.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <Phone className="h-5 w-5 text-green-500 mr-3" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Phone Number
                        </p>
                        <p className="font-medium text-foreground">
                          {profile.phone}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-green-500 mr-3 mt-1" />
                      <div>
                        <p className="text-sm text-muted-foreground">Address</p>
                        <p className="font-medium text-foreground">
                          {profile.address.street}
                          <br />
                          {profile.address.city}, {profile.address.state}{" "}
                          {profile.address.zipCode}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Change Password */}
            <div className="bg-background rounded-lg shadow border border-border hover:shadow-lg transition-all duration-300">
              <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">
                  Security
                </h3>
                {!isChangingPassword && (
                  <button
                    onClick={() => setIsChangingPassword(true)}
                    className="text-green-500 hover:text-green-600 text-sm font-medium transition-colors duration-300"
                  >
                    Change Password
                  </button>
                )}
              </div>

              <div className="p-6">
                {isChangingPassword ? (
                  <form onSubmit={handleChangePassword} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? "text" : "password"}
                          name="currentPassword"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          className={`w-full px-3 py-2 border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-green-500 focus:border-transparent pr-10 transition-all duration-300 ${
                            errors.currentPassword
                              ? "border-red-500"
                              : "border-border hover:border-green-300"
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowCurrentPassword(!showCurrentPassword)
                          }
                          className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-green-400 transition-colors duration-300"
                        >
                          {showCurrentPassword ? (
                            <EyeOff className="h-4 w-4 text-green-500" />
                          ) : (
                            <Eye className="h-4 w-4 text-green-500" />
                          )}
                        </button>
                      </div>
                      {errors.currentPassword && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.currentPassword}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          name="newPassword"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          className={`w-full px-3 py-2 border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-green-500 focus:border-transparent pr-10 transition-all duration-300 ${
                            errors.newPassword
                              ? "border-red-500"
                              : "border-border hover:border-green-300"
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-green-400 transition-colors duration-300"
                        >
                          {showNewPassword ? (
                            <EyeOff className="h-4 w-4 text-green-500" />
                          ) : (
                            <Eye className="h-4 w-4 text-green-500" />
                          )}
                        </button>
                      </div>
                      {errors.newPassword && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.newPassword}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          className={`w-full px-3 py-2 border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-green-500 focus:border-transparent pr-10 transition-all duration-300 ${
                            errors.confirmPassword
                              ? "border-red-500"
                              : "border-border hover:border-green-300"
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-green-400 transition-colors duration-300"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4 text-green-500" />
                          ) : (
                            <Eye className="h-4 w-4 text-green-500" />
                          )}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.confirmPassword}
                        </p>
                      )}
                    </div>

                    <div className="flex space-x-4">
                      <button
                        type="submit"
                        disabled={isUpdating}
                        className="bg-gradient-to-br from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 text-white px-4 py-2 rounded-lg hover:shadow-lg disabled:opacity-50 transition-all duration-300"
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
                        className="bg-muted text-muted-foreground px-4 py-2 rounded-lg hover:bg-gradient-to-r hover:from-red-50/10 hover:to-green-50/10 dark:hover:from-red-950/5 dark:hover:to-green-950/5 transition-all duration-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div>
                    <p className="text-muted-foreground">
                      Keep your account secure by using a strong password. Last
                      changed: {new Date().toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
