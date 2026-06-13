/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { AnimatePresence } from 'motion/react';
import {
  Heart,
  Image as ImageIcon,
  ChevronDown,
  Gift,
  Copy,
  Users,
  Check,
} from 'lucide-react';

import BackgroundSlideshow from './components/BackgroundSlideshow';
import InvitationCover from './components/InvitationCover';
import CountdownTimer from './components/CountdownTimer';
import AgendaSection from './components/AgendaSection';
import RSVPSection from './components/RSVPSection';
import ScrollSection from './components/ScrollSection';
import LightboxModal from './components/LightboxModal';
import AudioPlayer from './components/AudioPlayer';
import WhatsAppGenerator from './components/WhatsAppGenerator';

import {
  GROOM_DATA,
  BRIDE_DATA,
  GALLERY_PHOTOS,
  TURUT_MENGUNDANG,
  BIBLE_VERSE,
  BIBLE_REFERENCE,
  WITNESSES,
  GIFT_BANKS,
  AGENDA_EVENTS,
} from './data';

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number>(-1);
  const [copiedBankIndex, setCopiedBankIndex] = useState<number | null>(null);
  const [currentBgIdx, setCurrentBgIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBgIdx((prev) => (prev + 1) % GALLERY_PHOTOS.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const handleCopyAccount = (number: string, index: number) => {
    navigator.clipboard.writeText(number);
    setCopiedBankIndex(index);
    setTimeout(() => {
      setCopiedBankIndex(null);
    }, 2500);
  };

  // Synchronize browser body scroll locking on first enter
  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.height = '100vh';
    } else {
      document.body.style.overflow = '';
      document.body.style.height = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.height = '';
    };
  }, [isOpen]);

  const handleOpenInvitation = () => {
    setIsOpen(true);
    // Smooth scroll straight to top upon opening
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const handleNextPhoto = () => {
    setLightboxIndex((prev) => (prev + 1) % GALLERY_PHOTOS.length);
  };

  const handlePrevPhoto = () => {
    setLightboxIndex((prev) => (prev - 1 + GALLERY_PHOTOS.length) % GALLERY_PHOTOS.length);
  };

  return (
    <>
      {/* Background Slideshow (Dimmed overlay behind glass cards) */}
      <BackgroundSlideshow currentIdx={currentBgIdx} />

      {/* Floating Audio Soundtrack player */}
      <AudioPlayer isOpen={isOpen} />

      {/* Primary landing screen overlay cover */}
      <AnimatePresence>
        {!isOpen && <InvitationCover onOpen={handleOpenInvitation} />}
      </AnimatePresence>

      {/* Opened Content Layout */}
      {isOpen && (
        <div className="relative min-h-screen py-16 px-4 sm:px-6 md:px-8 space-y-16 max-w-lg mx-auto z-10">
          
          {/* SECTION 1: WELCOME */}
          <ScrollSection variant="fade-in" duration={1.2} delay={0.1} className="min-h-[85vh] flex flex-col justify-end pb-8 text-center">
            <div className="space-y-4 mb-4 max-w-sm mx-auto">
              {/* Hairline divider */}
              <div className="w-12 h-[1px] mx-auto bg-white/75 shadow-[0_1px_3px_rgba(0,0,0,0.5)]" />

              {/* Centered names block */}
              <div className="space-y-3">
                <p className="uppercase text-[10px] font-bold text-white tracking-[0.4em] drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                  THE WEDDING OF
                </p>
                <h2 className="font-serif text-3xl sm:text-4xl text-white font-normal tracking-wide drop-shadow-[0_4px_8px_rgba(0,0,0,0.95)]">
                  {GROOM_DATA.name} &amp; {BRIDE_DATA.name}
                </h2>
                <p className="text-[10px] sm:text-xs font-bold text-white tracking-[0.2em] drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                   {AGENDA_EVENTS[0].date}
                </p>
              </div>
            </div>

            {/* Micro bouncy scroll guide */}
            <div className="animate-bounce pt-2">
              <span className="text-[9px] tracking-[0.25em] font-bold uppercase block mb-1 text-white/95 drop-shadow-[0_1.5px_3px_rgba(0,0,0,0.9)]">
                Scroll Down
              </span>
              <ChevronDown className="w-4 h-4 mx-auto text-white drop-shadow-[0_1.5px_3px_rgba(0,0,0,0.9)]" />
            </div>
          </ScrollSection>

          {/* SECTION 1.5: SCRIPTURAL QUOTE CARD */}
          <ScrollSection variant="scale" className="glass-card p-6 sm:p-8 text-center border-white/55 bg-white/20 shadow-sm max-w-sm mx-auto">
            <div className="space-y-4">
              <p className="italic text-brand-brown/95 leading-relaxed text-xs sm:text-sm text-shadow-sm font-medium whitespace-pre-line">
                {BIBLE_VERSE}
              </p>
              <div className="w-8 h-[1px] bg-brand-mocha/25 mx-auto" />
              <span className="text-[10px] sm:text-xs font-bold tracking-widest text-brand-mocha uppercase text-shadow-sm block">
                {BIBLE_REFERENCE}
              </span>
            </div>
          </ScrollSection>

          {/* SECTION 2: THE BRIDE & GROOM BIOGRAPHIES */}
          <ScrollSection variant="scale" className="glass-card p-6 sm:p-8 text-center border-white/55 bg-white/20 shadow-sm">
            {/* The Groom Block */}
            <ScrollSection variant="slide-left" className="mb-14">
              <p className="tracking-[0.3em] uppercase text-xs text-brand-mocha font-bold mb-4 font-serif">
                The Groom
              </p>
              <div className="w-56 h-76 mx-auto rounded-3xl overflow-hidden border border-white/45 shadow-lg mb-5 relative group">
                <img
                  alt="Groom Bio Photo"
                  src={GROOM_DATA.photoUrl}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white/10 via-transparent to-transparent pointer-events-none" />
              </div>
              <div id="groom-name-box" className="inline-block bg-[#005691] text-white px-4 py-1.5 rounded-xl shadow-sm mb-3 max-w-full">
                <h3 className="font-serif text-[12px] min-[360px]:text-[13.5px] min-[390px]:text-[15px] sm:text-lg md:text-xl font-bold tracking-tight whitespace-nowrap text-white">
                  {GROOM_DATA.fullName}
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-brand-brown/95 max-w-xs mx-auto leading-relaxed text-shadow-sm font-medium">
                Putra Dari Pasangan <br />
                <span className="font-bold text-brand-mocha">{GROOM_DATA.parents.father}</span> <br />dan<br />{' '}
                <span className="font-bold text-brand-mocha">{GROOM_DATA.parents.mother}</span>
              </p>
            </ScrollSection>

            {/* Separator Heart Icon */}
            <ScrollSection variant="fade-in" className="flex items-center justify-center my-6 text-brand-mocha/30">
              <div className="h-[1px] w-12 bg-brand-mocha/25" />
              <Heart className="w-4 h-4 mx-4 text-brand-mocha/60 fill-brand-mocha/15 animate-pulse" />
              <div className="h-[1px] w-12 bg-brand-mocha/25" />
            </ScrollSection>

            {/* The Bride Block */}
            <ScrollSection variant="slide-right" className="mt-8">
              <p className="tracking-[0.3em] uppercase text-xs text-brand-mocha font-bold mb-4 font-serif">
                The Bride
              </p>
              <div className="w-56 h-76 mx-auto rounded-3xl overflow-hidden border border-white/45 shadow-lg mb-5 relative group">
                <img
                  alt="Bride Bio Photo"
                  src={BRIDE_DATA.photoUrl}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white/10 via-transparent to-transparent pointer-events-none" />
              </div>
              <div id="bride-name-box" className="inline-block bg-[#005691] text-white px-4 py-1.5 rounded-xl shadow-sm mb-3 max-w-full">
                <h3 className="font-serif text-[12px] min-[360px]:text-[13.5px] min-[390px]:text-[15px] sm:text-lg md:text-xl font-bold tracking-tight whitespace-nowrap text-white">
                  {BRIDE_DATA.fullName}
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-brand-brown/95 max-w-xs mx-auto leading-relaxed text-shadow-sm font-medium">
                Putri Pertama Dari Pasangan <br />
                <span className="font-bold text-brand-mocha">{BRIDE_DATA.parents.father}</span> <br />dan<br />{' '}
                <span className="font-bold text-brand-mocha">{BRIDE_DATA.parents.mother}</span>
              </p>
            </ScrollSection>
          </ScrollSection>

          {/* SECTION 3: SAKSI PERNIKAHAN */}
          <ScrollSection variant="scale" className="glass-card p-6 sm:p-8 border-white/55 bg-white/20 shadow-sm text-center">
            <div className="mb-6">
              <Users className="w-7 h-7 text-brand-mocha/60 mx-auto mb-2" />
              <h2 className="font-serif text-3xl text-brand-mocha font-semibold text-shadow-sm">Saksi Pernikahan</h2>
              <div className="w-12 h-[1px] bg-brand-mocha/25 mx-auto mt-3" />
              <p className="text-xs text-brand-brown/85 mt-2 leading-relaxed max-w-xs mx-auto font-medium">
                Keluarga terkasih yang bertindak selaku saksi pengikat perkawinan suci kedua mempelai
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              <div className="p-4 bg-white/45 border border-white/55 rounded-2xl shadow-sm text-center">
                <span className="text-[10px] uppercase tracking-widest text-brand-mocha font-bold block mb-1">
                  Saksi Pria
                </span>
                <p className="font-serif font-medium text-sm sm:text-base text-brand-brown">
                  {WITNESSES.groomWitness}
                </p>
              </div>

              <div className="p-4 bg-white/45 border border-white/55 rounded-2xl shadow-sm text-center">
                <span className="text-[10px] uppercase tracking-widest text-brand-mocha font-bold block mb-1">
                  Saksi Wanita
                </span>
                <p className="font-serif font-medium text-sm sm:text-base text-brand-brown">
                  {WITNESSES.brideWitness}
                </p>
              </div>
            </div>
          </ScrollSection>

          {/* SECTION 4: REMAINING TIMER BLOCK */}
          <ScrollSection variant="scale" className="glass-card p-6 sm:p-8 border-white/55 bg-white/20 shadow-sm">
            <CountdownTimer />
          </ScrollSection>

          {/* SECTION 5: LITURGICAL AGENDA EVENTS */}
          <ScrollSection variant="scale" className="glass-card p-6 sm:p-8 border-white/55 bg-white/20 shadow-sm">
            <AgendaSection />
          </ScrollSection>

          {/* SECTION 6: ELEVENTEEN PHOTO GALLERY */}
          <ScrollSection variant="scale" className="glass-card p-3 sm:p-6 pb-6 border-white/55 bg-white/20 shadow-sm">
            <div className="text-center mb-8">
              <ImageIcon className="w-7 h-7 text-brand-mocha/60 mx-auto mb-2" />
              <h2 className="font-serif text-3xl text-brand-mocha text-shadow-sm font-semibold">Galeri</h2>
              <div className="w-12 h-[1px] bg-brand-mocha/25 mx-auto mt-3" />
            </div>

            {/* Masonry flex wrap Grid */}
            <div className="flex flex-wrap justify-center gap-2">
              {GALLERY_PHOTOS.map((photo, index) => (
                <div
                  key={index}
                  onClick={() => setLightboxIndex(index)}
                  className="h-28 sm:h-36 overflow-hidden rounded-2xl shadow-sm border border-white/45 cursor-pointer cursor-zoom-in group shrink-0"
                >
                  <img
                    alt={photo.alt}
                    src={photo.src}
                    loading="lazy"
                    className="h-full w-auto object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </ScrollSection>

          {/* SECTION 7: RSVP SUBMISSION CARD & GUEST WISHES FEED */}
          <ScrollSection variant="scale" className="glass-card p-6 sm:p-8 border-white/55 bg-white/20 shadow-sm">
            <RSVPSection />
          </ScrollSection>

          {/* SECTION 7.5: DIGITAL GIFT / KIRIM KADO PERNIKAHAN */}
          <ScrollSection variant="scale" className="glass-card p-6 sm:p-8 border-white/55 bg-white/20 shadow-sm text-center">
            <div className="mb-6">
              <Gift className="w-7 h-7 text-brand-mocha/60 mx-auto mb-2" />
              <h2 className="font-serif text-3xl text-brand-mocha font-semibold text-shadow-sm">Kado Digital</h2>
              <div className="w-12 h-[1px] bg-brand-mocha/25 mx-auto mt-3" />
              <p className="text-xs text-brand-brown/85 mt-2 leading-relaxed max-w-xs mx-auto font-medium">
                Bagi Bapak/Ibu/Saudara/i sekalian yang ingin mengirimkan tanda kasih dan kado tali asih digital, kami menyediakan sarana transfer perbankan berikut:
              </p>
            </div>

            <div className="space-y-4 max-w-sm mx-auto">
              {GIFT_BANKS.map((bank, index) => (
                <div key={index} className="p-4 bg-white/45 border border-brand-mocha/15 rounded-2xl shadow-sm text-left relative flex flex-col justify-between">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-mono font-bold text-xs tracking-wider text-brand-mocha">
                      BANK {bank.bankName.toUpperCase()}
                    </span>
                    <button
                      onClick={() => handleCopyAccount(bank.accountNumber, index)}
                      className="cursor-pointer text-[10px] bg-brand-mocha/10 hover:bg-brand-mocha text-brand-mocha hover:text-white px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition-all duration-300"
                    >
                      {copiedBankIndex === index ? (
                        <>
                          <Check className="w-3 h-3" />
                          Tersalin
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          Salin
                        </>
                      )}
                    </button>
                  </div>
                  
                  <p className="font-mono text-sm sm:text-base font-bold text-brand-brown tracking-wider mb-1">
                    {bank.accountNumber}
                  </p>
                  
                  <span className="text-[10px] text-brand-brown/70 block font-semibold">
                    a.n. {bank.holderName}
                  </span>
                </div>
              ))}
            </div>
          </ScrollSection>

          {/* SECTION 8: CO-INVITED FAMILY ROLLS */}
          <ScrollSection variant="scale" className="glass-card p-6 sm:p-8 text-center border-white/55 bg-white/20 shadow-sm">
            <h2 className="font-serif text-3xl text-brand-mocha mb-4 text-shadow-sm font-semibold">Turut Mengundang</h2>
            <div className="w-12 h-[1px] bg-brand-mocha/25 mx-auto mb-8" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left text-xs sm:text-sm text-brand-brown max-w-md mx-auto">
              
              {/* Groom's Family Column */}
              <div className="glass-card p-5 bg-white/45 border border-white/55 !rounded-2xl shadow-sm">
                <h4 className="font-serif text-sm text-brand-mocha font-bold mb-3 border-b border-brand-mocha/20 pb-1.5 uppercase tracking-wider">
                  Keluarga Pria
                </h4>
                <ul className="space-y-2 font-medium">
                  {TURUT_MENGUNDANG.groom.map((f, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="text-brand-mocha mt-1.5 block w-1.5 h-1.5 rounded-full bg-brand-mocha shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bride's Family Column */}
              <div className="glass-card p-5 bg-white/45 border border-white/55 !rounded-2xl shadow-sm">
                <h4 className="font-serif text-sm text-brand-mocha font-bold mb-3 border-b border-brand-mocha/20 pb-1.5 uppercase tracking-wider">
                  Keluarga Wanita
                </h4>
                <ul className="space-y-2 font-medium">
                  {TURUT_MENGUNDANG.bride.map((f, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="text-brand-mocha mt-1.5 block w-1.5 h-1.5 rounded-full bg-brand-mocha shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </ScrollSection>

          {/* SECTION 9: WHATSAPP INVITATION GENERATOR (INDIVIDUAL & BULK) */}
          <WhatsAppGenerator />

          {/* Active lightbox zoomed overlay */}
          <LightboxModal
            isOpen={lightboxIndex >= 0}
            photoIndex={lightboxIndex}
            onClose={() => setLightboxIndex(-1)}
            onNext={handleNextPhoto}
            onPrev={handlePrevPhoto}
          />
        </div>
      )}
    </>
  );
}
