export interface SingleLinkDetails {
  url: string;
  password?: string;
}

export type User = {
  $id: string;
  name?: string;
  email?: string;
  mfa?: boolean;
  emailVerification?: boolean;
};

export interface MetricsDetails {
  createdAt: string;
  views: number;
  year: number;
  month: number;
}

export interface UpdateLinkDetails extends Omit<CreateLinkDetails, 'links'> {
  links?: SingleLinkDetails[];
  isEnabled?: boolean;
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
  links: SingleLinkDetails[];
  originalLink: string;
  shortenedLink: string;
  metrics: MetricsDetails[];
  tags: string[];
  createdAt: Date;
  isSmartLink: boolean;
  isProtectedByPassword: boolean;
  maxVisits?: number;
  deleteAt?: Date;
  activeAt?: Date;
}

export interface TokenDetails {
  id: string;
  token: string;
}

export type RequireMFA = 'MFA';

export interface OperationResult {
  success: boolean;
  errors: string[];
}

export interface LinkOperationResult extends OperationResult {
  link?: LinkDetails;
}

export interface LinkRow {
  $id: string;
  url: string;
  password?: string | null;
}

export interface ShortenedLinkRow {
  $id: string;
  code?: string;
  creatorId?: string;
  links: LinkRow[];
  tags?: string[] | null;
  maxVisits?: number | null;
  activeAt?: string | Date | null;
  deleteAt?: string | Date | null;
  isEnabled?: boolean;
  metrics?: unknown[];
  $createdAt?: string;
}

export interface MetricRow {
  $id: string;
  views: number;
  linkId?: string;
  year?: number;
  month?: number;
  shortenedLinks?: string[];
}
