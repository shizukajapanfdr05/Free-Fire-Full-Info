import React, { useState } from 'react';
import { Search, Globe, User, Clock, Trash2, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { POPULAR_REGIONS } from '../utils/freefire';
import { RecentSearchItem } from '../types';

interface SearchFormProps {
  onSearch: (uid: string, region: string) => void;
  isLoading: boolean;
  recentSearches: RecentSearchItem[];
  onClearHistory: () => void;
  activeRegion: string;
  setActiveRegion: (region: string) => void;
}

export const SearchForm: React.FC<SearchFormProps> = ({
  onSearch,
  isLoading,
  recentSearches,
  onClearHistory,
  activeRegion,
  setActiveRegion,
}) => {
  const [uid, setUid] = useState('');
  const [inputError, setInputError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUid = uid.trim();

    if (!cleanUid) {
      setInputError('Please enter a Free Fire Player UID');
      return;
    }

    if (!/^\d{5,15}$/.test(cleanUid)) {
      setInputError('UID usually consists of 6 to 12 digits (numbers only)');
      return;
    }

    setInputError('');
    onSearch(cleanUid, activeRegion);
  };

  const handleSelectDemo = (demoUid: string, demoRegion: string) => {
    setUid(demoUid);
    setActiveRegion(demoRegion);
    setInputError('');
    onSearch(demoUid, demoRegion);
  };

  return (
    <div className="w-full bg-neutral-900/90 border border-neutral-800 rounded-2xl p-4 sm:p-6 shadow-xl relative overflow-hidden">
      {/* Background Accent glow */}
      <div className="absolute -right-16 -top-16 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-orange-600/5 rounded-full blur-3xl pointer-events-none" />

      <form onSubmit={handleSubmit} className="relative z-10 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* UID Input */}
          <div className="flex-1 relative">
            <label
              htmlFor="uid-input"
              className="block text-xs font-semibold text-neutral-400 mb-1.5 uppercase tracking-wider flex items-center justify-between"
            >
              <span>Player UID</span>
              <span className="text-[11px] font-normal text-neutral-500 lowercase">
                e.g. 8832151462
              </span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                <User className="w-4 h-4 text-amber-500" />
              </div>
              <input
                id="uid-input"
                type="text"
                value={uid}
                onChange={(e) => {
                  setUid(e.target.value);
                  if (inputError) setInputError('');
                }}
                placeholder="Enter Free Fire Account UID..."
                className="w-full pl-10 pr-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 font-mono text-sm tracking-wide transition-all"
                disabled={isLoading}
              />
              {uid && (
                <button
                  type="button"
                  onClick={() => setUid('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-neutral-500 hover:text-neutral-300"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Region / Server Selector */}
          <div className="w-full sm:w-56">
            <label
              htmlFor="region-select"
              className="block text-xs font-semibold text-neutral-400 mb-1.5 uppercase tracking-wider flex items-center gap-1.5"
            >
              <Globe className="w-3.5 h-3.5 text-amber-500" />
              <span>Server / Region</span>
            </label>
            <div className="relative">
              <select
                id="region-select"
                value={activeRegion}
                onChange={(e) => setActiveRegion(e.target.value)}
                className="w-full py-3 px-3 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-100 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 font-medium text-sm transition-all appearance-none cursor-pointer"
                disabled={isLoading}
              >
                {POPULAR_REGIONS.map((region) => (
                  <option key={region.code} value={region.code} className="bg-neutral-900 text-white">
                    {region.flag} {region.code} — {region.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-neutral-500 text-xs">
                ▼
              </div>
            </div>
          </div>

          {/* Search Button */}
          <div className="sm:self-end">
            <button
              id="search-player-btn"
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto h-[46px] px-6 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 active:scale-[0.98] text-neutral-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed font-display tracking-wider uppercase text-base"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Fetching Data...</span>
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  <span>Fetch Info</span>
                  <ArrowRight className="w-4 h-4 ml-0.5" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Input Validation Error */}
        {inputError && (
          <p className="text-xs text-rose-400 font-medium flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
            {inputError}
          </p>
        )}

        {/* Quick Region Pill Shortcuts */}
        <div className="pt-2 border-t border-neutral-800/60 flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-semibold text-neutral-500 uppercase mr-1">
            Quick Server:
          </span>
          {['IND', 'BD', 'PK', 'BR', 'US', 'ID', 'SG'].map((code) => {
            const region = POPULAR_REGIONS.find((r) => r.code === code);
            const isSelected = activeRegion === code;
            return (
              <button
                key={code}
                type="button"
                onClick={() => setActiveRegion(code)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-sm'
                    : 'bg-neutral-950/60 text-neutral-400 hover:text-neutral-200 border border-neutral-800 hover:border-neutral-700'
                }`}
              >
                {region?.flag} {code}
              </button>
            );
          })}
        </div>

        {/* Quick Demo UIDs */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-400">
          <span className="flex items-center gap-1 text-[11px] uppercase font-semibold text-neutral-500">
            <Sparkles className="w-3 h-3 text-amber-400" />
            Try Sample IDs:
          </span>
          <button
            type="button"
            onClick={() => handleSelectDemo('8832151462', 'IND')}
            className="px-2.5 py-1 rounded-lg bg-neutral-950/80 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-amber-300 font-mono transition-colors text-xs flex items-center gap-1"
          >
            <span>🇮🇳 8832151462 (Master)</span>
          </button>
          <button
            type="button"
            onClick={() => handleSelectDemo('12345678', 'SG')}
            className="px-2.5 py-1 rounded-lg bg-neutral-950/80 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-amber-300 font-mono transition-colors text-xs flex items-center gap-1"
          >
            <span>🇸🇬 12345678 (Classic)</span>
          </button>
        </div>

        {/* Recent Search History */}
        {recentSearches.length > 0 && (
          <div className="pt-2 border-t border-neutral-800/60 flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-semibold text-neutral-500 uppercase flex items-center gap-1">
                <Clock className="w-3 h-3" /> Recent:
              </span>
              {recentSearches.slice(0, 5).map((item) => (
                <button
                  key={`${item.uid}-${item.region}`}
                  type="button"
                  onClick={() => handleSelectDemo(item.uid, item.region)}
                  className="px-2.5 py-0.5 rounded-md bg-neutral-950 border border-neutral-800/80 hover:border-amber-500/40 text-neutral-300 hover:text-white text-xs font-mono transition-all flex items-center gap-1.5"
                >
                  <span className="text-[10px] text-neutral-500 font-sans">{item.region}</span>
                  <span>{item.nickname ? item.nickname.slice(0, 10) : item.uid}</span>
                  {item.level && (
                    <span className="text-[10px] px-1 py-0.2 bg-neutral-800 rounded text-amber-400 font-sans">
                      Lv.{item.level}
                    </span>
                  )}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={onClearHistory}
              className="text-[11px] text-neutral-500 hover:text-rose-400 flex items-center gap-1 transition-colors"
              title="Clear Search History"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear</span>
            </button>
          </div>
        )}
      </form>
    </div>
  );
};
