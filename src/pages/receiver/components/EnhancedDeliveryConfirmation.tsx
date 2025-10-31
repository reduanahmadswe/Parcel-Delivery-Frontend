import {
  AlertCircle,
  Camera,
  CheckCircle2,
  Clock,
  Package,
  Signature,
  Star,
  X,
} from "lucide-react";
import React, { useState } from "react";
import { Parcel } from "../types";

interface EnhancedDeliveryConfirmationProps {
  parcel: Parcel | null;
  onClose: () => void;
  onConfirm: (parcelId: number, confirmationData: any) => void;
  isConfirming: boolean;
}

const EnhancedDeliveryConfirmation: React.FC<
  EnhancedDeliveryConfirmationProps
> = ({ parcel, onClose, onConfirm, isConfirming }) => {
  const [step, setStep] = useState(1); 
  const [confirmationData, setConfirmationData] = useState({
    receivedAt: new Date().toISOString(),
    condition: "good", 
    notes: "",
    rating: 0,
    photoTaken: false,
    signatureProvided: false,
  });

  if (!parcel) return null;

  const handleConfirm = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      onConfirm(parcel.id, confirmationData);
    }
  };

  const handleConditionChange = (condition: string) => {
    setConfirmationData((prev) => ({ ...prev, condition }));
  };

  const handleNotesChange = (notes: string) => {
    setConfirmationData((prev) => ({ ...prev, notes }));
  };

  const handleRatingChange = (rating: number) => {
    setConfirmationData((prev) => ({ ...prev, rating }));
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
                <Package className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Verify Package Details
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Please verify the package information before confirming delivery
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-600 dark:text-gray-400">
                    Tracking ID:
                  </span>
                  <p className="font-mono text-gray-900 dark:text-white">
                    {parcel.trackingNumber}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-600 dark:text-gray-400">
                    From:
                  </span>
                  <p className="text-gray-900 dark:text-white">
                    {parcel.senderName}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-600 dark:text-gray-400">
                    Weight:
                  </span>
                  <p className="text-gray-900 dark:text-white">
                    {parcel.weight} kg
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-600 dark:text-gray-400">
                    Type:
                  </span>
                  <p className="text-gray-900 dark:text-white capitalize">
                    {parcel.type}
                  </p>
                </div>
              </div>

              <div>
                <span className="font-medium text-gray-600 dark:text-gray-400">
                  Description:
                </span>
                <p className="text-gray-900 dark:text-white mt-1">
                  {parcel.description}
                </p>
              </div>
            </div>

            <div className="border-2 border-dashed border-blue-200 dark:border-blue-800 rounded-xl p-6 text-center">
              <AlertCircle className="w-12 h-12 text-blue-500 mx-auto mb-3" />
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                Important Notice
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                By confirming delivery, you acknowledge that you have received
                the package and it matches the description above. Please inspect
                the package before proceeding.
              </p>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Package Condition
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Please indicate the condition of the received package
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-3">
                {[
                  {
                    value: "good",
                    label: "Good Condition",
                    desc: "Package received in perfect condition",
                    color: "green",
                    icon: CheckCircle2,
                  },
                  {
                    value: "damaged",
                    label: "Damaged",
                    desc: "Package has visible damage or issues",
                    color: "red",
                    icon: AlertCircle,
                  },
                  {
                    value: "incomplete",
                    label: "Incomplete",
                    desc: "Missing items or incomplete delivery",
                    color: "yellow",
                    icon: Clock,
                  },
                ].map((option) => {
                  const IconComponent = option.icon;
                  return (
                    <button
                      key={option.value}
                      onClick={() => handleConditionChange(option.value)}
                      className={`w-full flex items-start gap-4 p-4 rounded-lg border-2 transition-all duration-200 ${
                        confirmationData.condition === option.value
                          ? `border-${option.color}-300 bg-${option.color}-50 dark:bg-${option.color}-950/20`
                          : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                      }`}
                    >
                      <div
                        className={`p-2 rounded-lg ${
                          confirmationData.condition === option.value
                            ? `bg-${option.color}-100 dark:bg-${option.color}-900/30`
                            : "bg-gray-100 dark:bg-gray-700"
                        }`}
                      >
                        <IconComponent
                          className={`w-5 h-5 ${
                            confirmationData.condition === option.value
                              ? `text-${option.color}-600 dark:text-${option.color}-400`
                              : "text-gray-500"
                          }`}
                        />
                      </div>
                      <div className="text-left">
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {option.label}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {option.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {confirmationData.condition !== "good" && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    value={confirmationData.notes}
                    onChange={(e) => handleNotesChange(e.target.value)}
                    placeholder="Please describe the issue in detail..."
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                  />
                </div>
              )}
            </div>

            {}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() =>
                  setConfirmationData((prev) => ({
                    ...prev,
                    photoTaken: !prev.photoTaken,
                  }))
                }
                className={`flex items-center gap-2 p-3 rounded-lg border transition-all duration-200 ${
                  confirmationData.photoTaken
                    ? "border-blue-300 bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300"
                    : "border-gray-300 dark:border-gray-600 hover:border-blue-300"
                }`}
              >
                <Camera className="w-5 h-5" />
                <span className="text-sm font-medium">
                  {confirmationData.photoTaken ? "Photo Taken ✓" : "Take Photo"}
                </span>
              </button>

              <button
                onClick={() =>
                  setConfirmationData((prev) => ({
                    ...prev,
                    signatureProvided: !prev.signatureProvided,
                  }))
                }
                className={`flex items-center gap-2 p-3 rounded-lg border transition-all duration-200 ${
                  confirmationData.signatureProvided
                    ? "border-blue-300 bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300"
                    : "border-gray-300 dark:border-gray-600 hover:border-blue-300"
                }`}
              >
                <Signature className="w-5 h-5" />
                <span className="text-sm font-medium">
                  {confirmationData.signatureProvided
                    ? "Signed ✓"
                    : "Provide Signature"}
                </span>
              </button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-4">
                <Star className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Rate Your Experience
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                How was your delivery experience?
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => handleRatingChange(rating)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 ${
                      rating <= confirmationData.rating
                        ? "bg-yellow-400 text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-400 hover:bg-yellow-300"
                    }`}
                  >
                    <Star
                      className="w-6 h-6"
                      fill={
                        rating <= confirmationData.rating
                          ? "currentColor"
                          : "none"
                      }
                    />
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {confirmationData.rating > 0 && (
                  <>
                    {confirmationData.rating === 1 && "Poor"}
                    {confirmationData.rating === 2 && "Fair"}
                    {confirmationData.rating === 3 && "Good"}
                    {confirmationData.rating === 4 && "Very Good"}
                    {confirmationData.rating === 5 && "Excellent"}
                  </>
                )}
              </p>
            </div>

            <div className="bg-green-50 dark:bg-green-950/20 rounded-xl p-6 text-center">
              <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                Ready to Confirm
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Click "Confirm Delivery" to complete the process
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="text-2xl">📦</div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Confirm Delivery
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Step {step} of 3
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {}
        <div className="px-6 pt-4">
          <div className="flex items-center gap-2 mb-6">
            {[1, 2, 3].map((stepNum) => (
              <div key={stepNum} className="flex items-center flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    stepNum < step
                      ? "bg-green-500 text-white"
                      : stepNum === step
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-500"
                  }`}
                >
                  {stepNum < step ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    stepNum
                  )}
                </div>
                {stepNum < 3 && (
                  <div
                    className={`flex-1 h-1 mx-2 rounded ${
                      stepNum < step
                        ? "bg-green-500"
                        : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {}
        <div className="px-6 pb-6">{renderStepContent()}</div>

        {}
        <div className="flex justify-between items-center p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={step === 1 ? onClose : () => setStep(step - 1)}
            className="px-6 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            {step === 1 ? "Cancel" : "Back"}
          </button>

          <button
            onClick={handleConfirm}
            disabled={
              isConfirming || (step === 3 && confirmationData.rating === 0)
            }
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
          >
            {isConfirming ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Confirming...
              </>
            ) : step === 3 ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Confirm Delivery
              </>
            ) : (
              "Next"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnhancedDeliveryConfirmation;

