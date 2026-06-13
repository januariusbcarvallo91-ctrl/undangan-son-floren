/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { Send, MessageSquare, Check, Loader2 } from 'lucide-react';
import { Wish } from '../types';

export default function RSVPSection() {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [name, setName] = useState('');
  const [status, setStatus] = useState<'Hadir' | 'Tidak Hadir' | ''>('');
  const [wishText, setWishText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingFeed, setIsLoadingFeed] = useState(true);

  // Load wishes
  useEffect(() => {
    fetchWishes();
  }, []);

  const fetchWishes = async () => {
    try {
      setIsLoadingFeed(true);
      const res = await fetch('/api/wishes');
      if (res.ok) {
        const data = await res.json();
        setWishes(data);
      } else {
        throw new Error('Failed to fetch from backend API');
      }
    } catch (err) {
      console.warn('Wishes API fetch failed, loading fallback from localStorage:', err);
      // Fallback: localStorage
      const cached = localStorage.getItem('wishes_fallback');
      if (cached) {
        setWishes(JSON.parse(cached));
      } else {
        // Initial Seed
        const defaults: Wish[] = [
          {
            name: 'Pastor Bobby, Pr',
            status: 'Hadir',
            wish: 'Selamat atas Sakramen Pernikahan Suci bagi Son dan Floren. Semoga Kasih Kristus selalu merajai bahtera rumah tangga kalian, membawa damai sejahtera dan berkat melimpah sampai akhir hayat.',
            timestamp: new Date(Date.now() - 72000000).toISOString()
          },
          {
            name: 'Ibu Karlinda Kewa & Keluarga',
            status: 'Hadir',
            wish: 'Turut bersuka cita atas dipersatukannya kedua mempelai. Floren sayang dan Son ganteng, jadilah terang bagi sesama dan pasangan yang terus saling menguatkan dalam ikatan suci ini.',
            timestamp: new Date(Date.now() - 18000000).toISOString()
          },
          {
            name: 'Rofinus Rehi Unarajan',
            status: 'Hadir',
            wish: 'Selamat menempuh hidup baru adikku Son dan istri tercinta Floren. Sukses selalu, semoga cepat diberikan buah hati penggembira rumah tangga.',
            timestamp: new Date(Date.now() - 3600000).toISOString()
          }
        ];
        localStorage.setItem('wishes_fallback', JSON.stringify(defaults));
        setWishes(defaults);
      }
    } finally {
      setIsLoadingFeed(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !status || !wishText.trim()) return;

    setIsSubmitting(true);
    const payload = {
      name: name.trim(),
      status: status,
      wish: wishText.trim()
    };

    try {
      const res = await fetch('/api/wishes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const newWish = await res.json();
        setWishes((prev) => [newWish, ...prev]);
        setName('');
        setStatus('');
        setWishText('');
        alert('Terima kasih! Ucapan Anda telah berhasil dikirim.');
      } else {
        throw new Error('Failed to submit wish');
      }
    } catch (err) {
      console.error('API submission failed. saving to localStorage fallback:', err);
      // Fallback submission
      const newWish: Wish = {
        name: payload.name,
        status: payload.status,
        wish: payload.wish,
        timestamp: new Date().toISOString()
      };
      const updated = [newWish, ...wishes];
      setWishes(updated);
      localStorage.setItem('wishes_fallback', JSON.stringify(updated));

      setName('');
      setStatus('');
      setWishText('');
      alert('Terima kasih! Ucapan Anda telah disimpan secara lokal (Offline Mode).');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper date formatter
  const formatDateStr = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }) + ' WITA';
    } catch {
      return 'Baru saja';
    }
  };

  return (
    <div className="w-full text-center">
      <div className="mb-8">
        <Send className="w-8 h-8 text-brand-mocha/70 mx-auto mb-3" />
        <h2 className="font-serif text-3xl text-brand-mocha text-shadow-sm font-semibold">Konfirmasi Kehadiran</h2>
        <p className="text-xs text-brand-brown/85 mt-2 text-shadow-sm max-w-sm mx-auto font-medium leading-relaxed">
          Bantu kami mempersiapkan jamuan terbaik dengan mengisi form di bawah ini
        </p>
      </div>

      {/* Input Form Card */}
      <div className="glass-card p-6 mb-10 text-left !rounded-3xl border-white/50 bg-white/20 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-brand-brown/95 mb-1.5 text-shadow-sm">
              Nama Anda
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masukkan nama lengkap"
              required
              className="w-full px-4 py-3 bg-white/45 border border-brand-mocha/25 rounded-2xl text-sm text-brand-brown placeholder-brand-brown/50 focus:outline-none focus:border-brand-mocha focus:ring-1 focus:ring-brand-mocha transition duration-300"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-brand-brown/95 mb-1.5 text-shadow-sm">
              Konfirmasi Kehadiran
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as 'Hadir' | 'Tidak Hadir' | '')}
              required
              className="w-full px-4 py-3 bg-white/45 border border-brand-mocha/25 rounded-2xl text-sm text-brand-brown focus:outline-none focus:border-brand-mocha focus:ring-1 focus:ring-brand-mocha transition duration-300 appearance-none cursor-pointer"
            >
              <option value="" className="text-neutral-700">— Pilih Status —</option>
              <option value="Hadir" className="text-neutral-900">Saya Akan Hadir</option>
              <option value="Tidak Hadir" className="text-neutral-900">Maaf, Tidak Bisa Hadir</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-brand-brown/95 mb-1.5 text-shadow-sm">
              Ucapan &amp; Doa Restu (Wedding Wish)
            </label>
            <textarea
              value={wishText}
              onChange={(e) => setWishText(e.target.value)}
              placeholder="Tuliskan doa indah Anda untuk kedua mempelai..."
              required
              rows={4}
              className="w-full px-4 py-3 bg-white/45 border border-brand-mocha/25 rounded-2xl text-sm text-brand-brown placeholder-brand-brown/50 focus:outline-none focus:border-brand-mocha focus:ring-1 focus:ring-brand-mocha transition duration-300 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full cursor-pointer bg-brand-mocha hover:bg-brand-brown text-white font-semibold text-sm py-3.5 rounded-2xl shadow-md transition transform active:scale-95 flex items-center justify-center gap-2 duration-300"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                Mengisi Ucapan...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 text-white" />
                Kirim Ucapan
              </>
            )}
          </button>
        </form>
      </div>

      {/* Feed Area */}
      <div className="text-left">
        <h3 className="font-serif text-xl text-brand-mocha mb-4 flex items-center gap-2 text-shadow-sm font-semibold">
          <MessageSquare className="w-5 h-5 text-brand-mocha/70" /> Doa Restu Para Tamu
        </h3>

        {/* Wishes listing */}
        <div className="custom-scrollbar max-h-80 overflow-y-auto space-y-3 pr-2 border-t border-brand-mocha/20 pt-4" id="wishes-box">
          {isLoadingFeed ? (
            <div className="text-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-brand-mocha mx-auto" />
              <p className="text-xs text-brand-brown/80 mt-2">Memuat ucapan...</p>
            </div>
          ) : wishes.length === 0 ? (
            <p className="text-xs text-brand-brown/80 text-center py-8 font-medium">
              Belum ada ucapan. Jadilah yang pertama memberikan doa restu!
            </p>
          ) : (
            wishes.map((w, idx) => (
              <div
                key={w.id || idx}
                className="glass-card p-4 !rounded-2xl border-white/55 bg-white/20 transition duration-500 hover:bg-white/35 shadow-sm"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div>
                    <h5 className="text-xs font-bold text-brand-mocha text-shadow-sm">{w.name}</h5>
                    <span className="text-[8px] text-brand-brown/70 block mt-0.5">{formatDateStr(w.timestamp)}</span>
                  </div>
                  <span
                    className={`inline-flex items-center text-[9px] font-bold border px-2.5 py-0.5 rounded-full ${
                      w.status === 'Hadir'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-stone-50 text-stone-600 border-stone-200'
                    }`}
                  >
                    {w.status === 'Hadir' && <Check className="w-2.5 h-2.5 mr-1 text-emerald-600" />}
                    {w.status}
                  </span>
                </div>
                <p className="text-xs text-brand-brown/90 leading-relaxed italic text-shadow-sm font-medium mt-1.5">
                  "{w.wish}"
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
