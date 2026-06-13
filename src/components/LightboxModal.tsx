/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { GALLERY_PHOTOS } from '../data';

interface LightboxModalProps {
  isOpen: boolean;
  photoIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function LightboxModal({
  isOpen,
  photoIndex,
  onClose,
  onNext,
  onPrev,
}: LightboxModalProps) {
  const [imgOpacity, setImgOpacity] = useState(1);
  const currentPhoto = GALLERY_PHOTOS[photoIndex];

  // Intercept keyboard arrow presses
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        triggerNavigation(onNext);
      } else if (e.key === 'ArrowLeft') {
        triggerNavigation(onPrev);
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, photoIndex, onNext, onPrev, onClose]);

  // Lock scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const triggerNavigation = (navAction: () => void) => {
    setImgOpacity(0);
    setTimeout(() => {
      navAction();
      setImgOpacity(1);
    }, 150);
  };

  if (!isOpen || !currentPhoto) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-md transition-opacity duration-300"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-white hover:text-amber-200 text-3xl font-light cursor-pointer z-50 focus:outline-none p-2 rounded-full"
        >
          <X className="w-8 h-8" />
        </button>

        {/* Previous Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            triggerNavigation(onPrev);
          }}
          className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-all duration-300 z-50 focus:outline-none"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Next Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            triggerNavigation(onNext);
          }}
          className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-all duration-300 z-50 focus:outline-none"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Image Display */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="max-w-[85vw] max-h-[80vh] flex items-center justify-center p-4 relative"
        >
          <img
            id="lightbox-img"
            src={currentPhoto.src}
            alt={currentPhoto.alt}
            style={{ opacity: imgOpacity }}
            className="max-width-full max-height-full object-contain rounded-lg shadow-2xl transition-all duration-150 ease-out max-w-full max-h-[75vh]"
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
