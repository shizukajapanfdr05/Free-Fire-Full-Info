import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { SearchForm } from './components/SearchForm';
import { PlayerCard } from './components/PlayerCard';
import { ApiKeyModal } from './components/ApiKeyModal';
import { FreeFirePlayerResponse, RecentSearchItem } from './types';
import {
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ShieldAlert,
  Flame,
  Globe2,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';

const DEFAULT_API_KEY = 'shizuka_ff_main_api:FFINFO:G9L';
const DEFAULT_DEMO_UID = '8832151462';
const DEFAULT_REGION = 'IND';
const STORAGE_HISTORY_KEY = 'ff_search_history_v1';
const STORAGE_KEY_KEY = 'ff_custom_key_v1';

export default function App() {
  const [playerData, setPlayerData] = useState<FreeFirePlayerResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeRegion, setActiveRegion] = useState<string>(DEFAULT_REGION);
  const [currentUid, setCurrentUid] = useState<string>(DEFAULT_DEMO_UID);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState<boolean>(false);
  const [customApiKey, setCustomApiKey] = useState<string>('');
  const [recentSearches, setRecentSearches] = useState<RecentSearchItem[]>([]);

  // Initialize saved key & history from localStorage
  useEffect(() => {
    try {
      const savedKey = localStorage.getItem(STORAGE_KEY_KEY);
      if (savedKey) {
        setCustomApiKey(savedKey);
      }

      const savedHistory = localStorage.getItem(STORAGE_HISTORY_KEY);
      if (savedHistory) {
        setRecentSearches(JSON.parse(savedHistory));
      }
    } catch {
      // Ignore storage errors in restricted contexts
    }
  }, []);

  const saveRecentSearch = useCallback((uid: string, region: string, data?: FreeFirePlayerResponse) => {
    setRecentSearches((prev) => {
      const filtered = prev.filter((item) => !(item.uid === uid && item.region === region));
      const newItem: RecentSearchItem = {
        uid,
        region,
        nickname: data?.basicInfo?.nickname,
        level: data?.basicInfo?.level,
        timestamp: Date.now(),
      };
      const updated = [newItem, ...filtered].slice(0, 10);
      try {
        localStorage.setItem(STORAGE_HISTORY_KEY, JSON.stringify(updated));
      } catch {
        // Ignore storage exceptions
      }
      return updated;
    });
  }, []);

  const handleClearHistory = () => {
    setRecentSearches([]);
    try {
      localStorage.removeItem(STORAGE_HISTORY_KEY);
    } catch {
      // Ignore
    }
  };

  const handleSaveApiKey = (key: string) => {
    const trimmed = key.trim();
    setCustomApiKey(trimmed);
    try {
      if (trimmed && trimmed !== DEFAULT_API_KEY) {
        localStorage.setItem(STORAGE_KEY_KEY, trimmed);
      } else {
        localStorage.removeItem(STORAGE_KEY_KEY);
      }
    } catch {
      // Ignore
    }
  };

  const fetchPlayerData = useCallback(
    async (uid: string, region: string) => {
      setIsLoading(true);
      setErrorMessage(null);
      setCurrentUid(uid);
      setActiveRegion(region);

      try {
        const queryParams = new URLSearchParams({
          uid: uid.trim(),
          region: region.trim().toUpperCase(),
        });

        if (customApiKey && customApiKey !== DEFAULT_API_KEY) {
          queryParams.set('key', customApiKey);
        }

        const response = await fetch(`/api/player-info?${queryParams.toString()}`);
        const result = await response.json();

        if (!response.ok || result.error) {
          throw new Error(
            result.error || `Unable to find Free Fire account with UID: ${uid} in server ${region}.`
          );
        }

        setPlayerData(result);
        saveRecentSearch(uid, region, result);
      } catch (err: unknown) {
        const error = err as Error;
        setErrorMessage(
          error.message || 'An unexpected error occurred while communicating with the Free Fire API.'
        );
        setPlayerData(null);
      } finally {
        setIsLoading(false);
      }
    },
    [customApiKey, saveRecentSearch]
  );

  // Auto-fetch the initial demo account on first mount
  useEffect(() => {
    fetchPlayerData(DEFAULT_DEMO_UID, DEFAULT_REGION);
  }, [fetchPlayerData]);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Navbar */}
      <Header
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        apiKeyCustomized={Boolean(customApiKey && customApiKey !== DEFAULT_API_KEY)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Intro banner */}
        <div className="space-y-1 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Flame className="w-3.5 h-3.5 fill-amber-500/30" />
            <span>Official Garena Free Fire Player API</span>
          </div>
          <h1 className="font-display font-black text-2xl sm:text-4xl text-white tracking-wide">
            Free Fire Player Data Tracker
          </h1>
          <p className="text-neutral-400 text-xs sm:text-sm max-w-2xl leading-relaxed">
            Apna Free Fire UID aur Server (Region) daliye aur player ka complete live data fetch karein —
            NickName, Level, BR Rank points, CS Rank stars, Guild info, Pet details aur bio.
          </p>
        </div>

        {/* Search Panel */}
        <SearchForm
          onSearch={(uid, region) => fetchPlayerData(uid, region)}
          isLoading={isLoading}
          recentSearches={recentSearches}
          onClearHistory={handleClearHistory}
          activeRegion={activeRegion}
          setActiveRegion={setActiveRegion}
        />

        {/* Loading Skeleton */}
        {isLoading && (
          <div className="w-full space-y-4 animate-pulse">
            <div className="p-8 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 rounded-2xl bg-neutral-800/80" />
                <div className="space-y-3 flex-1">
                  <div className="h-7 w-48 bg-neutral-800 rounded" />
                  <div className="h-4 w-32 bg-neutral-800/60 rounded" />
                  <div className="h-2 w-64 bg-neutral-800/40 rounded-full" />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="h-32 bg-neutral-900/50 rounded-2xl border border-neutral-800/60" />
              <div className="h-32 bg-neutral-900/50 rounded-2xl border border-neutral-800/60" />
              <div className="h-32 bg-neutral-900/50 rounded-2xl border border-neutral-800/60" />
            </div>
          </div>
        )}

        {/* Error State */}
        {!isLoading && errorMessage && (
          <div
            id="error-banner"
            className="p-6 rounded-2xl bg-rose-950/20 border border-rose-500/30 text-rose-200 space-y-4 shadow-xl"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 shrink-0">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h2 className="font-display font-bold text-lg text-rose-300">
                  Player Data Not Found
                </h2>
                <p className="text-sm text-rose-200/80 leading-relaxed">
                  {errorMessage}
                </p>
              </div>
            </div>

            <div className="p-4 bg-neutral-950/60 border border-neutral-800 rounded-xl space-y-2 text-xs text-neutral-300">
              <div className="font-semibold text-neutral-200 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-amber-400" />
                <span>Tips to resolve:</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-neutral-400">
                <li>Check if the UID is typed accurately without spaces (e.g. <code>{currentUid}</code>).</li>
                <li>
                  Verify the Server / Region: Free Fire accounts belong to specific servers (IND, BD, PK, BR, US, SG, etc.).
                </li>
                <li>If the player changed regions or the server is updating, retry after a few moments.</li>
              </ul>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => fetchPlayerData(DEFAULT_DEMO_UID, DEFAULT_REGION)}
                className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 text-xs font-medium flex items-center gap-1.5 transition-colors border border-neutral-800"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                <span>Load Sample UID (8832151462)</span>
              </button>
            </div>
          </div>
        )}

        {/* Player Profile Result Card */}
        {!isLoading && !errorMessage && playerData && (
          <PlayerCard
            data={playerData}
            onRefresh={() => fetchPlayerData(currentUid, activeRegion)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-900 bg-neutral-950 py-6 mt-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-500">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-neutral-300">
              FREE FIRE PLAYER INFO
            </span>
            <span>•</span>
            <span>Powered by SiamBhau API</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-neutral-400">Region: {activeRegion}</span>
            <span>•</span>
            <span className="text-emerald-500 font-mono">Status: Connected</span>
          </div>
        </div>
      </footer>

      {/* API Key Settings Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        currentKey={customApiKey || DEFAULT_API_KEY}
        onSaveKey={handleSaveApiKey}
        defaultKey={DEFAULT_API_KEY}
      />
    </div>
  );
}
