"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import api from "@/lib/ApiConfiguration";
import { ArrowLeft, Calculator, Package } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

export default function CreateParcelPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    receiverInfo: {
      name: "",
      email: "",
      phone: "",
      address: {
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "Bangladesh",
      },
    },
    parcelDetails: {
      type: "package" as
        | "document"
        | "package"
        | "fragile"
        | "electronics"
        | "clothing"
        | "other",
      weight: "",
      dimensions: {
        length: "",
        width: "",
        height: "",
      },
      description: "",
      value: "",
    },
    deliveryInfo: {
      preferredDeliveryDate: "",
      deliveryInstructions: "",
      isUrgent: false,
    },
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === "checkbox";
    const actualValue = isCheckbox
      ? (e.target as HTMLInputElement).checked
      : value;

    if (name.includes(".")) {
      const [section, field, subfield] = name.split(".");

      if (section === "receiverInfo") {
        if (field === "address" && subfield) {
          setFormData((prev) => ({
            ...prev,
            receiverInfo: {
              ...prev.receiverInfo,
              address: {
                ...prev.receiverInfo.address,
                [subfield]: actualValue as string,
              },
            },
          }));
        } else {
          setFormData((prev) => ({
            ...prev,
            receiverInfo: {
              ...prev.receiverInfo,
              [field]: actualValue as string,
            },
          }));
        }
      } else if (section === "parcelDetails") {
        if (field === "dimensions" && subfield) {
          setFormData((prev) => ({
            ...prev,
            parcelDetails: {
              ...prev.parcelDetails,
              dimensions: {
                ...prev.parcelDetails.dimensions,
                [subfield]: actualValue as string,
              },
            },
          }));
        } else {
          setFormData((prev) => ({
            ...prev,
            parcelDetails: {
              ...prev.parcelDetails,
              [field]: actualValue as string,
            },
          }));
        }
      } else if (section === "deliveryInfo") {
        setFormData((prev) => ({
          ...prev,
          deliveryInfo: {
            ...prev.deliveryInfo,
            [field]: actualValue as string | boolean,
          },
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: actualValue,
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const calculateEstimatedFee = () => {
    const weight = parseFloat(formData.parcelDetails.weight) || 0;
    const baseFee = 50; // BDT
    const weightFee = weight * 20; // 20 BDT per kg
    const urgentFee = formData.deliveryInfo.isUrgent ? 100 : 0;
    return baseFee + weightFee + urgentFee;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Receiver Info Validation
    if (!formData.receiverInfo.name.trim())
      newErrors["receiverInfo.name"] = "Receiver name is required";
    if (!formData.receiverInfo.email.trim()) {
      newErrors["receiverInfo.email"] = "Receiver email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.receiverInfo.email)
    ) {
      newErrors["receiverInfo.email"] = "Please enter a valid email address";
    }
    if (!formData.receiverInfo.phone.trim())
      newErrors["receiverInfo.phone"] = "Receiver phone is required";
    if (!formData.receiverInfo.address.street.trim())
      newErrors["receiverInfo.address.street"] = "Street address is required";
    if (!formData.receiverInfo.address.city.trim())
      newErrors["receiverInfo.address.city"] = "City is required";
    if (!formData.receiverInfo.address.state.trim())
      newErrors["receiverInfo.address.state"] = "State is required";
    if (!formData.receiverInfo.address.zipCode.trim())
      newErrors["receiverInfo.address.zipCode"] = "ZIP code is required";

    // Parcel Details Validation
    if (
      !formData.parcelDetails.weight ||
      parseFloat(formData.parcelDetails.weight) <= 0
    ) {
      newErrors["parcelDetails.weight"] = "Valid weight is required";
    } else if (parseFloat(formData.parcelDetails.weight) > 50) {
      newErrors["parcelDetails.weight"] = "Weight cannot exceed 50kg";
    }
    if (
      !formData.parcelDetails.dimensions.length ||
      parseFloat(formData.parcelDetails.dimensions.length) <= 0
    ) {
      newErrors["parcelDetails.dimensions.length"] = "Valid length is required";
    }
    if (
      !formData.parcelDetails.dimensions.width ||
      parseFloat(formData.parcelDetails.dimensions.width) <= 0
    ) {
      newErrors["parcelDetails.dimensions.width"] = "Valid width is required";
    }
    if (
      !formData.parcelDetails.dimensions.height ||
      parseFloat(formData.parcelDetails.dimensions.height) <= 0
    ) {
      newErrors["parcelDetails.dimensions.height"] = "Valid height is required";
    }
    if (!formData.parcelDetails.description.trim())
      newErrors["parcelDetails.description"] = "Description is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      // Convert string values to numbers and format according to backend API
      const payload = {
        receiverName: formData.receiverInfo.name,
        receiverEmail: formData.receiverInfo.email,
        receiverPhone: formData.receiverInfo.phone,
        receiverAddress: {
          street: formData.receiverInfo.address.street,
          city: formData.receiverInfo.address.city,
          state: formData.receiverInfo.address.state,
          zipCode: formData.receiverInfo.address.zipCode,
          country: formData.receiverInfo.address.country || "Bangladesh",
        },
        parcelDetails: {
          type: formData.parcelDetails.type,
          weight: parseFloat(formData.parcelDetails.weight),
          dimensions: {
            length: parseFloat(formData.parcelDetails.dimensions.length),
            width: parseFloat(formData.parcelDetails.dimensions.width),
            height: parseFloat(formData.parcelDetails.dimensions.height),
          },
          description: formData.parcelDetails.description,
          value: parseFloat(formData.parcelDetails.value) || 0,
        },
        deliveryInfo: {
          preferredDeliveryDate: formData.deliveryInfo.preferredDeliveryDate
            ? new Date(
                formData.deliveryInfo.preferredDeliveryDate
              ).toISOString()
            : new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(), // 48 hours from now
          deliveryInstructions:
            formData.deliveryInfo.deliveryInstructions || "",
          isUrgent: formData.deliveryInfo.isUrgent || false,
        },
      };

      console.log("Sending payload to backend:", payload);

      const response = await api.post("/parcels", payload);
      const parcel = response.data.data;

      toast.success("Parcel created successfully!");
      navigate(`/track?id=${parcel.trackingId}`);
    } catch (error: unknown) {
      console.error("Full error object:", error);

      const apiError = error as {
        response?: {
          data?: {
            message?: string;
            details?: string;
            errors?: Array<{ field: string; message: string }>;
            data?: {
              errorSources?: Array<{ path: string; message: string }>;
              stack?: string;
            };
            statusCode?: number;
            success?: boolean;
          };
          status?: number;
        };
      };

      let errorMessage = "Failed to create parcel";

      if (apiError.response?.data) {
        console.log("Backend error response:", apiError.response.data);
        console.log(
          "Backend error data details:",
          JSON.stringify(apiError.response.data, null, 2)
        );

        if (apiError.response.data.message) {
          errorMessage = apiError.response.data.message;
        } else if (apiError.response.data.errors) {
          errorMessage = apiError.response.data.errors
            .map((err) => `${err.field}: ${err.message}`)
            .join(", ");
        } else if (apiError.response.data.details) {
          errorMessage = apiError.response.data.details;
        } else if (apiError.response.data.data?.errorSources) {
          // Handle backend validation errors
          const validationErrors = apiError.response.data.data.errorSources;
          errorMessage = validationErrors
            .map(
              (err: { path: string; message: string }) =>
                `${err.path}: ${err.message}`
            )
            .join(", ");
        } else if (apiError.response.data.data) {
          console.log("Validation errors:", apiError.response.data.data);
          errorMessage = "Validation failed. Check console for details.";
        }
      }

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const estimatedFee = calculateEstimatedFee();

  return (
    <ProtectedRoute allowedRoles={["sender"]}>
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <Link
                to="/sender"
                className="flex items-center text-muted-foreground hover:text-foreground mr-4 transition-colors duration-200"
              >
                <ArrowLeft className="h-5 w-5 mr-1" />
                Back to Dashboard
              </Link>
            </div>
            <h1 className="text-3xl font-bold text-foreground">
              Create New Parcel
            </h1>
            <p className="mt-2 text-muted-foreground">
              Fill in the details to create a new parcel delivery request.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Receiver Information */}
            <div className="bg-background rounded-lg shadow-sm border border-border p-6">
              <h2 className="text-xl font-semibold text-foreground mb-6">
                Receiver Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="receiverInfo.name"
                    value={formData.receiverInfo.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="Enter receiver's full name"
                  />
                  {errors["receiverInfo.name"] && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors["receiverInfo.name"]}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="receiverInfo.email"
                    value={formData.receiverInfo.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="receiver@example.com"
                  />
                  {errors["receiverInfo.email"] && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors["receiverInfo.email"]}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="receiverInfo.phone"
                    value={formData.receiverInfo.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="+880123456789"
                  />
                  {errors["receiverInfo.phone"] && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors["receiverInfo.phone"]}
                    </p>
                  )}
                </div>
              </div>

              {/* Address */}
              <div className="mt-6">
                <h3 className="text-lg font-medium text-foreground mb-4">
                  Delivery Address
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      name="receiverInfo.address.street"
                      value={formData.receiverInfo.address.street}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      placeholder="123 Main Street"
                    />
                    {errors["receiverInfo.address.street"] && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors["receiverInfo.address.street"]}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        name="receiverInfo.address.city"
                        value={formData.receiverInfo.address.city}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        placeholder="Dhaka"
                      />
                      {errors["receiverInfo.address.city"] && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors["receiverInfo.address.city"]}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">
                        State/Division *
                      </label>
                      <input
                        type="text"
                        name="receiverInfo.address.state"
                        value={formData.receiverInfo.address.state}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        placeholder="Dhaka Division"
                      />
                      {errors["receiverInfo.address.state"] && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors["receiverInfo.address.state"]}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">
                        ZIP Code *
                      </label>
                      <input
                        type="text"
                        name="receiverInfo.address.zipCode"
                        value={formData.receiverInfo.address.zipCode}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        placeholder="1000"
                      />
                      {errors["receiverInfo.address.zipCode"] && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors["receiverInfo.address.zipCode"]}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Parcel Details */}
            <div className="bg-background rounded-lg shadow-sm border border-border p-6">
              <h2 className="text-xl font-semibold text-foreground mb-6">
                Parcel Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Parcel Type *
                  </label>
                  <select
                    name="parcelDetails.type"
                    value={formData.parcelDetails.type}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  >
                    <option value="document">Document</option>
                    <option value="package">Package</option>
                    <option value="fragile">Fragile Item</option>
                    <option value="electronics">Electronics</option>
                    <option value="clothing">Clothing</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Weight (kg) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="50"
                    name="parcelDetails.weight"
                    value={formData.parcelDetails.weight}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="Enter weight (max 50kg)"
                  />
                  {errors["parcelDetails.weight"] && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors["parcelDetails.weight"]}
                    </p>
                  )}
                </div>
              </div>

              {/* Dimensions */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Dimensions (cm) *
                </label>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      name="parcelDetails.dimensions.length"
                      value={formData.parcelDetails.dimensions.length}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      placeholder="Length"
                    />
                    {errors["parcelDetails.dimensions.length"] && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors["parcelDetails.dimensions.length"]}
                      </p>
                    )}
                  </div>
                  <div>
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      name="parcelDetails.dimensions.width"
                      value={formData.parcelDetails.dimensions.width}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      placeholder="Width"
                    />
                    {errors["parcelDetails.dimensions.width"] && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors["parcelDetails.dimensions.width"]}
                      </p>
                    )}
                  </div>
                  <div>
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      name="parcelDetails.dimensions.height"
                      value={formData.parcelDetails.dimensions.height}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      placeholder="Height"
                    />
                    {errors["parcelDetails.dimensions.height"] && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors["parcelDetails.dimensions.height"]}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Estimated Value (BDT)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    name="parcelDetails.value"
                    value={formData.parcelDetails.value}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Description *
                </label>
                <textarea
                  name="parcelDetails.description"
                  value={formData.parcelDetails.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="Describe the contents of your parcel..."
                />
                {errors["parcelDetails.description"] && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors["parcelDetails.description"]}
                  </p>
                )}
              </div>
            </div>

            {/* Delivery Options */}
            <div className="bg-background rounded-lg shadow-sm border border-border p-6">
              <h2 className="text-xl font-semibold text-foreground mb-6">
                Delivery Options
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Preferred Delivery Date
                  </label>
                  <input
                    type="date"
                    name="deliveryInfo.preferredDeliveryDate"
                    value={formData.deliveryInfo.preferredDeliveryDate}
                    onChange={handleInputChange}
                    min={
                      new Date(Date.now() + 24 * 60 * 60 * 1000)
                        .toISOString()
                        .split("T")[0]
                    }
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isUrgent"
                    name="deliveryInfo.isUrgent"
                    checked={formData.deliveryInfo.isUrgent}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-border rounded"
                  />
                  <label
                    htmlFor="isUrgent"
                    className="ml-2 block text-sm text-foreground"
                  >
                    Urgent Delivery (+100 BDT)
                  </label>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Delivery Instructions
                </label>
                <textarea
                  name="deliveryInfo.deliveryInstructions"
                  value={formData.deliveryInfo.deliveryInstructions}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="Any special instructions for delivery..."
                />
              </div>
            </div>

            {/* Fee Estimation */}
            <div className="bg-gradient-to-r from-blue-50/50 via-transparent to-blue-50/50 dark:from-blue-950/20 dark:to-blue-950/20 border border-border rounded-lg p-6">
              <div className="flex items-center">
                <Calculator className="h-6 w-6 text-red-600 mr-3" />
                <h3 className="text-lg font-semibold text-foreground">
                  Estimated Delivery Fee
                </h3>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Base Fee:</span>
                  <span className="text-foreground">50 BDT</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Weight Fee ({formData.parcelDetails.weight || 0} kg × 20
                    BDT):
                  </span>
                  <span className="text-foreground">
                    {(parseFloat(formData.parcelDetails.weight) || 0) * 20} BDT
                  </span>
                </div>
                {formData.deliveryInfo.isUrgent && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Urgent Fee:</span>
                    <span className="text-foreground">100 BDT</span>
                  </div>
                )}
                <div className="border-t border-border pt-2">
                  <div className="flex justify-between font-semibold text-foreground">
                    <span>Total:</span>
                    <span>{estimatedFee} BDT</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <Link
                to="/sender"
                className="px-6 py-3 border border-border rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground font-medium transition-all duration-300"
              >
                Cancel
              </Link>

              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-br from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 hover:shadow-lg text-white rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                disabled={loading}
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Package className="mr-2 h-4 w-4" />
                )}
                Create Parcel
              </button>
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}
