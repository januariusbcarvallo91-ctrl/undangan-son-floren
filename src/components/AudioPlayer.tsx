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

const SOURCES = [
  '/mari-menua-bersama.mp3',
  '/wedding-song.mp3',
  '/api/audio',
  'https://upload.wikimedia.org/wikipedia/commons/c/c6/Canon_in_D_Major_%28ISRC_USUAN1100301%29.mp3'
];

export default function AudioPlayer({ isOpen }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sourceIndex, setSourceIndex] = useState(0);

  // Play audio when invitation is opened
  useEffect(() => {
    if (isOpen) {
      setIsPlaying(true);
      if (audioRef.current) {
        audioRef.current.play().catch((err) => {
          console.warn('Autoplay blocked on start:', err);
          setIsPlaying(false);
        });
      }
    }
  }, [isOpen]);

  // Handle active music player state changes
  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.play().catch((err) => {
        console.warn('Playback block failed:', err);
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, sourceIndex]);

  // Explicitly reload and play when source index changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch((err) => {
          console.warn('Autoplay on source change failed:', err);
        });
      }
    }
  }, [sourceIndex]);

  const togglePlayback = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleAudioError = () => {
    console.warn(`Audio error for source ${SOURCES[sourceIndex]}. Loading next fallback...`);
    if (sourceIndex < SOURCES.length - 1) {
      setSourceIndex((prev) => prev + 1);
    }
  };

  return (
    <>
      {/* Hidden local/network audio player */}
      <audio
        ref={audioRef}
        src={SOURCES[sourceIndex]}
        onError={handleAudioError}
        loop
        preload="auto"
      />

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
