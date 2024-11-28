export interface SingleLinkDetails {
  url: string;
  password?: string;
}

export interface MetricsDetails {
  createdAt: string;
  views: number;
  countries: string[];
}

export interface UpdateLinkDetails extends Partial<CreateLinkDetails> {
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
  clicks: number;
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
  shortenedLink: LinkDetails | null;
}
