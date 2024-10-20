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
  deleteAt?: Date;
  activeAt?: Date;
  maxVisits?: number;
  tags?: string[];
  code?: string;
}

export interface LinkDetails extends Omit<CreateLinkDetails, 'tags'> {
  id: string;
  code: string;
  isEnabled: boolean;
  originalLink: string;
  shortenedLink: string;
  clicks: number;
  metrics: MetricsDetails[];
  tags: TagDetails[];
  createdAt: Date;
  isSmartLink: boolean;
  isProtectedByPassword: boolean;
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
