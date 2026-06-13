/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CoupleDetails, AgendaEvent, GalleryPhoto } from './types';

export const GROOM_DATA: CoupleDetails = {
  name: 'Son',
  fullName: 'Elias Dominikus Laba Unarajan, S.Ak.',
  parents: {
    father: 'Bapak Lambertus Laga Unarajan',
    mother: 'Almh. Ibu Maria Luo Tapun'
  },
  photoUrl: 'https://lh3.googleusercontent.com/d/1j30f16QT-LgwA43TpBC4gBL3rnqfemtY',
  role: 'groom'
};

export const BRIDE_DATA: CoupleDetails = {
  name: 'Floren',
  fullName: 'Florensia Uba Ruron, S.Kep., Ners',
  parents: {
    father: 'Bapak David Malik Ruron',
    mother: 'Ibu Agustina Oren Koten'
  },
  photoUrl: 'https://lh3.googleusercontent.com/d/1omr1aWiW_SjwKE9dsNMCvgkMNYSjTI32',
  role: 'bride'
};

export const WEDDING_DATE = new Date('2026-07-03T09:00:00+08:00'); // July 3rd, 2026, 09.00 WITA

export const AGENDA_EVENTS: AgendaEvent[] = [
  {
    title: 'Pemberkatan Nikah',
    date: 'Jumat, 03 Juli 2026',
    time: '09.00 WITA',
    locationName: 'Gereja St. Fransiskus De Sales-Pada, Lewoleba, Lembata NTT',
    mapLink: 'https://maps.google.com/?q=Gereja+St.+Fransiskus+De+Sales+Lewoleba'
  },
  {
    title: 'Resepsi Pernikahan',
    date: 'Jumat, 03 Juli 2026',
    time: '19.00 WITA s/d Selesai',
    locationName: 'Rumah Kediaman Bapak David Malik Ruron, Desa Pada, Lorong Masuk Gereja Katolik, Sebelah Timur Lapangan Bola Kaki',
    mapLink: 'https://maps.google.com/?q=Lapangan+Bola+Kaki+Desa+Pada+Lewoleba'
  }
];

export const GALLERY_PHOTOS: GalleryPhoto[] = [
  { src: 'https://lh3.googleusercontent.com/d/1-CxEgYYelkxG2w2rEuycmiOa4gd8RQ6z', alt: 'Prewedding Portrait' },
  { src: 'https://lh3.googleusercontent.com/d/1Fz6KKTW90IVxo9FZlJRZZ1OcI01Tsi3i', alt: 'Captured Moments' },
  { src: 'https://lh3.googleusercontent.com/d/1kut7EeY1s6K8cqcaBxbG8HENMzPMYoDh', alt: 'Saling Menjaga' },
  { src: 'https://lh3.googleusercontent.com/d/1fRVivxZCq97vuhTR0405Ulw3-OQeec31', alt: 'Janji Suci' },
  { src: 'https://lh3.googleusercontent.com/d/10BASTS3j42xr3tXtkoACtIyK_EneW_Vx', alt: 'Senyum Bahagia' },
  { src: 'https://lh3.googleusercontent.com/d/1UFS9MLz_uXsY2_vcK4l5FUXCeGdQ2Z8D', alt: 'Kebersamaan Indah' },
  { src: 'https://lh3.googleusercontent.com/d/1T7scDhmFQ-ZYGFDMr8gMK_h8lX4kwh4p', alt: 'Genggaman Kasih' },
  { src: 'https://lh3.googleusercontent.com/d/1cWrbSB_JCISH_ULbgzbcvn_eQUr0kmNg', alt: 'Tatapan Penuh Makna' },
  { src: 'https://lh3.googleusercontent.com/d/1PW4Wpuk6F9NGMgd0kQcbJCAPGRmw82-p', alt: 'Langkah Bersama' }
];

export const COVER_PHOTO = 'https://lh3.googleusercontent.com/d/1fKlcFljx0ho6wh_GUj0bephYmjX2tZBH';
export const AUDIO_BG_MUSIC = '/api/audio';

export const LOVE_STORIES: string[] = []; // No love story section is displayed in the source site's live hierarchy

export const GOOGLE_CALENDAR_LINK = 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Pernikahan+Son+%26+Floren&dates=20260703T010000Z%2F20260703T140000Z&details=Pernikahan+Elias+Dominikus+Laba+Unarajan+%28Son%29+%26+Florensia+Uba+Ruron+%28Floren%29.%0A%0APemberkatan+Nikah%3A+09.00+WITA+di+Gereja+St.+Fransiskus+De+Sales-Pada.%0AResepsi%3A+19.00+WITA+di+Rumah+Kediaman+Bapak+David+Malik+Ruron.&location=Gereja+St.+Fransiskus+De+Sales-Pada&sf=true&output=xml';

export const TURUT_MENGUNDANG = {
  groom: [
    'Rofinus Rehi Unarajan',
    'Karolus Tada Unarajan',
    'Yohanes Laga Tapun',
    'Philipus Bala Tapun',
    'Serta segenap Keluarga Besar Unarajan and Suku Tapun'
  ],
  bride: [
    'Lambertus Nara Buran',
    'Kristina Watun',
    'Thobias Tobi Koten',
    'Adrianus Basa Koten',
    'Hubertus Terong Koten',
    'Marselinus Kolo Luron',
    'Simon Petrus Luron',
    'Damianus Bala Luron',
    'Serta segenap Keluarga Besar Luron dan Koten'
  ]
};

export const BIBLE_VERSE = `“Jika kita saling mengasihi,
Allah tinggal dalam kita dan cinta Kasihnya
Menjadi sempurna dalam diri kita”`;
export const BIBLE_REFERENCE = '(1 Yoh 4:12)';

export const WITNESSES = {
  groomWitness: 'Bapak Optatianus Ndena',
  brideWitness: 'Ibu Karlinda Kewa'
};

export const GIFT_BANKS = [
  {
    bankName: 'BCA',
    accountNumber: '7019019281',
    holderName: 'FLORENSIA UBA RURON',
    type: 'rekening'
  },
  {
    bankName: 'Artha Graha',
    accountNumber: '1078749381',
    holderName: 'FLORENSIA UBA RURON',
    type: 'rekening'
  },
  {
    bankName: 'BRI',
    accountNumber: '176501002943502',
    holderName: 'FLORENSIA UBA RURON',
    type: 'rekening'
  }
];
