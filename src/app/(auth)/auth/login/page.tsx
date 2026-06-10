import React from "react";

import type { Metadata } from "next";

import LoginForm from "@/features/auth/components/login/LoginForm";

export const metadata: Metadata = {
  title: "Masuk | FuLusme",
  description: "FuLusme",
};

const LoginPage: React.FC = () => {
  return <LoginForm />;
};

export default LoginPage;
