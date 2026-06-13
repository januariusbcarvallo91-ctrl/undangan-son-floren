/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Church, Wine, Calendar, Clock, MapPin, Map } from 'lucide-react';
import { AGENDA_EVENTS } from '../data';

export default function AgendaSection() {
  return (
    <div className="w-full text-center">
      <div className="mb-10 text-center">
        <span className="tracking-[0.3em] uppercase text-[10px] sm:text-xs text-brand-mocha font-bold block mb-2">
          Save The Date
        </span>
        <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-brand-mocha/30 to-transparent mx-auto mt-3" />
      </div>

      <div className="space-y-8 max-w-md mx-auto">
        {AGENDA_EVENTS.map((event, idx) => {
          const isBerkat = event.title === 'Berkat Nikah';
          return (
            <div
              key={idx}
              className="glass-card p-6 border border-white/50 bg-white/20 hover:border-brand-mocha/30 transition-all duration-500 rounded-3xl relative overflow-hidden group text-center flex flex-col items-center shadow-sm"
            >
              {/* Soft decorative glow background reflection */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand-mocha/5 rounded-bl-full pointer-events-none transition-all duration-500 group-hover:scale-110" />

              {/* Event Icon */}
              <div className="w-12 h-12 rounded-full bg-brand-mocha/10 border border-brand-mocha/20 flex items-center justify-center mb-4 transition duration-500 group-hover:bg-brand-mocha/20">
                {isBerkat ? (
                  <Church className="w-5 h-5 text-brand-mocha shrink-0" />
                ) : (
                  <Wine className="w-5 h-5 text-brand-mocha shrink-0" />
                )}
              </div>

              {/* Title */}
              <h3 className="font-serif text-2xl font-bold tracking-wide text-brand-mocha mb-4 text-shadow-sm">
                {event.title}
              </h3>

              {/* Hairline Divider */}
              <div className="w-12 h-[1px] bg-brand-mocha/25 mb-4" />

              {/* Details box */}
              <div className="text-sm text-brand-brown space-y-3 font-light mb-6 w-fit mx-auto text-left">
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-brand-mocha shrink-0" />
                  <span className="font-semibold text-brand-brown">{event.date}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-brand-mocha shrink-0" />
                  <span className="text-brand-brown/90">{event.time}</span>
                </div>
                <div className="flex items-start gap-3 mt-1">
                  <MapPin className="w-4 h-4 text-brand-mocha shrink-0 mt-0.5" />
                  <span className="text-xs leading-relaxed max-w-[210px] text-brand-brown/80 font-medium">
                    {event.locationName}
                  </span>
                </div>
              </div>

              {/* Maps Locator button */}
              <a
                href={event.mapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer inline-flex items-center gap-2 bg-brand-mocha hover:bg-brand-brown text-white text-xs font-semibold py-2.5 px-6 rounded-full shadow-md transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
              >
                <Map className="w-3.5 h-3.5 shrink-0 text-white" />
                Peta Lokasi
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}
