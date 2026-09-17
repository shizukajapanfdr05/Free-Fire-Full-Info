import { ServerRegionOption } from '../types';

export const POPULAR_REGIONS: ServerRegionOption[] = [
  { code: 'IND', name: 'India', flag: '🇮🇳' },
  { code: 'BD', name: 'Bangladesh', flag: '🇧🇩' },
  { code: 'PK', name: 'Pakistan', flag: '🇵🇰' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
  { code: 'US', name: 'North America (US)', flag: '🇺🇸' },
  { code: 'ID', name: 'Indonesia', flag: '🇮🇩' },
  { code: 'VN', name: 'Vietnam', flag: '🇻🇳' },
  { code: 'TH', name: 'Thailand', flag: '🇹🇭' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬' },
  { code: 'ME', name: 'Middle East', flag: '🇸🇦' },
  { code: 'EU', name: 'Europe', flag: '🇪🇺' },
  { code: 'RU', name: 'Russia', flag: '🇷🇺' },
  { code: 'SAC', name: 'South America', flag: '🌎' },
  { code: 'TW', name: 'Taiwan', flag: '🇹🇼' },
];

export function getRegionInfo(code: string): ServerRegionOption {
  const upper = code.toUpperCase();
  const match = POPULAR_REGIONS.find((r) => r.code === upper);
  if (match) return match;
  return { code: upper, name: upper, flag: '🌐' };
}

export interface RankDetails {
  name: string;
  tier: string;
  color: string;
  bgGradient: string;
  borderColor: string;
}

export function getBrRankDetails(points?: number, rankId?: number): RankDetails {
  const pts = points || 0;
  if (pts >= 6000 || rankId === 326) {
    return {
      name: 'Grandmaster',
      tier: 'Top Tier',
      color: 'text-rose-400',
      bgGradient: 'from-rose-950/50 to-red-900/30',
      borderColor: 'border-rose-500/40',
    };
  }
  if (pts >= 3600 || rankId === 321 || rankId === 322 || rankId === 323) {
    return {
      name: 'Master',
      tier: 'Elite Master',
      color: 'text-amber-400',
      bgGradient: 'from-amber-950/50 to-yellow-900/30',
      borderColor: 'border-amber-500/40',
    };
  }
  if (pts >= 3200 || (rankId && rankId >= 317 && rankId <= 320)) {
    return {
      name: 'Heroic',
      tier: 'Heroic Tier',
      color: 'text-red-400',
      bgGradient: 'from-red-950/50 to-orange-900/30',
      borderColor: 'border-red-500/40',
    };
  }
  if (pts >= 2600 || (rankId && rankId >= 313 && rankId <= 316)) {
    return {
      name: 'Diamond',
      tier: 'Diamond IV',
      color: 'text-cyan-400',
      bgGradient: 'from-cyan-950/50 to-blue-900/30',
      borderColor: 'border-cyan-500/40',
    };
  }
  if (pts >= 2100 || (rankId && rankId >= 309 && rankId <= 312)) {
    return {
      name: 'Platinum',
      tier: 'Platinum',
      color: 'text-teal-400',
      bgGradient: 'from-teal-950/50 to-emerald-900/30',
      borderColor: 'border-teal-500/40',
    };
  }
  if (pts >= 1600 || (rankId && rankId >= 305 && rankId <= 308)) {
    return {
      name: 'Gold',
      tier: 'Gold',
      color: 'text-yellow-400',
      bgGradient: 'from-yellow-950/50 to-amber-900/30',
      borderColor: 'border-yellow-500/40',
    };
  }
  if (pts >= 1300 || (rankId && rankId >= 302 && rankId <= 304)) {
    return {
      name: 'Silver',
      tier: 'Silver',
      color: 'text-slate-300',
      bgGradient: 'from-slate-900/50 to-zinc-900/30',
      borderColor: 'border-slate-500/40',
    };
  }
  return {
    name: 'Bronze',
    tier: 'Bronze',
    color: 'text-amber-700',
    bgGradient: 'from-amber-950/40 to-neutral-900/30',
    borderColor: 'border-amber-700/40',
  };
}

export function getCsRankDetails(points?: number, rankId?: number): RankDetails {
  const pts = points || 0;
  if (pts >= 150) {
    return {
      name: 'Grandmaster CS',
      tier: `${pts} Stars`,
      color: 'text-rose-400',
      bgGradient: 'from-rose-950/50 to-red-900/30',
      borderColor: 'border-rose-500/40',
    };
  }
  if (pts >= 100 || rankId === 323) {
    return {
      name: 'Master CS',
      tier: `${pts} Stars`,
      color: 'text-amber-400',
      bgGradient: 'from-amber-950/50 to-yellow-900/30',
      borderColor: 'border-amber-500/40',
    };
  }
  if (pts >= 50 || (rankId && rankId >= 317)) {
    return {
      name: 'Heroic CS',
      tier: `${pts} Stars`,
      color: 'text-red-400',
      bgGradient: 'from-red-950/50 to-orange-900/30',
      borderColor: 'border-red-500/40',
    };
  }
  if (pts >= 20 || (rankId && rankId >= 313)) {
    return {
      name: 'Diamond CS',
      tier: `${pts} Stars`,
      color: 'text-cyan-400',
      bgGradient: 'from-cyan-950/50 to-blue-900/30',
      borderColor: 'border-cyan-500/40',
    };
  }
  return {
    name: 'CS Ranked',
    tier: pts > 0 ? `${pts} Points` : 'Bronze/Silver',
    color: 'text-yellow-400',
    bgGradient: 'from-zinc-900/50 to-neutral-900/30',
    borderColor: 'border-neutral-700/40',
  };
}

/**
 * Strips Free Fire BBCode/color codes like [b][c][FFFFFF]
 */
export function cleanFreeFireBio(rawBio?: string): string {
  if (!rawBio) return 'No signature provided';
  // Remove [b], [c], [i], [u], [s], [XXXXXX] (hex colors)
  return rawBio.replace(/\[([a-zA-Z0-9#]{1,8})\]/g, '').trim() || rawBio;
}

/**
 * Format unix timestamp (seconds or milliseconds) to readable date
 */
export function formatUnixTimestamp(timestamp?: string | number): { formatted: string; relative: string } {
  if (!timestamp) return { formatted: 'Unknown', relative: 'N/A' };
  let ts = typeof timestamp === 'string' ? parseInt(timestamp, 10) : timestamp;
  if (isNaN(ts) || ts <= 0) return { formatted: 'Unknown', relative: 'N/A' };
  
  // Free Fire timestamps are in seconds
  if (ts < 10000000000) {
    ts = ts * 1000;
  }

  const date = new Date(ts);
  const now = Date.now();
  const diffMs = now - ts;
  const diffSec = Math.floor(diffMs / 1000);
  const diffHours = Math.floor(diffSec / 3600);
  const diffDays = Math.floor(diffHours / 24);

  let relative = '';
  if (diffSec < 0) {
    // If timestamp is slightly ahead due to server sync
    relative = 'Recent';
  } else if (diffDays > 365) {
    const years = (diffDays / 365).toFixed(1);
    relative = `${years} yrs ago`;
  } else if (diffDays > 30) {
    const months = Math.floor(diffDays / 30);
    relative = `${months} mo ago`;
  } else if (diffDays > 0) {
    relative = `${diffDays}d ago`;
  } else if (diffHours > 0) {
    relative = `${diffHours}h ago`;
  } else {
    relative = 'Recently';
  }

  const formatted = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return { formatted, relative };
}

export function formatNumber(num?: number): string {
  if (num === undefined || num === null) return '0';
  return new Intl.NumberFormat('en-US').format(num);
}

export function formatCompactNumber(num?: number): string {
  if (!num) return '0';
  if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}
