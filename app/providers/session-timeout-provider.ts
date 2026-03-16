"use client";

import { useEffect, useRef } from "react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { logger } from "@/utils/logger";
import { removeAuthUser } from "../lib/auth";

const SESSION_LIMIT = 2 * 60 * 1000; // 2 menit
const WARNING_TIME = 90 * 1000; // 1 menit 30 detik
const THROTTLE_LIMIT = 2000; // 2 detik (untuk mencegah lag saat mousemove)

function setSessionExpiry() {
  const expiry = Date.now() + SESSION_LIMIT;

  Cookies.set("session_expiry", expiry.toString(), {
    path: "/",
  });
}

function getSessionExpiry() {
  const expiry = Cookies.get("session_expiry");
  return expiry ? Number(expiry) : null;
}

function clearSessionExpiry() {
  Cookies.remove("session_expiry");
}

export default function SessionTimeoutProvider({
  isAuthenticated,
  children,
}: {
  isAuthenticated: boolean;
  children: React.ReactNode;
}) {
  const router = useRouter();

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const warningRef = useRef<NodeJS.Timeout | null>(null);
  const expiredRef = useRef(false);
  const lastActivityRef = useRef<number>(0);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimers = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      logger.info("clear timeout timer");
    }

    if (warningRef.current) {
      clearTimeout(warningRef.current);
      logger.info("clear warning timer");
    }

    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      logger.info("clear countdown interval");
    }
  };

  const handleSessionExpired = () => {
    if (expiredRef.current) return;

    expiredRef.current = true;

    logger.info("SESSION EXPIRED");

    clearTimers();

    router.push("/auth/login");
    router.refresh();

    removeAuthUser();
    clearSessionExpiry();
  };

  const resetTimer = (source = "activity") => {
    if (!isAuthenticated || expiredRef.current) {
      logger.info("skip resetTimer, user not authenticated");
      return;
    }

    if (expiredRef.current) {
      logger.info("skip resetTimer, session already expired");
      return;
    }

    logger.info("resetTimer triggered from:", source);

    clearTimers();
    setSessionExpiry();

    const expiry = getSessionExpiry();
    countdownRef.current = setInterval(() => {
      if (!expiry) return;
      const remaining = expiry - Date.now();
      const seconds = Math.max(0, Math.floor(remaining / 1000));
      logger.info("session countdown:", seconds, "seconds");
      if (remaining <= 0 && countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    }, 1000);

    logger.info("start warning timer (90s)");

    warningRef.current = setTimeout(() => {
      logger.info("warning triggered (1:30)");

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "warning",
        title: "Session akan berakhir dalam 30 detik",
        showCloseButton: true,
        showConfirmButton: false,
        timer: 30000,
        timerProgressBar: true,
      });
    }, WARNING_TIME);

    logger.info("start session expire timer (120s)");

    timeoutRef.current = setTimeout(() => {
      handleSessionExpired();
    }, SESSION_LIMIT);
  };

  const checkSessionExpiry = () => {
    const expiry = getSessionExpiry();
    if (!expiry) {
      logger.info("no session expiry cookie found");
      return false;
    }

    const now = Date.now();
    logger.info(
      "checking expiry cookie:",
      expiry,
      "now:",
      now,
      "now >= expiry",
      now >= expiry,
    );
    if (now >= expiry) {
      logger.info("SESSION ALREADY EXPIRED FROM COOKIE");
      handleSessionExpired();
      return true;
    }
    return false;
  };

  useEffect(() => {
    logger.info("auth state:", isAuthenticated);

    if (!isAuthenticated) {
      clearTimers();
      logger.info("useEffect clearTimers()", isAuthenticated);
      return;
    }

    const alreadyExpired = checkSessionExpiry();
    logger.info("checkSessionExpiry(), alreadyExpiry?", alreadyExpired);
    if (alreadyExpired) return;
    const events = [
      "mousemove",
      "mousedown",
      "keypress",
      "scroll",
      "touchstart",
    ];

    const handleActivity = (e: Event) => {
      const now = Date.now();
      if (now - lastActivityRef.current > THROTTLE_LIMIT) {
        logger.info("activity detected:", e.type);
        lastActivityRef.current = now;
        resetTimer(e.type);
      }
    };

    events.forEach((event) => {
      window.addEventListener(event, handleActivity);
      logger.info("attach event:", event);
    });

    resetTimer("init");
    logger.info("resetTimer(`init`)", alreadyExpired);

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
        logger.info("remove event:", event);
      });

      clearTimers();
    };
  }, [isAuthenticated]);

  return children;
}
