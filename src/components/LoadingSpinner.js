import React from "react";

export function LoadingSpinner({ size = 8 }) {
  return (
    <div className={`w-${size} h-${size} border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin`} />
  );
}

export function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <LoadingSpinner size={12} />
    </div>
  );
}
