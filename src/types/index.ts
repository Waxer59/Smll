export interface SingleLinkDetails {
  url: string;
  password?: string;
}

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
