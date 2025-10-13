"use client";

import clsx from "clsx";
import {
  ArrowLeftRight,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  LucideIcon,
  PieChart,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { getUser } from "../lib/auth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getTransactions } from "@/actions/fetchTransaction";
import axios from "axios";
import { API_BACKEND } from "../utils/constant";
import { InboxResponse } from "../components/notif/inbox-interface";

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const pathname = usePathname();

  const [expand, setExpand] = useState<boolean>(true);
  const [userData, setUserData] = useState<AuthDataResponse | null>(null);

  const [transactionCount, setTransactionCount] = useState<number>(0);
  const [portfolioCount, setPortfolioCount] = useState<number>(0);

  //* init state
  useEffect(() => {
    const user = getUser();
    if (user) {
      setUserData(user);
      if (user.role === "emiten") {
        const getTransactionCount = async () => {
          try {
            const res = await axios(`${API_BACKEND}/api/v1/inbox/list`, {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            });
            const list = res.data["data"] as InboxResponse[];
            const filteredTransactions = list.filter(
              (inbox: InboxResponse) => inbox.type === "transaction"
            );
            setTransactionCount(filteredTransactions.length);
          } catch (error) {
            setTransactionCount(0);
          }
        };
        getTransactionCount();
      }

      if (user.role === "investor" || user.role === "investor institusi") {
        const getTransactionCount = async () => {
          try {
            const data = await getTransactions(user?.token ?? "", 1, 10);
            setTransactionCount(data.items.length);
          } catch (error) {
            setTransactionCount(0);
          }
        };
        const getPortfolioCount = async () => {
          try {
            const res = await axios.get(
              `${API_BACKEND}/api/v1/dashboard/investor`,
              {
                headers: {
                  Authorization: `Bearer ${user.token}`,
                },
              }
            );
            const portfolios: any[] = res.data.data.portfolio;
            setPortfolioCount(portfolios.length);
          } catch (error) {
            setPortfolioCount(0);
          }
        };
        getTransactionCount();
        getPortfolioCount();
      }
    }
  }, []);

  const getHeaderTitle = (): string => {
    if (userData?.role === "emiten") {
      return "Penerbit";
    }
    if (userData?.role === "investor") {
      return "Pemodal";
    }
    return "Dashboard";
  };

  return (
    <div className="flex">
      <Sidebar expand={expand}>
        <SidebarHeader
          expand={expand}
          title={getHeaderTitle()}
          toggleExpand={(currentState) => {
            setExpand(currentState);
          }}
        />

        <SidebarMenu expand={expand}>
          <SidebarMenuItem
            expand={expand}
            pathName="/dashboard/main"
            title="Dashboard"
            icon={LayoutDashboard}
            setActive={(p) => p === pathname}
          />

          {/* MENU PENERBIT */}
          <SidebarMenuItem
            expand={expand}
            pathName="/dashboard/emiten-transaction"
            showWhen={userData?.role === "emiten"}
            title="Transaksi"
            icon={ArrowLeftRight}
            setActive={(p) => p === pathname}
            badgeCount={transactionCount}
          />

          {/* MENU PEMODAL */}
          <SidebarMenuItem
            expand={expand}
            pathName="/dashboard/investor-transaction"
            showWhen={
              userData?.role === "investor" ||
              userData?.role === "investor institusi"
            }
            title="Transaction"
            icon={ArrowLeftRight}
            setActive={(p) => p === pathname}
            badgeCount={transactionCount}
          />
          <SidebarMenuItem
            expand={expand}
            pathName="/dashboard/portfolio"
            showWhen={
              userData?.role === "investor" ||
              userData?.role === "investor institusi"
            }
            title="Portfolio"
            icon={PieChart}
            setActive={(p) => p === pathname}
            badgeCount={portfolioCount}
          />
          <SidebarMenuItem
            expand={expand}
            pathName="/business-list"
            showWhen={
              userData?.role === "investor" ||
              userData?.role === "investor institusi"
            }
            title="Explore Proyek"
            icon={Briefcase}
            setActive={(p) => p === pathname}
          />
        </SidebarMenu>
      </Sidebar>

      <DashboardContent expand={expand}>{children}</DashboardContent>
    </div>
  );
};

export default DashboardLayout;

const Sidebar: React.FC<{
  expand: boolean;
  children: React.ReactNode;
}> = ({ expand, children }) => {
  return (
    <div
      className={clsx(
        "fixed top-0 pt-28 left-0 h-screen z-60 bg-white text-gray-900 shadow-xl flex flex-col transition-all duration-300",
        "hidden md:flex",
        expand ? "md:w-44 lg:w-60" : "md:w-20"
      )}
    >
      {children}
    </div>
  );
};

const DashboardContent: React.FC<{
  expand: boolean;
  children: React.ReactNode;
}> = ({ expand, children }) => {
  return (
    <div
      className={clsx(
        "min-h-screen w-full pt-28 px-4 transition-all duration-300",
        expand ? "md:ml-48 lg:ml-64" : "md:ml-24"
      )}
    >
      {children}
    </div>
  );
};

const SidebarHeader: React.FC<{
  expand: boolean;
  title: string;
  toggleExpand: (currentState: boolean) => void;
}> = ({ expand, title, toggleExpand }) => {
  return (
    <div
      className={clsx(
        "flex px-4 pb-4 border-b border-gray-700",
        expand ? "justify-between" : "justify-center"
      )}
    >
      <span className={clsx("font-bold text-lg", !expand && "hidden")}>
        {title}
      </span>

      <button
        onClick={() => {
          toggleExpand(!expand);
        }}
        className="p-1 rounded hover:bg-gray-100"
      >
        {expand ? (
          <ChevronLeft className="w-5 h-5" />
        ) : (
          <ChevronRight className="w-5 h-5" />
        )}
      </button>
    </div>
  );
};

const SidebarMenu: React.FC<{
  expand: boolean;
  children: React.ReactNode;
}> = ({ expand, children }) => {
  return (
    <div
      className={clsx(
        "flex flex-col flex-1 mt-4 space-y-1",
        !expand ? "items-center" : ""
      )}
    >
      {children}
    </div>
  );
};

const SidebarMenuItem: React.FC<{
  expand: boolean;
  icon: LucideIcon;
  title: string;
  pathName: string;
  setActive: (pathName: string) => boolean;
  showWhen?: boolean;
  badgeCount?: number;
}> = ({
  expand,
  icon: Icon,
  title,
  pathName,
  setActive,
  badgeCount,
  showWhen = true,
}) => {
  if (!showWhen) return null;

  const active = setActive(pathName);

  return (
    <Link href={pathName}>
      <div
        className={clsx(
          "relative flex items-center gap-3 px-4 py-3 text-sm transition-color hover:bg-gray-100",
          active ? "bg-gray-100" : "bg-white"
        )}
      >
        <Icon className="w-5 h-5" />

        {expand && <p className="text-sm">{title}</p>}

        {badgeCount !== undefined && badgeCount > 0 && (
          <div className="absolute flex items-center justify-center right-4 h-5 w-5 rounded-full bg-red-100">
            <p className="text-xs font-semibold text-red-500">{badgeCount}</p>
          </div>
        )}
      </div>
    </Link>
  );
};
