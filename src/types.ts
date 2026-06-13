/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Wish {
  id?: string;
  name: string;
  status: 'Hadir' | 'Tidak Hadir';
  wish: string;
  timestamp: string;
}

export interface CoupleDetails {
  name: string;
  fullName: string;
  parents: {
    father: string;
    mother: string;
  };
  photoUrl: string;
  role: 'groom' | 'bride';
}

export interface AgendaEvent {
  title: string;
  date: string;
  time: string;
  locationName: string;
  mapLink: string;
}

export interface GalleryPhoto {
  src: string;
  alt: string;
}
