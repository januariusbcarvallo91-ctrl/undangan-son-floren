/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Mail } from 'lucide-react';
import { COVER_PHOTO, GROOM_DATA, BRIDE_DATA, AGENDA_EVENTS } from '../data';

interface InvitationCoverProps {
  onOpen: () => void;
}

export default function InvitationCover({ onOpen }: InvitationCoverProps) {
  const [guestName, setGuestName] = useState('Tamu Undangan Terhormat');

  useEffect(() => {
    // Parse guest from query parameter "to"
    const params = new URLSearchParams(window.location.search);
    const toParam = params.get('to');
    if (toParam) {
      // Decode URL safely and replace + or _ with space
      try {
        const decoded = decodeURIComponent(toParam.replace(/[\+_]/g, ' '));
        if (decoded.trim()) {
          setGuestName(decoded);
        }
      } catch (err) {
        console.error('Error decoding guest name:', err);
      }
    }
  }, []);

  return (
    <motion.div
      id="cover"
      initial={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: '-100vh' }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-end pb-16 px-4 bg-cover bg-center select-none"
      style={{ backgroundImage: `url(${COVER_PHOTO})` }}
    >
      {/* Light elegant frosted warm-tint gradient overlay with 10% transparency to let the photo display beautifully */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#fdfaf7]/15 via-[#fdfaf7]/10 to-[#fdfaf7]/5 pointer-events-none" />

      <div className="text-center text-brand-brown max-w-lg z-10 w-full px-4">
        {/* Category uppercase tag */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="tracking-[0.4em] uppercase text-[10px] sm:text-xs text-brand-mocha/90 font-bold mb-3 text-shadow-sm"
        >
          THE WEDDING OF
        </motion.p>

        {/* Groom & Bride names in custom serif font */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="font-serif text-5xl md:text-6xl font-normal tracking-wide text-brand-mocha mb-2 text-shadow"
        >
          {GROOM_DATA.name} &amp; {BRIDE_DATA.name}
        </motion.h1>

        {/* Main Wedding Date */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-xs sm:text-sm tracking-[0.2em] text-brand-brown/80 font-medium mb-8 text-shadow-sm"
        >
          {AGENDA_EVENTS[0].date}
        </motion.p>

        {/* Elegant thin hairline divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.8, duration: 1.0, ease: 'easeInOut' }}
          className="w-16 h-[1px] bg-brand-mocha/30 mx-auto my-6"
        />

        {/* Dynamic Guest Section */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.8 }}
          className="mb-8 text-center"
        >
          <span className="text-[10px] tracking-[0.25em] text-brand-brown/70 uppercase font-semibold block mb-2 text-shadow-sm">
            Kepada Yth. Bapak/Ibu/Saudara/i:
          </span>
          <div className="inline-block glass-card px-8 py-3 rounded-2xl bg-white/40 border-white/50 shadow-sm">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-brand-mocha text-shadow">
              {guestName}
            </h2>
          </div>
        </motion.div>

        {/* Elegant Primary Button inspired by rsvp-btn design layout */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <button
            onClick={onOpen}
            className="cursor-pointer bg-brand-mocha hover:bg-brand-brown text-white px-8 py-3.5 rounded-full text-xs font-bold tracking-[0.21em] uppercase shadow-md transition duration-500 transform hover:scale-105 active:scale-95 inline-flex items-center gap-2.5 focus:outline-none"
          >
            <Mail className="w-4 h-4 shrink-0 text-white" />
            Buka Undangan
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
