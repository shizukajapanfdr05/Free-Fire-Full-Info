import React, { useState } from 'react';
import {
  Shield,
  Trophy,
  Heart,
  Users,
  Swords,
  Copy,
  Check,
  Calendar,
  Sparkles,
  Award,
  Crown,
  Share2,
  Code2,
  Target,
  Clock,
  Compass,
  Zap,
} from 'lucide-react';
import { FreeFirePlayerResponse } from '../types';
import {
  getRegionInfo,
  getBrRankDetails,
  getCsRankDetails,
  cleanFreeFireBio,
  formatUnixTimestamp,
  formatNumber,
  formatCompactNumber,
} from '../utils/freefire';

interface PlayerCardProps {
  data: FreeFirePlayerResponse;
  onRefresh?: () => void;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({ data }) => {
  const [copiedUid, setCopiedUid] = useState(false);
  const [copiedClanId, setCopiedClanId] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [showRawJson, setShowRawJson] = useState(false);

  const { basicInfo, clanBasicInfo, captainBasicInfo, petInfo, socialInfo, creditScoreInfo, diamondCostRes } = data;
  const regionInfo = getRegionInfo(basicInfo.region || 'IND');
  const brRank = getBrRankDetails(basicInfo.rankingPoints, basicInfo.rank);
  const csRank = getCsRankDetails(basicInfo.csRankingPoints, basicInfo.csRank);
  const createdDate = formatUnixTimestamp(basicInfo.createAt);
  const lastActive = formatUnixTimestamp(basicInfo.lastLoginAt);
  const bio = cleanFreeFireBio(socialInfo?.signature);

  const handleCopyUid = () => {
    navigator.clipboard.writeText(basicInfo.accountId);
    setCopiedUid(true);
    setTimeout(() => setCopiedUid(false), 2000);
  };

  const handleCopyClanId = () => {
    if (!clanBasicInfo?.clanId) return;
    navigator.clipboard.writeText(clanBasicInfo.clanId);
    setCopiedClanId(true);
    setTimeout(() => setCopiedClanId(false), 2000);
  };

  const handleCopySummary = () => {
    const summaryText = `🔥 FREE FIRE PLAYER PROFILE 🔥
Name: ${basicInfo.nickname}
UID: ${basicInfo.accountId}
Region: ${basicInfo.region} (${regionInfo.name})
Level: ${basicInfo.level} (EXP: ${formatNumber(basicInfo.exp)})
Likes: ${formatNumber(basicInfo.liked || 0)}
BR Rank: ${brRank.name} (${formatNumber(basicInfo.rankingPoints)} pts)
CS Rank: ${csRank.name} (${basicInfo.csRankingPoints || 0} pts)
Badges: ${basicInfo.badgeCnt || 0} (Season ${basicInfo.seasonId || 'Current'})
Guild: ${clanBasicInfo ? `${clanBasicInfo.clanName} (Lv.${clanBasicInfo.clanLevel})` : 'No Guild'}
Version: ${basicInfo.releaseVersion || 'OB55'}`;

    navigator.clipboard.writeText(summaryText);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  return (
    <div className="w-full space-y-6">
      {/* Main Profile Header Card */}
      <div className="bg-gradient-to-b from-neutral-900 via-neutral-900/95 to-neutral-950 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl relative">
        {/* Top Tactical Bar */}
        <div className="h-2 w-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500" />

        {/* Banner Content */}
        <div className="p-6 sm:p-8 relative">
          {/* Background Watermark/Pattern */}
          <div className="absolute right-4 top-4 select-none opacity-5 font-display font-black text-8xl sm:text-9xl text-neutral-100 pointer-events-none uppercase">
            FF
          </div>

          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 relative z-10">
            {/* Left: Avatar & Identity */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              {/* Avatar Frame with Level */}
              <div className="relative group">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-amber-500/20 via-neutral-800 to-neutral-900 border-2 border-amber-500/60 p-1 shadow-lg shadow-amber-500/10 flex items-center justify-center relative overflow-hidden">
                  {/* Tactical Crosshair overlay */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.15)_0,transparent_70%)]" />
                  <div className="w-full h-full rounded-xl bg-neutral-950/80 flex flex-col items-center justify-center relative z-10 text-center p-2">
                    <Crown className="w-8 h-8 text-amber-400 mb-1" />
                    <span className="font-display font-black text-2xl text-white tracking-wider">
                      Lv.{basicInfo.level}
                    </span>
                  </div>
                </div>

                {/* Region Flag Badge */}
                <div className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-md bg-neutral-900 border border-neutral-700 text-xs font-semibold flex items-center gap-1 shadow-md">
                  <span>{regionInfo.flag}</span>
                  <span className="text-neutral-200">{basicInfo.region}</span>
                </div>
              </div>

              {/* Player Nickname & Tags */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="font-display text-2xl sm:text-4xl font-extrabold text-white tracking-wide drop-shadow-sm">
                    {basicInfo.nickname}
                  </h1>
                  {basicInfo.primeInfo && basicInfo.primeInfo.primeLevel ? (
                    <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Prime Lv.{basicInfo.primeInfo.primeLevel}
                    </span>
                  ) : null}
                  {basicInfo.releaseVersion && (
                    <span className="px-2 py-0.5 rounded bg-neutral-800 text-neutral-400 text-xs font-mono font-medium">
                      {basicInfo.releaseVersion}
                    </span>
                  )}
                </div>

                {/* UID with 1-click copy */}
                <div className="flex items-center gap-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-950/90 border border-neutral-800 text-sm font-mono text-neutral-300">
                    <span className="text-neutral-500 text-xs font-sans uppercase font-bold">UID:</span>
                    <span className="font-bold text-amber-400 select-all">{basicInfo.accountId}</span>
                    <button
                      id="copy-player-uid-btn"
                      type="button"
                      onClick={handleCopyUid}
                      className="ml-1 p-1 rounded hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
                      title="Copy Player UID"
                    >
                      {copiedUid ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                  {copiedUid && (
                    <span className="text-xs text-emerald-400 font-medium">Copied UID!</span>
                  )}
                </div>

                {/* EXP Bar */}
                <div className="space-y-1 max-w-xs">
                  <div className="flex justify-between text-[11px] text-neutral-400 font-mono">
                    <span>Experience Points:</span>
                    <span className="text-neutral-200 font-medium">
                      {formatNumber(basicInfo.exp)} EXP
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                      style={{ width: `${Math.min(100, (basicInfo.exp % 100000) / 1000)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Stats Highlights (Likes & Actions) */}
            <div className="flex flex-row md:flex-col items-start md:items-end justify-between md:justify-start gap-4 border-t md:border-t-0 pt-4 md:pt-0 border-neutral-800/80">
              {/* Total Likes */}
              <div className="px-4 py-2.5 rounded-xl bg-neutral-950/80 border border-rose-500/20 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-400">
                  <Heart className="w-5 h-5 fill-rose-500/20" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
                    Total Likes
                  </div>
                  <div className="font-display font-black text-xl text-rose-300">
                    {formatNumber(basicInfo.liked || 0)}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  id="share-summary-btn"
                  onClick={handleCopySummary}
                  className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Copy Profile Text Summary"
                >
                  {copiedSummary ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Share Summary</span>
                    </>
                  )}
                </button>

                <button
                  id="view-json-btn"
                  onClick={() => setShowRawJson(!showRawJson)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                    showRawJson
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300'
                  }`}
                  title="Toggle Raw JSON Inspector"
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>JSON</span>
                </button>
              </div>
            </div>
          </div>

          {/* Player In-Game Signature / Bio */}
          {bio && (
            <div className="mt-6 pt-5 border-t border-neutral-800/80">
              <div className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-amber-500" />
                <span>Player Signature / In-Game Bio:</span>
              </div>
              <div className="p-3 bg-neutral-950/70 border border-neutral-800/80 rounded-xl font-mono text-xs text-neutral-300 whitespace-pre-line leading-relaxed">
                {bio}
              </div>
            </div>
          )}

          {/* Account Timestamps Bar */}
          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-neutral-400 pt-3 border-t border-neutral-800/40">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-neutral-500" />
              <span>Created:</span>
              <span className="text-neutral-200 font-medium">
                {createdDate.formatted} ({createdDate.relative})
              </span>
            </div>
            <span className="text-neutral-700 hidden sm:inline">•</span>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-neutral-500" />
              <span>Last Active:</span>
              <span className="text-neutral-200 font-medium">
                {lastActive.relative} ({lastActive.formatted})
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Ranks & Battle Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Battle Royale (BR) Rank */}
        <div className={`p-5 rounded-2xl bg-gradient-to-br ${brRank.bgGradient} border ${brRank.borderColor} relative overflow-hidden shadow-lg`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-neutral-950/60 border border-neutral-800">
                <Trophy className={`w-5 h-5 ${brRank.color}`} />
              </div>
              <div>
                <h2 className="font-display font-bold text-base text-neutral-200 uppercase tracking-wide">
                  Battle Royale
                </h2>
                <span className="text-[11px] text-neutral-400">Classic BR Rank</span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-neutral-950/80 text-xs font-mono font-bold text-neutral-300">
              OB55
            </span>
          </div>

          <div className="space-y-2 mt-4">
            <div className="flex items-baseline justify-between">
              <span className={`font-display font-black text-2xl sm:text-3xl ${brRank.color}`}>
                {brRank.name}
              </span>
              <span className="font-mono text-sm text-neutral-200 font-bold">
                {formatNumber(basicInfo.rankingPoints)} pts
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-neutral-400 pt-2 border-t border-white/5">
              <span>Season Peak Rank:</span>
              <span className="font-semibold text-neutral-200">
                Tier #{basicInfo.maxRank || basicInfo.rank || 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Clash Squad (CS) Rank */}
        <div className={`p-5 rounded-2xl bg-gradient-to-br ${csRank.bgGradient} border ${csRank.borderColor} relative overflow-hidden shadow-lg`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-neutral-950/60 border border-neutral-800">
                <Swords className={`w-5 h-5 ${csRank.color}`} />
              </div>
              <div>
                <h2 className="font-display font-bold text-base text-neutral-200 uppercase tracking-wide">
                  Clash Squad
                </h2>
                <span className="text-[11px] text-neutral-400">CS Ranked League</span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-neutral-950/80 text-xs font-mono font-bold text-neutral-300">
              Ranked
            </span>
          </div>

          <div className="space-y-2 mt-4">
            <div className="flex items-baseline justify-between">
              <span className={`font-display font-black text-2xl sm:text-3xl ${csRank.color}`}>
                {csRank.name}
              </span>
              <span className="font-mono text-sm text-neutral-200 font-bold">
                {basicInfo.csRankingPoints || 0} Stars
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-neutral-400 pt-2 border-t border-white/5">
              <span>Max CS Tier:</span>
              <span className="font-semibold text-neutral-200">
                Tier #{basicInfo.csMaxRank || basicInfo.csRank || 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Season Badges & Pass */}
        <div className="p-5 rounded-2xl bg-neutral-900/90 border border-neutral-800 relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-neutral-950/60 border border-neutral-800">
                <Award className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <h2 className="font-display font-bold text-base text-neutral-200 uppercase tracking-wide">
                  Season Pass
                </h2>
                <span className="text-[11px] text-neutral-400">
                  Season #{basicInfo.seasonId || 53}
                </span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 text-xs font-bold">
              Active
            </span>
          </div>

          <div className="space-y-2 mt-4">
            <div className="flex items-baseline justify-between">
              <span className="font-display font-black text-2xl sm:text-3xl text-yellow-400">
                {basicInfo.badgeCnt || 0}
              </span>
              <span className="text-xs text-neutral-400 font-medium">Collected Badges</span>
            </div>
            <div className="flex items-center justify-between text-xs text-neutral-400 pt-2 border-t border-neutral-800">
              <span>Badge ID:</span>
              <span className="font-mono text-neutral-300">
                {basicInfo.badgeId || '1001000100'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Guild / Clan and Companion Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Guild Details */}
        <div className="p-5 rounded-2xl bg-neutral-900/90 border border-neutral-800 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-display font-bold text-lg text-neutral-100 uppercase tracking-wide">
                  Clan / Guild Info
                </h2>
                <span className="text-xs text-neutral-400">Guild Affiliation &amp; Team</span>
              </div>
            </div>
            {clanBasicInfo && (
              <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold">
                Level {clanBasicInfo.clanLevel}
              </span>
            )}
          </div>

          {clanBasicInfo ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-400">Guild Name:</span>
                <span className="font-display font-black text-lg text-white">
                  {clanBasicInfo.clanName}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-400">Guild ID:</span>
                <div className="flex items-center gap-1.5 font-mono text-xs text-neutral-300">
                  <span>{clanBasicInfo.clanId}</span>
                  <button
                    onClick={handleCopyClanId}
                    className="p-1 rounded hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
                    title="Copy Guild ID"
                  >
                    {copiedClanId ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-400">Guild Members:</span>
                <span className="font-mono text-xs font-bold text-neutral-200">
                  {clanBasicInfo.memberNum} / {clanBasicInfo.capacity} players
                </span>
              </div>

              {captainBasicInfo && (
                <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between text-xs">
                  <span className="text-neutral-400">Guild Leader:</span>
                  <div className="text-right">
                    <span className="font-bold text-amber-300">{captainBasicInfo.nickname}</span>
                    <span className="text-[11px] text-neutral-400 ml-1.5 font-mono">
                      (Lv.{captainBasicInfo.level})
                    </span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="py-6 text-center text-neutral-500 text-xs">
              This player is not currently in any guild or clan.
            </div>
          )}
        </div>

        {/* Pet & Companion & Account Conduct */}
        <div className="p-5 rounded-2xl bg-neutral-900/90 border border-neutral-800 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-display font-bold text-lg text-neutral-100 uppercase tracking-wide">
                  Pet &amp; Game Conduct
                </h2>
                <span className="text-xs text-neutral-400">Companion &amp; Account Status</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {/* Pet Status */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-neutral-400">Equipped Pet:</span>
              {petInfo && petInfo.id ? (
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-cyan-300 text-xs">
                    Pet #{petInfo.id.toString().slice(-4)}
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/30 font-mono text-[11px] font-bold">
                    Lv.{petInfo.level || 1}
                  </span>
                </div>
              ) : (
                <span className="text-xs text-neutral-500">None Equipped</span>
              )}
            </div>

            {/* Credit Score */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-neutral-400">Honor / Credit Score:</span>
              <div className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-mono text-xs font-bold text-emerald-400">
                  {creditScoreInfo?.creditScore ?? 100} / 100
                </span>
                <span className="text-[10px] text-neutral-500 font-sans">(Excellent)</span>
              </div>
            </div>

            {/* Preferred Game Mode */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-neutral-400">Preferred Mode:</span>
              <span className="font-semibold text-neutral-200 text-xs uppercase">
                {socialInfo?.modePrefer?.replace('ModePrefer_', '') || 'Clash Squad (CS)'}
              </span>
            </div>

            {/* Language & Gender */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-neutral-400">Language &amp; Gender:</span>
              <span className="text-xs text-neutral-300">
                {socialInfo?.language?.replace('Language_', '') || 'EN'} •{' '}
                {socialInfo?.gender?.replace('Gender_', '') || 'MALE'}
              </span>
            </div>

            {/* Diamond Cost */}
            {diamondCostRes?.diamondCost !== undefined && (
              <div className="pt-2 border-t border-neutral-800 flex items-center justify-between text-xs">
                <span className="text-neutral-400">Diamond Cost Metric:</span>
                <span className="font-mono font-bold text-amber-400">
                  💎 {diamondCostRes.diamondCost}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Raw JSON Inspector Modal / Collapsible */}
      {showRawJson && (
        <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 shadow-2xl space-y-3">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-amber-400" />
              <span className="font-display font-bold text-sm text-neutral-200 uppercase tracking-wide">
                Raw Free Fire API Response
              </span>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(JSON.stringify(data, null, 2));
              }}
              className="px-2.5 py-1 rounded-md bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-xs font-mono transition-colors flex items-center gap-1.5"
            >
              <Copy className="w-3 h-3" />
              <span>Copy JSON</span>
            </button>
          </div>
          <pre className="p-4 rounded-xl bg-neutral-900/70 border border-neutral-800 text-[11px] font-mono text-emerald-400 overflow-x-auto max-h-96 leading-relaxed">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};
