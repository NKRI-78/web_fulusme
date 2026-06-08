'use client';

import React, { useEffect, useState } from 'react';

interface TimeLeft {
  total: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface CountdownTimerProps {
  expiryDate: string;
  onTick?: (timeLeft: TimeLeft) => void;
  onExpire?: () => void;
}

export default function CountdownTimer({
  expiryDate,
  onTick,
  onExpire,
}: CountdownTimerProps) {
  function parseDate(dateString: string) {
    return new Date(dateString?.replace(' ', 'T'));
  }

  function getTimeLeft(): TimeLeft {
    const now = new Date().getTime();
    const expiry = parseDate(expiryDate).getTime();
    const difference = expiry - now;

    const seconds = Math.floor((difference / 1000) % 60);
    const minutes = Math.floor((difference / 1000 / 60) % 60);
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));

    return {
      total: difference,
      days,
      hours,
      minutes,
      seconds,
    };
  }

  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    const timer = setInterval(() => {
      const updated = getTimeLeft();
      setTimeLeft(updated);
      setLoading(false);

      if (onTick) {
        onTick(updated);
      }

      if (updated.total <= 0) {
        clearInterval(timer);
        if (onExpire) {
          onExpire();
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [expiryDate]);

  if (loading || !timeLeft) {
    return <p className='text-black'>Loading...</p>;
  }

  if (timeLeft.total <= 0) {
    return <p className="text-red-600 font-bold">Pembayaran Kadaluarsa</p>;
  }

  return (
    <div className='text-black'>
      {timeLeft.days > 0 && <span>{timeLeft.days} Hari </span>}
      {timeLeft.hours > 0 && <span>{timeLeft.hours} Jam </span>}
      {timeLeft.minutes > 0 && <span>{timeLeft.minutes} Menit </span>}
      {timeLeft.seconds > 0 && <span>{timeLeft.seconds} Detik</span>}
    </div>
  );
}
