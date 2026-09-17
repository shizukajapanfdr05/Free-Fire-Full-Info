export interface FreeFireBasicInfo {
  accountId: string;
  accountType?: number;
  nickname: string;
  region: string;
  level: number;
  exp: number;
  bannerId?: number;
  headPic?: number;
  rank?: number;
  rankingPoints?: number;
  badgeCnt?: number;
  badgeId?: number;
  seasonId?: number;
  liked?: number;
  showRank?: boolean;
  lastLoginAt?: string | number;
  csRank?: number;
  csRankingPoints?: number;
  weaponSkinShows?: number[];
  maxRank?: number;
  csMaxRank?: number;
  accountPrefers?: {
    brPregameShowChoices?: number[];
  };
  createAt?: string | number;
  title?: number;
  externalIconInfo?: {
    status?: string;
    showType?: string;
  };
  releaseVersion?: string;
  showBrRank?: boolean;
  showCsRank?: boolean;
  primeInfo?: {
    primeLevel?: number;
  };
}

export interface FreeFireProfileInfo {
  avatarId?: number;
  skinColor?: number;
  clothes?: number[];
  equipedSkills?: number[];
  isSelected?: boolean;
  isSelectedAwaken?: boolean;
  unlockTime?: number;
}

export interface FreeFireClanBasicInfo {
  clanId: string;
  clanName: string;
  captainId: string;
  clanLevel: number;
  capacity: number;
  memberNum: number;
}

export interface FreeFireCaptainBasicInfo {
  accountId: string;
  accountType?: number;
  nickname: string;
  region?: string;
  level: number;
  exp?: number;
  bannerId?: number;
  headPic?: number;
  rank?: number;
  rankingPoints?: number;
  role?: number;
  badgeCnt?: number;
  seasonId?: number;
  liked?: number;
  lastLoginAt?: string | number;
  csRank?: number;
  csRankingPoints?: number;
}

export interface FreeFirePetInfo {
  id?: number;
  level?: number;
  exp?: number;
  isSelected?: boolean;
  skinId?: number;
  selectedSkillId?: number;
}

export interface FreeFireSocialInfo {
  accountId?: string;
  gender?: string;
  language?: string;
  modePrefer?: string;
  signature?: string;
  rankShow?: string;
}

export interface FreeFireCreditScoreInfo {
  creditScore?: number;
  rewardState?: string;
  periodicSummaryEndTime?: string | number;
}

export interface FreeFireDiamondCostRes {
  diamondCost?: number;
}

export interface FreeFirePlayerResponse {
  basicInfo: FreeFireBasicInfo;
  profileInfo?: FreeFireProfileInfo;
  clanBasicInfo?: FreeFireClanBasicInfo;
  captainBasicInfo?: FreeFireCaptainBasicInfo;
  petInfo?: FreeFirePetInfo;
  socialInfo?: FreeFireSocialInfo;
  diamondCostRes?: FreeFireDiamondCostRes;
  creditScoreInfo?: FreeFireCreditScoreInfo;
  Owner?: {
    Owner?: string;
    Telegram?: string;
  };
  error?: string;
}

export interface ServerRegionOption {
  code: string;
  name: string;
  flag: string;
}

export interface RecentSearchItem {
  uid: string;
  region: string;
  nickname?: string;
  level?: number;
  timestamp: number;
}
