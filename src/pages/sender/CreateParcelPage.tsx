import ProtectedRoute from "@/components/common/ProtectedRoute";
import api from "../../services/ApiConfiguration";
import { useCreateParcelMutation } from "../../features/parcels/parcelsApi";
import { ArrowLeft, Calculator, Package } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import ParcelCreatedModal from "@/components/modals/ParcelCreatedModal";
import {
  getCitiesList,
  getDivisionsByCity,
  getPostalCodesByDivision,
} from "../../constants/bangladeshData";
import FooterSection from "../public/sections/FooterSection";
import { invalidateAllSenderCaches } from "../../utils/realtimeSync";

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
  const [createdParcel, setCreatedParcel] = useState<any | null>(null);

  const [createParcel, { isLoading: isCreating }] = useCreateParcelMutation();

  const [availableCities] = useState(getCitiesList());
  const [availableDivisions, setAvailableDivisions] = useState<string[]>([]);
  const [availablePostalCodes, setAvailablePostalCodes] = useState<
    Array<{ code: string; area: string }>
  >([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("");

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

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleCityChange = (cityName: string) => {
    setSelectedCity(cityName);
    setSelectedDivision("");
    const divisions = getDivisionsByCity(cityName);
    setAvailableDivisions(divisions);
    setAvailablePostalCodes([]);

    setFormData((prev) => ({
      ...prev,
      receiverInfo: {
        ...prev.receiverInfo,
        address: {
          ...prev.receiverInfo.address,
          city: cityName,
          state: "",
          zipCode: "",
        },
      },
    }));
  };

  const handleDivisionChange = (divisionName: string) => {
    setSelectedDivision(divisionName);
    const postalCodes = getPostalCodesByDivision(selectedCity, divisionName);
    setAvailablePostalCodes(postalCodes);

    setFormData((prev) => ({
      ...prev,
      receiverInfo: {
        ...prev.receiverInfo,
        address: {
          ...prev.receiverInfo.address,
          state: divisionName,
          zipCode: "",
        },
      },
    }));
  };

  const handlePostalCodeChange = (postalCode: string) => {
    setFormData((prev) => ({
      ...prev,
      receiverInfo: {
        ...prev.receiverInfo,
        address: {
          ...prev.receiverInfo.address,
          zipCode: postalCode,
        },
      },
    }));
  };

  const calculateEstimatedFee = () => {
    const weight = parseFloat(formData.parcelDetails.weight) || 0;
    const baseFee = 50; 
    const weightFee = weight * 20; 
    const urgentFee = formData.deliveryInfo.isUrgent ? 100 : 0;
    return baseFee + weightFee + urgentFee;
  };

  const validateEmail = async (email: string) => {
    if (!email.trim()) {
      return false;
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    if (!emailRegex.test(email)) {
      toast.error("⚠️ Enter correct email address", {
        duration: 4000,
        position: "top-center",
        style: {
          background: '#FEE2E2',
          color: '#991B1B',
          fontWeight: 'bold',
        },
      });
      setErrors(prev => ({
        ...prev,
        "receiverInfo.email": "Enter your correct email address"
      }));
      return false;
    }

    try {
      const response = await api.get(`/auth/check-email?email=${encodeURIComponent(email)}`);

      const emailExists = response.data?.data?.exists ?? response.data?.exists ?? false;

      if (!emailExists) {
        toast.error("⚠️ Email not exist in database. Receiver must register first!", {
          duration: 5000,
          position: "top-center",
          style: {
            background: '#FEE2E2',
            color: '#991B1B',
            fontWeight: 'bold',
          },
        });
        setErrors(prev => ({
          ...prev,
          "receiverInfo.email": "Email not exist - Receiver must register first"
        }));
        return false;
      } else {
        
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors["receiverInfo.email"];
          return newErrors;
        });
        return true;
      }
    } catch (error) {
      
      console.error('Email verification error:', error);
      
      toast.error("⚠️ Unable to verify email - Please try again", {
        duration: 4000,
        position: "top-center",
        style: {
          background: '#FEE2E2',
          color: '#991B1B',
          fontWeight: 'bold',
        },
      });
      setErrors(prev => ({
        ...prev,
        "receiverInfo.email": "Unable to verify email"
      }));
      return false;
    }
  };

  const validatePhone = (phone: string) => {
    if (!phone.trim()) {
      return;
    }

    const cleanPhone = phone.replace(/[\s\-]/g, ''); 
    
    // Accept both formats: 01XXXXXXXXX or +8801XXXXXXXXX
    const localFormat = /^01[3-9]\d{8}$/; 
    const internationalFormat = /^\+8801[3-9]\d{8}$/; 
    
    if (!localFormat.test(cleanPhone) && !internationalFormat.test(cleanPhone)) {
      toast.error("⚠️ Please enter a correct phone number format (e.g., 01712345678 or +8801712345678)", {
        duration: 4000,
        position: "top-center",
      });
      setErrors(prev => ({
        ...prev,
        "receiverInfo.phone": "Please enter a valid Bangladesh phone number (01XXXXXXXXX or +8801XXXXXXXXX)"
      }));
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors["receiverInfo.phone"];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.receiverInfo.name.trim())
      newErrors["receiverInfo.name"] = "Receiver name is required";
    if (!formData.receiverInfo.email.trim()) {
      newErrors["receiverInfo.email"] = "Receiver email is required";
    } else if (
      !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.receiverInfo.email)
    ) {
      newErrors["receiverInfo.email"] = "Enter your correct email address";
    }
    
    if (!formData.receiverInfo.phone.trim()) {
      newErrors["receiverInfo.phone"] = "Receiver phone is required";
    } else {
      const cleanPhone = formData.receiverInfo.phone.replace(/[\s\-]/g, '');
      const localFormat = /^01[3-9]\d{8}$/; 
      const internationalFormat = /^\+8801[3-9]\d{8}$/; 
      
      if (!localFormat.test(cleanPhone) && !internationalFormat.test(cleanPhone)) {
        newErrors["receiverInfo.phone"] = "Please enter a valid Bangladesh phone number (01XXXXXXXXX or +8801XXXXXXXXX)";
      }
    }
    if (!formData.receiverInfo.address.street.trim())
      newErrors["receiverInfo.address.street"] = "Street address is required";
    if (!formData.receiverInfo.address.city.trim())
      newErrors["receiverInfo.address.city"] = "City is required";
    if (!formData.receiverInfo.address.state.trim())
      newErrors["receiverInfo.address.state"] = "State is required";
    if (!formData.receiverInfo.address.zipCode.trim())
      newErrors["receiverInfo.address.zipCode"] = "ZIP code is required";

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

    const emailValid = await validateEmail(formData.receiverInfo.email);
    if (!emailValid) {
      return; 
    }

    setLoading(true);

    try {
      
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
            : new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(), 
          deliveryInstructions:
            formData.deliveryInfo.deliveryInstructions || "",
          isUrgent: formData.deliveryInfo.isUrgent || false,
        },
      } as any;

  const response = await createParcel(payload).unwrap();
      console.log('🔍 API Response:', response);
      const parcel = response.data;
      console.log('📦 Parcel Data:', parcel);

      toast.success("📦 Parcel created successfully!");

      setCreatedParcel(parcel);
      console.log('✅ Created Parcel State Set:', parcel);

      invalidateAllSenderCaches();
    } catch (error: unknown) {
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

      console.error("❌ API Error Response:", apiError.response?.data);
      console.error("❌ Full Error:", error);

      let errorMessage = "Failed to create parcel";

      if (apiError.response?.data) {
        if (apiError.response.data.message) {
          errorMessage = apiError.response.data.message;
        } else if (apiError.response.data.errors) {
          errorMessage = apiError.response.data.errors
            .map((err) => `${err.field}: ${err.message}`)
            .join(", ");
        } else if (apiError.response.data.details) {
          errorMessage = apiError.response.data.details;
        } else if (apiError.response.data.data?.errorSources) {
          
          const validationErrors = apiError.response.data.data.errorSources;
          errorMessage = validationErrors
            .map(
              (err: { path: string; message: string }) =>
                `${err.path}: ${err.message}`
            )
            .join(", ");
        } else if (apiError.response.data.data) {
          errorMessage = "Validation failed.";
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
      <div className="min-h-screen bg-background mt-10">
        <div className="max-w-7xl mx-auto pt-2 px-3 sm:px-4 lg:px-6 space-y-4 sm:space-y-6 pb-16 sm:pb-24">
          {}
          <div className="relative overflow-hidden bg-gradient-to-br from-blue-600/10 via-purple-600/5 to-green-600/10 dark:from-blue-900/20 dark:via-purple-900/10 dark:to-green-900/20 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-border/50 shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 dark:from-blue-400/10 dark:to-purple-400/10"></div>
            <div className="relative">
              <div className="flex items-center mb-4 sm:mb-6">
                <Link
                  to="/sender"
                  className="group flex items-center text-muted-foreground hover:text-foreground mr-4 sm:mr-6 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl hover:bg-background/50 transition-all duration-200 border border-transparent hover:border-border/50 text-xs sm:text-sm"
                >
                  <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2 group-hover:-translate-x-1 transition-transform" />
                  <span className="hidden xs:inline">Back to Dashboard</span>
                  <span className="xs:hidden">Back</span>
                </Link>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-red-600 to-red-600 dark:from-red-700 dark:to-red-700 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                    <Package className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl xs:text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground flex items-center">
                      Create New Parcel
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 dark:bg-green-400 rounded-full ml-2 sm:ml-3 animate-pulse shadow-lg"></div>
                    </h1>
                    <p className="mt-1 sm:mt-2 text-muted-foreground text-xs sm:text-sm lg:text-base">
                      Fill in the details to create a new parcel delivery
                      request
                    </p>
                  </div>
                </div>

                <div className="w-full sm:w-auto flex items-center space-x-2 bg-background/70 backdrop-blur-sm px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl border border-border shadow-md">
                  <Calculator className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
                  <span className="font-semibold text-foreground text-sm sm:text-base">
                    Estimated Fee:
                  </span>
                  <span className="font-bold text-blue-600 dark:text-blue-400 text-sm sm:text-base">
                    ৳{estimatedFee}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 lg:space-y-8">
            {}
            <div className="relative overflow-hidden bg-card/60 backdrop-blur-sm border border-border/50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-teal-500/5 dark:from-green-400/10 dark:to-teal-400/10"></div>
              <div className="relative">
                <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6 lg:mb-8">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-green-500 to-teal-500 dark:from-green-600 dark:to-teal-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                    <Package className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">
                      Receiver Information
                    </h2>
                    <p className="text-muted-foreground text-xs sm:text-sm">
                      Details of the person receiving the parcel
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <label className="block text-xs sm:text-sm font-semibold text-muted-foreground">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="receiverInfo.name"
                      value={formData.receiverInfo.name}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-border rounded-lg sm:rounded-xl bg-background/50 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 hover:bg-background/70 text-sm sm:text-base"
                      placeholder="Enter receiver's full name"
                    />
                    {errors["receiverInfo.name"] && (
                      <p className="mt-1 text-xs sm:text-sm text-red-600 flex items-center">
                        <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                        {errors["receiverInfo.name"]}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs sm:text-sm font-semibold text-muted-foreground">
                      Email Address *
                    </label>
                    
                    {}
                    <div className="mb-3 p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                      <p className="text-xs text-blue-700 dark:text-blue-300 flex items-start gap-2">
                        <span className="text-sm">ℹ️</span>
                        <span>
                          <strong>Important:</strong> The receiver must be registered in the system. 
                          If email doesn't exist, ask the receiver to create an account first.
                        </span>
                      </p>
                    </div>
                    
                    <input
                      type="email"
                      name="receiverInfo.email"
                      value={formData.receiverInfo.email}
                      onChange={handleInputChange}
                      onBlur={(e) => validateEmail(e.target.value)}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-border rounded-lg sm:rounded-xl bg-background/50 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 hover:bg-background/70 text-sm sm:text-base"
                      placeholder="receiver@example.com"
                    />
                    {errors["receiverInfo.email"] && (
                      <p className="mt-1 text-xs sm:text-sm text-red-600 flex items-center">
                        <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                        {errors["receiverInfo.email"]}
                      </p>
                    )}
                  </div>
                </div>

                {}
                <div className="mt-4 sm:mt-6 lg:mt-8 pt-4 sm:pt-6 lg:pt-8 border-t border-border/50">
                  <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-teal-500 dark:from-blue-600 dark:to-teal-600 rounded-md sm:rounded-lg flex items-center justify-center">
                      <Package className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                    </div>
                    <h3 className="text-base sm:text-lg lg:text-xl font-bold text-foreground">
                      Delivery Address
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                    <div className="space-y-2">
                      <label className="block text-xs sm:text-sm font-semibold text-muted-foreground">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="receiverInfo.phone"
                        value={formData.receiverInfo.phone}
                        onChange={handleInputChange}
                        onBlur={(e) => validatePhone(e.target.value)}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-border rounded-lg sm:rounded-xl bg-background/50 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 hover:bg-background/70 text-sm sm:text-base"
                        placeholder="01712345678"
                      />
                      {errors["receiverInfo.phone"] && (
                        <p className="mt-1 text-xs sm:text-sm text-red-600 flex items-center">
                          <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                          {errors["receiverInfo.phone"]}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs sm:text-sm font-semibold text-muted-foreground">
                        Street Address *
                      </label>
                      <input
                        type="text"
                        name="receiverInfo.address.street"
                        value={formData.receiverInfo.address.street}
                        onChange={handleInputChange}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-border rounded-lg sm:rounded-xl bg-background/50 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:bg-background/70 text-sm sm:text-base"
                        placeholder="123 Main Street, House No, Road No"
                      />
                      {errors["receiverInfo.address.street"] && (
                        <p className="mt-1 text-xs sm:text-sm text-red-600 flex items-center">
                          <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                          {errors["receiverInfo.address.street"]}
                        </p>
                      )}
                    </div>
                  </div>

                    {}
                    <div className="bg-gradient-to-r from-blue-50/50 to-cyan-50/50 dark:from-blue-950/20 dark:to-cyan-950/20 border border-blue-200/50 dark:border-blue-800/50 rounded-xl sm:rounded-2xl p-3 sm:p-4 mb-4 sm:mb-6">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">
                            💡
                          </span>
                        </div>
                        <span className="font-semibold text-blue-700 dark:text-blue-300 text-xs sm:text-sm">
                          Location Selection Guide
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-blue-700 dark:text-blue-300 leading-relaxed">
                        Select location step by step: First choose your city,
                        then select the division, and finally pick the postal
                        code area for accurate delivery.
                      </p>
                    </div>
                    {}

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-muted-foreground mb-2">
                        City *
                      </label>
                      <select
                        value={selectedCity}
                        onChange={(e) => handleCityChange(e.target.value)}
                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-border rounded-lg sm:rounded-xl bg-background/80 backdrop-blur-sm text-foreground focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 hover:border-blue-400/50 transition-all duration-300 shadow-sm hover:shadow-md font-medium text-xs sm:text-sm appearance-none cursor-pointer"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: 'right 0.75rem center',
                          backgroundSize: '1.25rem',
                          paddingRight: '2.5rem'
                        }}
                      >
                        <option value="">Select a city</option>
                        {availableCities.map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                      </select>
                      {errors["receiverInfo.address.city"] && (
                        <p className="mt-1 text-xs sm:text-sm text-red-600">
                          {errors["receiverInfo.address.city"]}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-muted-foreground mb-2">
                        State/Division *
                      </label>
                      <select
                        value={selectedDivision}
                        onChange={(e) => handleDivisionChange(e.target.value)}
                        disabled={!selectedCity}
                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-border rounded-lg sm:rounded-xl bg-background/80 backdrop-blur-sm text-foreground focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 hover:border-blue-400/50 transition-all duration-300 shadow-sm hover:shadow-md font-medium text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed appearance-none cursor-pointer"
                        style={{
                          backgroundImage: !selectedCity ? 'none' : `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: 'right 0.75rem center',
                          backgroundSize: '1.25rem',
                          paddingRight: '2.5rem'
                        }}
                      >
                        <option value="">
                          {!selectedCity
                            ? "Select a city first"
                            : `Select a division (${availableDivisions.length} available)`}
                        </option>
                        {availableDivisions.map((division) => (
                          <option key={division} value={division}>
                            {division}
                          </option>
                        ))}
                      </select>
                      {errors["receiverInfo.address.state"] && (
                        <p className="mt-1 text-xs sm:text-sm text-red-600">
                          {errors["receiverInfo.address.state"]}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-muted-foreground mb-2">
                        ZIP Code *
                      </label>
                      <select
                        value={formData.receiverInfo.address.zipCode}
                        onChange={(e) => handlePostalCodeChange(e.target.value)}
                        disabled={!selectedDivision}
                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-border rounded-lg sm:rounded-xl bg-background/80 backdrop-blur-sm text-foreground focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 hover:border-blue-400/50 transition-all duration-300 shadow-sm hover:shadow-md font-medium text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed appearance-none cursor-pointer"
                        style={{
                          backgroundImage: !selectedDivision ? 'none' : `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: 'right 0.75rem center',
                          backgroundSize: '1.25rem',
                          paddingRight: '2.5rem'
                        }}
                      >
                        <option value="">
                          {!selectedDivision
                            ? "Select a division first"
                            : `Select a postal code (${availablePostalCodes.length} available)`}
                        </option>
                        {availablePostalCodes.map((postal) => (
                          <option key={postal.code} value={postal.code}>
                            {postal.code} - {postal.area}
                          </option>
                        ))}
                      </select>
                      {errors["receiverInfo.address.zipCode"] && (
                        <p className="mt-1 text-xs sm:text-sm text-red-600">
                          {errors["receiverInfo.address.zipCode"]}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {}
            <div className="bg-gradient-to-br from-blue-50/50 via-background to-purple-50/50 dark:from-blue-950/20 dark:via-background dark:to-purple-950/20 backdrop-blur-sm border border-border/50 rounded-xl sm:rounded-2xl shadow-xl shadow-blue-500/5 dark:shadow-blue-400/10 p-4 sm:p-6 lg:p-8 hover:shadow-2xl hover:shadow-blue-500/10 dark:hover:shadow-blue-400/20 transition-all duration-500">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 lg:mb-8">
                <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-lg sm:rounded-xl shadow-lg">
                  <Package className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                    Parcel Details
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Specify your parcel type and weight
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                <div className="space-y-2">
                  <label className="block text-xs sm:text-sm font-semibold text-foreground mb-2 sm:mb-3">
                    Parcel Type *
                  </label>
                  <select
                    name="parcelDetails.type"
                    value={formData.parcelDetails.type}
                    onChange={handleInputChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-background/80 backdrop-blur-sm border border-border/50 rounded-lg sm:rounded-xl text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 hover:border-blue-400/50 transition-all duration-300 shadow-sm hover:shadow-md font-medium text-xs sm:text-sm appearance-none cursor-pointer"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 0.75rem center',
                      backgroundSize: '1.25rem',
                      paddingRight: '2.5rem'
                    }}
                  >
                    <option value="document">📄 Document</option>
                    <option value="package">📦 Package</option>
                    <option value="fragile">⚠️ Fragile Item</option>
                    <option value="electronics">💻 Electronics</option>
                    <option value="clothing">👕 Clothing</option>
                    <option value="other">📋 Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs sm:text-sm font-semibold text-foreground mb-2 sm:mb-3">
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
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-background/80 backdrop-blur-sm border border-border/50 rounded-lg sm:rounded-xl text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 hover:border-blue-400/50 transition-all duration-300 shadow-sm hover:shadow-md font-medium text-xs sm:text-sm"
                    placeholder="Enter weight (max 50kg)"
                  />
                  {errors["parcelDetails.weight"] && (
                    <div className="mt-2 p-2 sm:p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/30 rounded-lg sm:rounded-xl">
                      <p className="text-xs sm:text-sm text-red-600 dark:text-red-400 font-medium">
                        ⚠️ {errors["parcelDetails.weight"]}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {}
              <div className="mt-4 sm:mt-6 lg:mt-8">
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <div className="p-1.5 sm:p-2 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-md sm:rounded-lg">
                    <svg
                      className="h-3 w-3 sm:h-4 sm:w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 8V4a1 1 0 011-1h4m6 0h4a1 1 0 011 1v4m0 6v4a1 1 0 01-1 1h-4m-6 0H4a1 1 0 01-1-1v-4"
                      />
                    </svg>
                  </div>
                  <label className="text-xs sm:text-sm font-semibold text-foreground">
                    Dimensions (cm) *
                  </label>
                </div>
                <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:gap-4">
                  <div className="space-y-2">
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      name="parcelDetails.dimensions.length"
                      value={formData.parcelDetails.dimensions.length}
                      onChange={handleInputChange}
                      className="w-full px-2 sm:px-3 lg:px-4 py-2 sm:py-2.5 lg:py-3 bg-background/80 backdrop-blur-sm border border-border/50 rounded-lg sm:rounded-xl text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 hover:border-emerald-400/50 transition-all duration-300 shadow-sm hover:shadow-md font-medium text-xs sm:text-sm"
                      placeholder="📏 Length"
                    />
                    {errors["parcelDetails.dimensions.length"] && (
                      <div className="p-1.5 sm:p-2 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/30 rounded-md sm:rounded-lg">
                        <p className="text-[10px] sm:text-xs text-red-600 dark:text-red-400 font-medium">
                          {errors["parcelDetails.dimensions.length"]}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      name="parcelDetails.dimensions.width"
                      value={formData.parcelDetails.dimensions.width}
                      onChange={handleInputChange}
                      className="w-full px-2 sm:px-3 lg:px-4 py-2 sm:py-2.5 lg:py-3 bg-background/80 backdrop-blur-sm border border-border/50 rounded-lg sm:rounded-xl text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 hover:border-emerald-400/50 transition-all duration-300 shadow-sm hover:shadow-md font-medium text-xs sm:text-sm"
                      placeholder="📐 Width"
                    />
                    {errors["parcelDetails.dimensions.width"] && (
                      <div className="p-1.5 sm:p-2 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/30 rounded-md sm:rounded-lg">
                        <p className="text-[10px] sm:text-xs text-red-600 dark:text-red-400 font-medium">
                          {errors["parcelDetails.dimensions.width"]}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      name="parcelDetails.dimensions.height"
                      value={formData.parcelDetails.dimensions.height}
                      onChange={handleInputChange}
                      className="w-full px-2 sm:px-3 lg:px-4 py-2 sm:py-2.5 lg:py-3 bg-background/80 backdrop-blur-sm border border-border/50 rounded-lg sm:rounded-xl text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 hover:border-emerald-400/50 transition-all duration-300 shadow-sm hover:shadow-md font-medium text-xs sm:text-sm"
                      placeholder="📊 Height"
                    />
                    {errors["parcelDetails.dimensions.height"] && (
                      <div className="p-1.5 sm:p-2 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/30 rounded-md sm:rounded-lg">
                        <p className="text-[10px] sm:text-xs text-red-600 dark:text-red-400 font-medium">
                          {errors["parcelDetails.dimensions.height"]}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-4 sm:mt-6 lg:mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-2 sm:mb-3">
                    <div className="p-1.5 sm:p-2 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-md sm:rounded-lg">
                      <svg
                        className="h-3 w-3 sm:h-4 sm:w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                        />
                      </svg>
                    </div>
                    <label className="text-xs sm:text-sm font-semibold text-foreground">
                      Estimated Value (BDT)
                    </label>
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    name="parcelDetails.value"
                    value={formData.parcelDetails.value}
                    onChange={handleInputChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-background/80 backdrop-blur-sm border border-border/50 rounded-lg sm:rounded-xl text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 hover:border-green-400/50 transition-all duration-300 shadow-sm hover:shadow-md font-medium text-xs sm:text-sm"
                    placeholder="💰 0.00"
                  />
                </div>
              </div>

              <div className="mt-4 sm:mt-6 lg:mt-8">
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <div className="p-1.5 sm:p-2 bg-gradient-to-br from-purple-500 to-indigo-600 text-white rounded-md sm:rounded-lg">
                    <svg
                      className="h-3 w-3 sm:h-4 sm:w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <label className="text-xs sm:text-sm font-semibold text-foreground">
                    Description *
                  </label>
                </div>
                <textarea
                  name="parcelDetails.description"
                  value={formData.parcelDetails.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-background/80 backdrop-blur-sm border border-border/50 rounded-lg sm:rounded-xl text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 hover:border-purple-400/50 transition-all duration-300 shadow-sm hover:shadow-md font-medium resize-none text-xs sm:text-sm"
                  placeholder="📝 Describe the contents of your parcel in detail..."
                />
                {errors["parcelDetails.description"] && (
                  <div className="mt-2 p-2 sm:p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/30 rounded-lg sm:rounded-xl">
                    <p className="text-xs sm:text-sm text-red-600 dark:text-red-400 font-medium">
                      ⚠️ {errors["parcelDetails.description"]}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {}
            <div className="bg-gradient-to-br from-orange-50/50 via-background to-red-50/50 dark:from-orange-950/20 dark:via-background dark:to-red-950/20 backdrop-blur-sm border border-border/50 rounded-xl sm:rounded-2xl shadow-xl shadow-orange-500/5 dark:shadow-orange-400/10 p-4 sm:p-6 lg:p-8 hover:shadow-2xl hover:shadow-orange-500/10 dark:hover:shadow-orange-400/20 transition-all duration-500">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 lg:mb-8">
                <div className="p-2 sm:p-3 bg-gradient-to-br from-orange-500 to-red-600 text-white rounded-lg sm:rounded-xl shadow-lg">
                  <svg
                    className="h-5 w-5 sm:h-6 sm:w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 dark:from-orange-400 dark:to-red-400 bg-clip-text text-transparent">
                    Delivery Options
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Choose your preferred delivery settings
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-2 sm:mb-3">
                    <div className="p-1.5 sm:p-2 bg-gradient-to-br from-blue-500 to-cyan-600 text-white rounded-md sm:rounded-lg">
                      <svg
                        className="h-3 w-3 sm:h-4 sm:w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a1 1 0 011 1v9a2 2 0 01-2 2H5a2 2 0 01-2-2V8a1 1 0 011-1h3z"
                        />
                      </svg>
                    </div>
                    <label className="text-xs sm:text-sm font-semibold text-foreground">
                      Preferred Delivery Date
                    </label>
                  </div>
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
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-background/80 backdrop-blur-sm border border-border/50 rounded-lg sm:rounded-xl text-foreground focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 hover:border-blue-400/50 transition-all duration-300 shadow-sm hover:shadow-md font-medium text-xs sm:text-sm [color-scheme:light] dark:[color-scheme:dark]"
                  />
                </div>

                <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gradient-to-r from-emerald-50/50 to-teal-50/50 dark:from-emerald-950/20 dark:to-teal-950/20 rounded-lg sm:rounded-xl border border-emerald-200/50 dark:border-emerald-800/30 hover:shadow-md transition-all duration-300">
                  <input
                    type="checkbox"
                    id="isUrgent"
                    name="deliveryInfo.isUrgent"
                    checked={formData.deliveryInfo.isUrgent}
                    onChange={handleInputChange}
                    className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600 bg-background border-2 border-emerald-300 rounded focus:ring-emerald-500 focus:ring-2 transition-all duration-300"
                  />
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-1">
                    <svg
                      className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    <label
                      htmlFor="isUrgent"
                      className="text-xs sm:text-sm font-semibold text-foreground cursor-pointer"
                    >
                      Urgent Delivery
                      <span className="text-orange-600 dark:text-orange-400 font-bold ml-1">
                        (+100 BDT)
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="mt-4 sm:mt-6 lg:mt-8">
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <div className="p-1.5 sm:p-2 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-md sm:rounded-lg">
                    <svg
                      className="h-3 w-3 sm:h-4 sm:w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                  </div>
                  <label className="text-xs sm:text-sm font-semibold text-foreground">
                    Delivery Instructions
                  </label>
                </div>
                <textarea
                  name="deliveryInfo.deliveryInstructions"
                  value={formData.deliveryInfo.deliveryInstructions}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-background/80 backdrop-blur-sm border border-border/50 rounded-lg sm:rounded-xl text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 hover:border-indigo-400/50 transition-all duration-300 shadow-sm hover:shadow-md font-medium resize-none text-xs sm:text-sm"
                  placeholder="📋 Any special instructions for delivery (building access, floor, contact info, etc.)..."
                />
              </div>
            </div>

            {}
            <div className="bg-gradient-to-br from-emerald-50/50 via-background to-teal-50/50 dark:from-emerald-950/20 dark:via-background dark:to-teal-950/20 backdrop-blur-sm border border-emerald-200/50 dark:border-emerald-800/30 rounded-xl sm:rounded-2xl shadow-xl shadow-emerald-500/5 dark:shadow-emerald-400/10 p-4 sm:p-6 lg:p-8 hover:shadow-2xl hover:shadow-emerald-500/10 dark:hover:shadow-emerald-400/20 transition-all duration-500">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <div className="p-2 sm:p-3 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-lg sm:rounded-xl shadow-lg">
                  <Calculator className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg lg:text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                    Estimated Delivery Fee
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Cost breakdown for your delivery
                  </p>
                </div>
              </div>
              <div className="bg-background/60 backdrop-blur-sm rounded-lg sm:rounded-xl p-4 sm:p-5 lg:p-6 border border-emerald-200/30 dark:border-emerald-800/20">
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-emerald-200/30 dark:border-emerald-800/20">
                    <span className="text-xs sm:text-sm font-medium text-muted-foreground flex items-center gap-1.5 sm:gap-2">
                      <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-500 rounded-full"></span>
                      Base Fee:
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-foreground">
                      50 BDT
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-emerald-200/30 dark:border-emerald-800/20">
                    <span className="text-xs sm:text-sm font-medium text-muted-foreground flex items-center gap-1.5 sm:gap-2">
                      <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full"></span>
                      <span className="truncate">Weight Fee ({formData.parcelDetails.weight || 0} kg × 20 BDT):</span>
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-foreground whitespace-nowrap ml-2">
                      {(parseFloat(formData.parcelDetails.weight) || 0) * 20}{" "}
                      BDT
                    </span>
                  </div>
                  {formData.deliveryInfo.isUrgent && (
                    <div className="flex justify-between items-center py-2 border-b border-emerald-200/30 dark:border-emerald-800/20">
                      <span className="text-xs sm:text-sm font-medium text-muted-foreground flex items-center gap-1.5 sm:gap-2">
                        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-orange-500 rounded-full"></span>
                        Urgent Fee:
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-orange-600 dark:text-orange-400">
                        100 BDT
                      </span>
                    </div>
                  )}
                  <div className="pt-3 sm:pt-4 border-t-2 border-emerald-300/50 dark:border-emerald-700/50">
                    <div className="flex justify-between items-center">
                      <span className="text-base sm:text-lg font-bold text-foreground flex items-center gap-1.5 sm:gap-2">
                        <span className="w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"></span>
                        Total:
                      </span>
                      <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                        {estimatedFee} BDT
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {}
            <div className="flex flex-col xs:flex-row justify-end gap-3 sm:gap-4 lg:gap-6 pt-4 sm:pt-6 lg:pt-8">
              <Link
                to="/sender"
                className="w-full xs:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-background/80 backdrop-blur-sm border-2 border-border/50 rounded-lg sm:rounded-xl text-muted-foreground hover:bg-muted/50 hover:text-foreground hover:border-border font-semibold transition-all duration-300 shadow-sm hover:shadow-lg flex items-center justify-center gap-2 group text-sm sm:text-base"
              >
                <svg
                  className="h-3 w-3 sm:h-4 sm:w-4 group-hover:-translate-x-1 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Cancel
              </Link>

              <button
                type="submit"
                className="w-full xs:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-br from-red-600 via-red-600 to-red-700 hover:from-red-700 hover:via-red-700 hover:to-red-800 text-white rounded-lg sm:rounded-xl font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 sm:gap-3 shadow-xl shadow-red-500/25 hover:shadow-2xl hover:shadow-red-500/40 hover:-translate-y-1 transform group text-sm sm:text-base"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-2 border-white border-t-transparent"></div>
                    <span>Creating Parcel...</span>
                  </>
                ) : (
                  <>
                    <Package className="h-4 w-4 sm:h-5 sm:w-5 group-hover:scale-110 transition-transform duration-300" />
                    <span>Create Parcel</span>
                    <svg
                      className="h-3 w-3 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </form>
          {console.log('🔍 Render Check:', { createdParcel, shouldShowModal: !!createdParcel })}
          {createdParcel && (
            <ParcelCreatedModal
              parcel={createdParcel}
              onClose={() => setCreatedParcel(null)}
            />
          )}
        </div>
      </div>
      <FooterSection />
    </ProtectedRoute>
  );
}
