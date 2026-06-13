/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Music, VolumeX } from 'lucide-react';

interface AudioPlayerProps {
  isOpen: boolean;
}

export default function AudioPlayer({ isOpen }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Synchronize physical play/pause state with React state using standard HTML audio event listeners.
  // This guarantees the UI icon (Music spinner / Muted indicator) perfectly reflects physical audio state.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlayState = () => setIsPlaying(true);
    const handlePauseState = () => setIsPlaying(false);

    audio.addEventListener('play', handlePlayState);
    audio.addEventListener('pause', handlePauseState);
    audio.addEventListener('playing', handlePlayState);

    return () => {
      audio.removeEventListener('play', handlePlayState);
      audio.removeEventListener('pause', handlePauseState);
      audio.removeEventListener('playing', handlePlayState);
    };
  }, []);

  // Intercept client interaction click on the "Buka Undangan" button using event delegation.
  // Mobile devices (especially iOS and Android) only allow media playback if initiated directly 
  // within the callback of a physical user click or swipe event.
  useEffect(() => {
    const handleGesture = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement;
      const openBtn = target.closest('#open-invitation-btn');
      
      if (openBtn && audioRef.current) {
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch((err) => {
            console.warn('Synchronous click audio play initiation allowed or handled:', err);
          });
      }
    };

    document.addEventListener('click', handleGesture, { passive: true });
    document.addEventListener('touchstart', handleGesture, { passive: true });

    return () => {
      document.removeEventListener('click', handleGesture);
      document.removeEventListener('touchstart', handleGesture);
    };
  }, []);

  // Catch state transition to play if initial event delegation was skipped
  useEffect(() => {
    if (isOpen && audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play().catch((err) => {
          console.warn('Autoplay fallback on open transition:', err);
        });
      }
    }
  }, [isOpen]);

  const togglePlayback = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.warn('Sync play toggle error:', err);
          setIsPlaying(false);
        });
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  // Google Drive sharing URL provided by the user
  const DRIVE_SOURCE_URL = 'https://drive.google.com/file/d/18EjjagLe1KRtfqBWELEjvTPQjcFsSxpH/view?usp=sharing';

  // Helper function to extract Google Drive File ID and build the direct playback stream link
  const getDriveStreamUrl = (url: string): string => {
    try {
      const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        return `https://docs.google.com/uc?export=download&id=${match[1]}`;
      }
    } catch (e) {
      console.error('Error parsing drive link:', e);
    }
    // Safe royalty-free / open-source classical back up if parsing fails
    return 'https://upload.wikimedia.org/wikipedia/commons/c/c6/Canon_in_D_Major_%28ISRC_USUAN1100301%29.mp3';
  };

  const streamUrl = getDriveStreamUrl(DRIVE_SOURCE_URL);

  return (
    <>
      {/* Hidden Google Drive direct streaming audio player */}
      <audio ref={audioRef} src={streamUrl} loop preload="auto" />

      {/* Floating Control Button */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed bottom-6 right-6 z-50">
            <motion.button
              id="audio-toggle"
              initial={{ opacity: 0, scale: 0.5, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              onClick={togglePlayback}
              className="w-12 h-12 rounded-full glass-card flex items-center justify-center text-amber-200 shadow-xl cursor-pointer hover:bg-white/20 hover:scale-110 active:scale-95 transition-all focus:outline-none"
              title={isPlaying ? 'Pause Musik' : 'Mainkan Musik'}
            >
              {isPlaying ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                >
                  <Music className="w-5 h-5 text-amber-200" />
                </motion.div>
              ) : (
                <VolumeX className="w-5 h-5 text-neutral-400" />
              )}
            </motion.button>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
