/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GALLERY_PHOTOS } from '../data';

interface BackgroundSlideshowProps {
  currentIdx: number;
}

export default function BackgroundSlideshow({ currentIdx }: BackgroundSlideshowProps) {
  return (
    <div className="fixed inset-0 -z-10 w-screen h-screen overflow-hidden bg-[#fdfaf7] select-none">
      {/* Soft floating background slideshow with 90% opacity (exactly 10% layout color overlap) to let prewedding photos shine */}
      {GALLERY_PHOTOS.map((photo, idx) => (
        <div
          key={idx}
          className="absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-2000 ease-in-out"
          style={{
            backgroundImage: `url(${photo.src})`,
            opacity: idx === currentIdx ? 0.90 : 0,
            filter: 'brightness(1.02) contrast(0.98) saturate(0.9)',
          }}
        />
      ))}

      {/* Extremely subtle Pastel Mesh Radial Gradients (10% or less) over the subtle photos to keep beautiful soft depth */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#ffe4e6]/10 via-[#fef4c5]/8 to-[#ffe4e6]/10 pointer-events-none" />
      <div className="absolute inset-0 bg-radial-gradient-[at_0%_0%] from-[#ffe4e6]/10 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-radial-gradient-[at_100%_0%] from-[#fef3c7]/10 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-radial-gradient-[at_100%_100%] from-[#ffe4e6]/10 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-radial-gradient-[at_0%_100%] from-[#fef3c7]/10 to-transparent pointer-events-none" />

      {/* Beautiful Flower Blobs around corners trimmed down to maintain photo focus */}
      <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] bg-red-300/5 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[500px] h-[500px] bg-amber-200/5 rounded-full blur-[90px] pointer-events-none" />
    </div>
  );
}
