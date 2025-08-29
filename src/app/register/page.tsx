"use client";

import React from "react";

const RegisterForm = React.lazy(() =>
  import("@/components/modules/Authentication/RegisterForm").then((module) => ({
    default: module.RegisterForm,
  }))
);

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>
        <React.Suspense fallback={<div>Loading...</div>}>
          <RegisterForm />
        </React.Suspense>
      </div>
    </div>
  );
}
