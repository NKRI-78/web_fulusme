import "./globals.css";

import Providers from "./providers";
import { Metadata } from "next";
import { BASE_URL } from "@shared/lib/constant";
import { cookies } from "next/headers";
import { SessionData } from "@shared/lib/auth";

export const metadata: Metadata = {
  title: "Fulusme.id",
  description:
    "FuLusme adalah platform crowdfunding yang mendukung berbagai proyek melalui investasi sukuk yang aman, transparan, dan sesuai prinsip syariah.",
  icons: {
    icon: "/favicon.ico",
  },
  metadataBase: BASE_URL,
  openGraph: {
    title: "Fulusme.id",
    description:
      "FuLusme adalah platform crowdfunding yang mendukung berbagai proyek melalui investasi sukuk yang aman, transparan, dan sesuai prinsip syariah.",
    url: "https://fulusme.id",
    siteName: "Fulusme",
    images: [
      {
        url: "/images/logo-fulusme-vertical.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "id_ID",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const raw = cookieStore.get("session")?.value;
  let session: SessionData | null = null;
  try {
    session = raw ? (JSON.parse(raw) as SessionData) : null;
  } catch {
    session = null;
  }

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="antialiased">
        <Providers session={session}>{children}</Providers>
      </body>
    </html>
  );
}
