export interface TagDetails {
  id: string;
  name: string;
}

export interface LinkDetails {
  id: string;
  originalLink: string;
  shortenedLink: string;
  isProtectedByPassword: boolean;
  isProtectedBySmartPassword: boolean;
  createdAt: Date;
  clicks: number;
  activeFrom?: Date;
  activeTo?: Date;
  maxClicks?: number;
  tags?: TagDetails[];
  isEnabled: boolean;
}

export enum UserPrefs {
  isFirstTimeUser = 'isFirstTimeUser'
}
