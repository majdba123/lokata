import React from "react";

interface ActionButtonsProps {
  onBack: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  isSubmitDisabled: boolean;
  submitText?: string;
  submittingText?: string;
  backButtonText?: string;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onBack,
  onSubmit,
  isSubmitting,
  isSubmitDisabled,
  submitText = "تأكيد وإنشاء المنتج بالخطة",
  submittingText = "جاري إنشاء المنتج...",
  backButtonText = "العودة لتعديل المنتج",
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mt-6">
      <button
        onClick={onBack}
        className="bg-gray-500 text-white rounded-md py-2 px-4 hover:bg-gray-600 transition duration-200 w-full sm:w-auto"
      >
        {backButtonText}{" "}
      </button>
      <button
        className="bg-green-500 text-white rounded-md py-2 px-4 hover:bg-green-600 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto flex-grow"
        disabled={isSubmitDisabled || isSubmitting}
        onClick={onSubmit}
      >
        {isSubmitting ? submittingText : submitText}
      </button>
    </div>
  );
};

export default ActionButtons;
