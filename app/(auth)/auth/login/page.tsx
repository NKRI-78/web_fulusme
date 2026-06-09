import React from "react";

import type { Metadata } from "next";

import Login from "@features/auth/components/login/Login";

export const metadata: Metadata = {
  title: "Masuk | FuLusme",
  description: "FuLusme",
};

const LoginPage: React.FC = () => {
  return <Login />;
};

export default LoginPage;
