export interface TagDetails {
  id: string;
  name: string;
}

export interface SingleLinkDetails {
  url: string;
  password?: string;
}

export interface MetricsDetails {
  createdAt: string;
  views: number;
  countries: string[];
}

export interface CreateLinkDetails {
  links: SingleLinkDetails[];
  deleteAt?: string;
  activeAt?: string;
  maxVisits?: number;
  tags?: string[];
}

export interface LinkDetails extends CreateLinkDetails {
  id: string;
  code: string;
  isEnabled: boolean;
  originalLink: string;
  shortenedLink: string;
  clicks: number;
  metrics: MetricsDetails[];
}

export interface SmartLinkDetails {
  id: string;
  url: string;
  password: string;
}

export interface TokenDetails {
  id: string;
  token: string;
}

export type RequireMFA = 'MFA';
