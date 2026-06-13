/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import {
  MessageSquare,
  Copy,
  Check,
  Send,
  Users,
  User,
  Sliders,
  ExternalLink,
  Plus,
  Trash2,
  Download,
} from 'lucide-react';
import ScrollSection from './ScrollSection';

export default function WhatsAppGenerator() {
  const [activeTab, setActiveTab] = useState<'individual' | 'bulk'>('individual');
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Template state
  const [template, setTemplate] = useState(
    `Shalom / Selamat Pagi/Siang/Sore,\n\nTanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i *[NAMA]* untuk menghadiri acara Pernikahan kami, *Son & Floren*.\n\nBerikut tautan undangan digital kami untuk informasi lebih lengkap mengenai lokasi, waktu, dan RSVP:\n\n[LINK]\n\nMerupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan untuk hadir memberikan doa restu.\n\nTerima kasih banyak.\n\nSalam hangat,\n*Son & Floren*`
  );

  // Individual Form States
  const [singleName, setSingleName] = useState('');
  const [singlePhone, setSinglePhone] = useState('');

  // Bulk Form States
  const [bulkInput, setBulkInput] = useState("Keluarga besar Luron\nKeluarga besar Koten\nSahabat Kuliah Son\nTeman Kerja Floren\nBapak Lambertus Nara Buran\nIbu Kristina Watun");
  const [bulkPhoneNumbers, setBulkPhoneNumbers] = useState(''); // comma/space separated or lines matching guest count
  const [bulkGuests, setBulkGuests] = useState<{ id: string; name: string; phone: string }[]>([]);

  // Base URL resolution
  const [baseUrl, setBaseUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = window.location.protocol + '//' + window.location.host + window.location.pathname;
      setBaseUrl(url);
    }
  }, []);

  // Sync bulk inputs to parsed guests array
  useEffect(() => {
    const names = bulkInput
      .split('\n')
      .map((n) => n.trim())
      .filter((n) => n.length > 0);
    
    const phones = bulkPhoneNumbers
      .split('\n')
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    const parsed = names.map((name, index) => ({
      id: `${index}-${name}`,
      name,
      phone: formatPhoneNumber(phones[index] || ''),
    }));

    setBulkGuests(parsed);
  }, [bulkInput, bulkPhoneNumbers]);

  const formatPhoneNumber = (num: string) => {
    let clean = num.replace(/[^0-9]/g, '');
    if (clean.startsWith('08')) {
      clean = '628' + clean.slice(2);
    } else if (clean.startsWith('8')) {
      clean = '628' + clean.slice(1);
    }
    return clean;
  };

  const getGuestLink = (name: string) => {
    const encodedName = encodeURIComponent(name);
    return `${baseUrl}?to=${encodedName}`;
  };

  const getMessageForGuest = (name: string) => {
    const link = getGuestLink(name);
    return template.replace(/\[NAMA\]/g, name).replace(/\[LINK\]/g, link);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleSendWA = (name: string, phone: string) => {
    const text = getMessageForGuest(name);
    const formattedPhone = formatPhoneNumber(phone);
    const url = `https://api.whatsapp.com/send?${formattedPhone ? `phone=${formattedPhone}&` : ''}text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleCopyAllBulk = () => {
    const allRecords = bulkGuests
      .map((g, idx) => `No. ${idx + 1}\nNama: ${g.name}\nLink: ${getGuestLink(g.name)}\n-----------------`)
      .join('\n\n');
    navigator.clipboard.writeText(allRecords);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2500);
  };

  return (
    <ScrollSection variant="scale" className="glass-card p-6 sm:p-8 border-white/55 bg-white/20 shadow-sm">
      <div className="text-center mb-6">
        <MessageSquare className="w-7 h-7 text-brand-mocha/60 mx-auto mb-2" />
        <h2 className="font-serif text-3xl text-brand-mocha font-semibold text-shadow-sm">Generator Undangan WA</h2>
        <div className="w-12 h-[1px] bg-brand-mocha/25 mx-auto mt-3" />
        <p className="text-xs text-brand-brown/85 mt-2 leading-relaxed max-w-xs mx-auto font-medium">
          Kelola & bagikan link undangan personal Son & Floren langsung secara mudah lewat WhatsApp.
        </p>
      </div>

      {!isExpanded ? (
        <div className="flex justify-center mt-2 py-3">
          <button
            type="button"
            onClick={() => setIsExpanded(true)}
            className="flex items-center gap-2.5 px-6 py-3.5 bg-brand-mocha hover:bg-[#5d4037] text-white font-bold rounded-2xl shadow-md transition-all active:scale-95 text-xs sm:text-sm tracking-wide"
          >
            <Sliders className="w-4 h-4" />
            <span>Masuk Kelola & Bagikan Undangan</span>
          </button>
        </div>
      ) : (
        <div className="space-y-6 animate-fade-in">
          {/* Accordion Template Slider */}
          <details className="mb-6 border border-brand-mocha/10 rounded-2xl bg-white/30 backdrop-blur-sm shadow-sm">
            <summary className="flex items-center justify-between p-4 cursor-pointer outline-none select-none text-xs font-bold uppercase tracking-wider text-brand-mocha">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-brand-mocha/70" />
                <span>Kustomisasi Teks Template WA</span>
              </div>
            </summary>
            <div className="p-4 border-t border-brand-mocha/10 space-y-3">
              <p className="text-[10px] text-brand-brown/80 font-medium font-sans">
                Gunakan tag <code className="bg-brand-mocha/10 px-1 py-0.5 rounded text-brand-mocha font-bold">[NAMA]</code> untuk nama tamu, dan <code className="bg-brand-mocha/10 px-1 py-0.5 rounded text-brand-mocha font-bold">[LINK]</code> untuk link undangan digital personal.
              </p>
              <textarea
                rows={5}
                className="w-full text-xs p-3 rounded-xl border border-brand-mocha/15 bg-white/80 text-brand-brown focus:ring-1 focus:ring-brand-mocha focus:outline-none leading-relaxed"
                value={template}
                onChange={(e) => setTemplate(e.target.value)}
              />
            </div>
          </details>

          {/* Tabs */}
          <div className="flex bg-brand-mocha/10 p-1 rounded-xl mb-6 max-w-xs mx-auto">
            <button
              onClick={() => setActiveTab('individual')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'individual'
                  ? 'bg-white text-brand-mocha shadow-sm'
                  : 'text-brand-brown/70 hover:text-brand-mocha'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              Perorangan
            </button>
            <button
              onClick={() => setActiveTab('bulk')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'bulk'
                  ? 'bg-white text-brand-mocha shadow-sm'
                  : 'text-brand-brown/70 hover:text-brand-mocha'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              Masal (Bulk)
            </button>
          </div>

          {/* Individual Tab content */}
          {activeTab === 'individual' && (
            <div className="space-y-4">
              <div className="space-y-3 p-4 bg-white/45 border border-white/55 rounded-2xl shadow-sm text-left">
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-brand-mocha block mb-1">
                    Nama Tamu
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Bapak Lambertus Nara"
                    className="w-full text-xs sm:text-sm p-3 rounded-xl border border-brand-mocha/15 bg-white/85 text-brand-brown font-medium focus:ring-1 focus:ring-brand-mocha focus:outline-none"
                    value={singleName}
                    onChange={(e) => setSingleName(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-brand-mocha block mb-1">
                    No. WhatsApp Tamu (Opsional)
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: 08123456789 atau 628..."
                    className="w-full text-xs sm:text-sm p-3 rounded-xl border border-brand-mocha/15 bg-white/85 text-brand-brown font-medium focus:ring-1 focus:ring-brand-mocha focus:outline-none"
                    value={singlePhone}
                    onChange={(e) => setSinglePhone(e.target.value)}
                  />
                </div>
              </div>

              {singleName.trim() && (
                <div className="p-4 bg-brand-mocha/5 border border-brand-mocha/10 rounded-2xl shadow-sm text-left space-y-3 animate-fade-in">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-brand-mocha block">
                    Hasil Link & Preview Teks
                  </span>
                  <div className="bg-white/80 p-3 rounded-xl border border-brand-mocha/5 text-[11px] font-medium font-mono text-brand-brown overflow-x-auto select-all">
                    {getGuestLink(singleName)}
                  </div>
                  
                  <div className="flex gap-2 justify-end">
                    <button
                      type="button"
                      onClick={() => handleCopy(getGuestLink(singleName), 'single-link')}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-white border border-brand-mocha/20 hover:border-brand-mocha/50 rounded-lg text-brand-mocha font-bold transition-all active:scale-95"
                    >
                      {copiedIndex === 'single-link' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedIndex === 'single-link' ? 'Link Tersalin' : 'Salin Link'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCopy(getMessageForGuest(singleName), 'single-text')}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-white border border-brand-mocha/20 hover:border-brand-mocha/50 rounded-lg text-brand-mocha font-bold transition-all active:scale-95"
                    >
                      {copiedIndex === 'single-text' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedIndex === 'single-text' ? 'Teks Tersalin' : 'Salin Teks'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSendWA(singleName, singlePhone)}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold transition-all hover:shadow active:scale-95"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Kirim Ke WA</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Bulk Tab content */}
          {activeTab === 'bulk' && (
            <div className="space-y-4">
              <div className="p-4 bg-white/45 border border-white/55 rounded-2xl shadow-sm text-left space-y-3">
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-brand-mocha block mb-1">
                    Daftar Nama Tamu (Satu Nama Per Baris)
                  </label>
                  <textarea
                    rows={6}
                    placeholder="Masukkan daftar nama tamu di sini..."
                    className="w-full text-xs p-3 rounded-xl border border-brand-mocha/15 bg-white/85 text-brand-brown font-medium focus:ring-1 focus:ring-brand-mocha focus:outline-none leading-relaxed"
                    value={bulkInput}
                    onChange={(e) => setBulkInput(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-brand-mocha block mb-1">
                    No. WhatsApp Tamu (Opsional, Sejajarkan Dengan Baris Nama)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Contoh:&#10;08123456789&#10;08777722119"
                    className="w-full text-xs p-3 rounded-xl border border-brand-mocha/15 bg-white/85 text-brand-brown font-medium focus:ring-1 focus:ring-brand-mocha focus:outline-none leading-relaxed font-mono"
                    value={bulkPhoneNumbers}
                    onChange={(e) => setBulkPhoneNumbers(e.target.value)}
                  />
                </div>
              </div>

              {bulkGuests.length > 0 && (
                <div className="space-y-3 text-left animate-fade-in">
                  <div className="flex justify-between items-center px-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-brand-mocha">
                      Hasil List Tamu ({bulkGuests.length})
                    </span>
                    <button
                      onClick={handleCopyAllBulk}
                      className="flex items-center gap-1 text-[10px] bg-brand-mocha/10 hover:bg-brand-mocha text-brand-mocha hover:text-white px-2.5 py-1 rounded-lg font-bold transition-all duration-300 active:scale-95"
                    >
                      {copiedAll ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedAll ? 'Daftar Tersalin' : 'Salin Semua Link'}</span>
                    </button>
                  </div>

                  <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                    {bulkGuests.map((guest, idx) => (
                      <div
                        key={guest.id}
                        className="p-3 bg-white/45 hover:bg-white/70 border border-brand-mocha/10 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-2 transition-all shadow-sm"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-brand-mocha/70 font-mono font-bold">
                              #{idx + 1}
                            </span>
                            <p className="font-serif font-bold text-xs text-brand-brown leading-tight">
                              {guest.name}
                            </p>
                          </div>
                          <span className="text-[9px] font-mono font-medium text-brand-brown/60 block mt-0.5 max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">
                            {getGuestLink(guest.name)}
                          </span>
                        </div>

                        <div className="flex gap-1.5 ml-auto md:ml-0 self-end md:self-center">
                          <button
                            title="Salin Link"
                            onClick={() => handleCopy(getGuestLink(guest.name), `${guest.id}-bulk-link`)}
                            className="p-1 px-2 border border-brand-mocha/15 bg-white hover:bg-brand-mocha/5 rounded text-brand-mocha flex items-center gap-1 text-[10px] font-bold transition-all"
                          >
                            {copiedIndex === `${guest.id}-bulk-link` ? (
                              <Check className="w-3 h-3 text-emerald-600 animate-scale-up" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                            <span>{copiedIndex === `${guest.id}-bulk-link` ? 'Link' : 'Link'}</span>
                          </button>

                          <button
                            title="Kirim via WhatsApp"
                            onClick={() => handleSendWA(guest.name, guest.phone)}
                            className="p-1 px-2 border border-emerald-500/10 bg-emerald-600 hover:bg-emerald-700 rounded text-white flex items-center gap-1 text-[10px] font-bold transition-all shadow-sm"
                          >
                            <Send className="w-3 h-3" />
                            <span>Kirim</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Toggle Sembunyikan Button at very bottom of expanded state */}
          <div className="flex justify-center pt-4 border-t border-brand-mocha/10">
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className="px-4 py-2 bg-brand-mocha/10 hover:bg-brand-mocha/20 text-brand-mocha text-xs font-bold rounded-xl transition-all active:scale-95"
            >
              Sembunyikan Pengelola
            </button>
          </div>
        </div>
      )}
    </ScrollSection>
  );
}
