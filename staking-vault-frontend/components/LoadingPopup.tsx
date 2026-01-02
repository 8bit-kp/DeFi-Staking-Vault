interface LoadingPopupProps {
  isOpen: boolean;
  message: string;
  description?: string;
}

export default function LoadingPopup({ isOpen, message, description }: LoadingPopupProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      
      {/* Popup */}
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-2xl border border-gray-200 dark:border-gray-800 max-w-md w-full mx-4 animate-fadeIn">
        {/* Spinner */}
        <div className="flex justify-center mb-6">
          <div className="relative w-20 h-20">
            {/* Outer ring */}
            <div className="absolute inset-0 border-4 border-gray-200 dark:border-gray-800 rounded-full"></div>
            {/* Spinning ring */}
            <div className="absolute inset-0 border-4 border-transparent border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin"></div>
            {/* Inner pulse */}
            <div className="absolute inset-3 bg-blue-100 dark:bg-blue-900/30 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Message */}
        <div className="text-center space-y-2">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {message}
          </h3>
          {description && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {description}
            </p>
          )}
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mt-6">
          <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>

        {/* Additional info */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
          <p className="text-xs text-center text-gray-500 dark:text-gray-500">
            Please confirm the transaction in your wallet and wait for blockchain confirmation...
          </p>
        </div>
      </div>
    </div>
  );
}
