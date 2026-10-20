export type PersonaRole = 'employer' | 'candidate' | 'verifier' | 'admin';

export interface Persona {
  id: PersonaRole;
  name: string;
  roleTitle: string;
  organization: string;
  avatarInitials: string;
  description: string;
  defaultPath: string;
}

export type VerificationStatus = 
  | 'Independently confirmed'
  | 'Document checked'
  | 'Submitted for review'
  | 'Self-reported'
  | 'Expired'
  | 'Rejected';

export type PriorityLevel = 'High' | 'Normal' | 'Low';

export interface CandidateDocument {
  id: string;
  title: string;
  category: 'Electrical Certificate' | 'Safety / ID06' | 'Degree / Vocational' | 'Work Reference' | 'Driver License' | 'Equipment Operation';
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  status: VerificationStatus;
  lastReviewedDate?: string;
  verifiedBy?: string;
  documentNumber?: string;
  notes?: string;
  fileSize?: string;
}

export interface Candidate {
  id: string;
  name: string;
  initials: string;
  title: string;
  location: string;
  availability: 'Immediate' | '2 weeks notice' | '1 month notice' | 'Available from Q3';
  experienceYears: number;
  travelFlexibility: 'Local only (within 20km)' | 'Regional (up to 50km)' | 'Sweden wide' | 'Nordic travel accepted';
  verificationLevel: 'Independently confirmed' | 'Document checked' | 'Self-reported';
  rating: number; // e.g. 4.9
  summary: string;
  skills: string[];
  languages: { language: string; level: 'Native' | 'Fluent' | 'Professional' | 'Basic'; confirmed: boolean }[];
  employmentHistory: {
    role: string;
    company: string;
    location: string;
    period: string;
    verified: boolean;
    description: string;
  }[];
  documents: CandidateDocument[];
  verificationHistory: {
    id: string;
    date: string;
    action: string;
    by: string;
    category: string;
    note?: string;
  }[];
  passportId: string;
  isPassportShared: boolean;
  privacy: {
    anonymousInitialReview: boolean;
    directContactAllowed: boolean;
    shareFullDocumentsOnMatch: boolean;
    salaryExpectationPublic: boolean;
  };
}

export interface MandatoryRequirement {
  id: string;
  label: string;
  type: 'min_experience' | 'required_doc' | 'language' | 'location_radius' | 'availability';
  targetValue: string | number;
}

export interface EmployerRequirement {
  id: string;
  title: string;
  department: string;
  location: string;
  employmentType: 'Full-time' | 'Contract' | 'Part-time';
  workArrangement: 'On-site' | 'Hybrid' | 'Remote';
  description: string;
  status: 'Active' | 'Draft' | 'Paused' | 'Archived';
  createdAt: string;
  mandatoryCriteria: MandatoryRequirement[];
  preferenceWeights: {
    experience: number;
    qualifications: number;
    availability: number;
    location: number;
  };
}

export interface MatchBreakdown {
  candidateId: string;
  score: number;
  isEligible: boolean;
  mandatoryPassed: boolean;
  ineligibilityReasons: string[];
  weightsBreakdown: {
    experienceScore: number;
    qualificationsScore: number;
    availabilityScore: number;
    locationScore: number;
  };
  fulfilledCriteria: string[];
  missingEvidence: string[];
  warnings: string[];
}

export interface VerificationCase {
  id: string;
  candidateId: string;
  candidateName: string;
  candidateRole: string;
  evidenceTitle: string;
  category: CandidateDocument['category'];
  submissionDate: string;
  reviewer: string;
  priority: PriorityLevel;
  status: 'Pending' | 'In review' | 'Approved' | 'More info needed' | 'Rejected' | 'Expired';
  expiryDate?: string;
  notes: string[];
  checklist: { item: string; checked: boolean }[];
  referenceCheckResult?: string;
  interviewOutcome?: string;
}

export type PipelineStage = 'New Match' | 'Shortlisted' | 'Contact Requested' | 'Interview' | 'Decision';

export interface PipelineItem {
  id: string;
  candidateId: string;
  requirementId: string;
  stage: PipelineStage;
  matchScore: number;
  updatedAt: string;
  notes?: string;
}

export interface Shortlist {
  id: string;
  name: string;
  requirementId?: string;
  candidateIds: string[];
  createdAt: string;
  description: string;
}

export interface SubscriptionPlan {
  id: 'starter' | 'growth' | 'enterprise';
  name: string;
  priceMonthlySEK: number;
  priceAnnualSEK: number;
  seatLimit: number;
  contactQuotaMonthly: number;
  activeRequirementLimit: number;
  features: string[];
  supportLevel: string;
  popular?: boolean;
}

export interface ContractAgreement {
  id: string;
  name: string;
  companyName: string;
  candidateName?: string;
  template: 'Standard Placement Framework' | 'Master Services Subcontract' | 'Direct Hire Guarantee' | 'NDA & Verification Protocol';
  createdAt: string;
  sentDate?: string;
  signedDate?: string;
  expiryDate: string;
  status: 'Draft' | 'Sent' | 'Viewed' | 'Signed' | 'Expired' | 'Cancelled';
  signatoryEmail: string;
  signatoryName: string;
  valueSEK: number;
  isSimulated: boolean;
  history: { date: string; action: string; actor: string }[];
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: string;
  category: 'Verification' | 'Matching' | 'Pipeline' | 'Contract' | 'Subscription' | 'Security';
  action: string;
  details: string;
}
