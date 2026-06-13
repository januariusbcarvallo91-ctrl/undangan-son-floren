/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { CalendarPlus } from 'lucide-react';
import { WEDDING_DATE, GOOGLE_CALENDAR_LINK } from '../data';

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00',
    isExpired: false,
  });

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime();
      const target = WEDDING_DATE.getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({
          days: '00',
          hours: '00',
          minutes: '00',
          seconds: '00',
          isExpired: true,
        });
        return;
      }

      const d = Math.floor(difference / (1000 * 60 * 60 * 24));
      const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({
        days: d < 10 ? `0${d}` : `${d}`,
        hours: h < 10 ? `0${h}` : `${h}`,
        minutes: m < 10 ? `0${m}` : `${m}`,
        seconds: s < 10 ? `0${s}` : `${s}`,
        isExpired: false,
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full text-center">
      <h2 className="font-serif text-3xl text-brand-mocha mb-2 text-shadow-sm font-semibold">Menghitung Hari</h2>
      <p className="text-[10px] tracking-widest text-[#8b7a6c] uppercase mb-8 text-shadow-sm font-medium">
        Menuju Momen Istimewa
      </p>

      {timeLeft.isExpired ? (
        <div className="text-xl font-serif text-brand-mocha py-4 font-semibold text-shadow-sm animate-pulse">
          Hari Bahagia Telah Tiba!
        </div>
      ) : (
        /* Countdown Blocks */
        <div className="grid grid-cols-4 gap-2.5 max-w-sm mx-auto mb-8">
          <div className="glass-card py-4 px-2 !rounded-2xl border-white/50 bg-white/20 shadow-sm">
            <span className="block font-serif text-2.5xl sm:text-3xl font-bold text-brand-mocha text-shadow">
              {timeLeft.days}
            </span>
            <span className="text-[9px] uppercase tracking-wider text-brand-brown/80 font-semibold block mt-0.5">Hari</span>
          </div>

          <div className="glass-card py-4 px-2 !rounded-2xl border-white/50 bg-white/20 shadow-sm">
            <span className="block font-serif text-2.5xl sm:text-3xl font-bold text-brand-mocha text-shadow">
              {timeLeft.hours}
            </span>
            <span className="text-[9px] uppercase tracking-wider text-brand-brown/80 font-semibold block mt-0.5">Jam</span>
          </div>

          <div className="glass-card py-4 px-2 !rounded-2xl border-white/50 bg-white/20 shadow-sm">
            <span className="block font-serif text-2.5xl sm:text-3xl font-bold text-brand-mocha text-shadow">
              {timeLeft.minutes}
            </span>
            <span className="text-[9px] uppercase tracking-wider text-brand-brown/80 font-semibold block mt-0.5">Menit</span>
          </div>

          <div className="glass-card py-4 px-2 !rounded-2xl border-white/50 bg-white/20 shadow-sm">
            <span className="block font-serif text-2.5xl sm:text-3xl font-bold text-brand-mocha text-shadow">
              {timeLeft.seconds}
            </span>
            <span className="text-[9px] uppercase tracking-wider text-brand-brown/80 font-semibold block mt-0.5">Detik</span>
          </div>
        </div>
      )}

      {/* Google Calendar Link with rsvp-btn inspired styling adapted for the card container */}
      <a
        href={GOOGLE_CALENDAR_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 bg-brand-mocha hover:bg-brand-brown border border-transparent text-white text-xs font-semibold py-2.5 px-6 rounded-full transition shadow-md hover:-translate-y-0.5 active:translate-y-0 duration-300"
      >
        <CalendarPlus className="w-4 h-4 text-white shrink-0" />
        Ingatkan Saya via Google Calendar
      </a>
    </div>
  );
}
