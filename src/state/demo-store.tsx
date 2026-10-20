import React, { createContext, useContext, useEffect, useReducer } from 'react';
import {
  Candidate,
  EmployerRequirement,
  VerificationCase,
  ContractAgreement,
  PipelineItem,
  Shortlist,
  AuditEvent,
  PersonaRole,
  PipelineStage,
  VerificationStatus
} from '../types';
import { INITIAL_CANDIDATES } from '../data/seed-candidates';
import { INITIAL_REQUIREMENTS } from '../data/seed-requirements';
import { INITIAL_CASES } from '../data/seed-cases';
import { INITIAL_CONTRACTS } from '../data/seed-contracts';
import { INITIAL_PIPELINE } from '../data/seed-pipeline';
import { INITIAL_SHORTLISTS } from '../data/seed-shortlists';
import { INITIAL_ACTIVITY } from '../data/seed-activity';

export interface ToastNotification {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  subtitle?: string;
}

export interface DemoState {
  currentPersona: PersonaRole;
  candidates: Candidate[];
  requirements: EmployerRequirement[];
  selectedRequirementId: string;
  verificationCases: VerificationCase[];
  contracts: ContractAgreement[];
  currentPlanId: 'starter' | 'growth' | 'enterprise';
  isAnnualBilling: boolean;
  pipeline: PipelineItem[];
  shortlists: Shortlist[];
  activityFeed: AuditEvent[];
  globalMatchingWeights: {
    experience: number;
    qualifications: number;
    availability: number;
    location: number;
  };
  contactQuotaUsed: number;
  toast: ToastNotification | null;
}

const STORAGE_KEY = 'verity_saas_demo_state_v1';

const getInitialState = (): DemoState => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Ensure essential fields exist
      if (parsed && Array.isArray(parsed.candidates) && parsed.candidates.length > 0) {
        return {
          ...parsed,
          toast: null // do not persist toast
        };
      }
    }
  } catch {
    console.warn('LocalStorage unavailable or corrupt. Initializing defaults.');
  }

  return {
    currentPersona: 'employer',
    candidates: INITIAL_CANDIDATES,
    requirements: INITIAL_REQUIREMENTS,
    selectedRequirementId: 'req-got-elec',
    verificationCases: INITIAL_CASES,
    contracts: INITIAL_CONTRACTS,
    currentPlanId: 'growth',
    isAnnualBilling: false,
    pipeline: INITIAL_PIPELINE,
    shortlists: INITIAL_SHORTLISTS,
    activityFeed: INITIAL_ACTIVITY,
    globalMatchingWeights: {
      experience: 35,
      qualifications: 35,
      availability: 15,
      location: 15
    },
    contactQuotaUsed: 32,
    toast: null
  };
};

export type DemoAction =
  | { type: 'SWITCH_PERSONA'; payload: PersonaRole }
  | { type: 'SELECT_REQUIREMENT'; payload: string }
  | { type: 'CREATE_REQUIREMENT'; payload: EmployerRequirement }
  | { type: 'UPDATE_REQUIREMENT'; payload: EmployerRequirement }
  | {
      type: 'VERIFICATION_DECISION';
      payload: {
        caseId: string;
        status: 'Approved' | 'Rejected' | 'More info needed';
        reason?: string;
        note?: string;
        officer: string;
      };
    }
  | { type: 'ASSIGN_CASE'; payload: { caseId: string; reviewer: string } }
  | { type: 'ADD_CASE_NOTE'; payload: { caseId: string; note: string } }
  | { type: 'RECORD_INTERVIEW_OUTCOME'; payload: { caseId: string; outcome: string } }
  | { type: 'MOVE_PIPELINE_STAGE'; payload: { itemId: string; newStage: PipelineStage } }
  | { type: 'ADD_TO_PIPELINE'; payload: { candidateId: string; requirementId: string; stage?: PipelineStage } }
  | { type: 'TOGGLE_SHORTLIST_CANDIDATE'; payload: { shortlistId: string; candidateId: string } }
  | { type: 'CREATE_SHORTLIST'; payload: { name: string; description: string; candidateIds: string[] } }
  | { type: 'SIGN_CONTRACT'; payload: { contractId: string; signatoryName: string; signatoryEmail: string } }
  | { type: 'CREATE_CONTRACT'; payload: ContractAgreement }
  | { type: 'UPDATE_SUBSCRIPTION_PLAN'; payload: 'starter' | 'growth' | 'enterprise' }
  | { type: 'TOGGLE_ANNUAL_BILLING' }
  | { type: 'UPDATE_MATCHING_WEIGHTS'; payload: { experience: number; qualifications: number; availability: number; location: number } }
  | { type: 'UPDATE_CANDIDATE_PRIVACY'; payload: { candidateId: string; privacy: Candidate['privacy'] } }
  | { type: 'SHARE_PASSPORT'; payload: string }
  | { type: 'REVOKE_PASSPORT_ACCESS'; payload: string }
  | { type: 'SHOW_TOAST'; payload: { message: string; type?: 'success' | 'info' | 'warning' | 'error'; subtitle?: string } }
  | { type: 'HIDE_TOAST' }
  | { type: 'RESET_DEMO' };

function demoReducer(state: DemoState, action: DemoAction): DemoState {
  switch (action.type) {
    case 'SWITCH_PERSONA':
      return {
        ...state,
        currentPersona: action.payload,
        toast: {
          id: String(Date.now()),
          type: 'info',
          message: `Switched demo view to ${action.payload.toUpperCase()}`,
          subtitle: 'Context and permissions adapted for this session'
        }
      };

    case 'SELECT_REQUIREMENT':
      return {
        ...state,
        selectedRequirementId: action.payload
      };

    case 'CREATE_REQUIREMENT': {
      const newFeed = [
        {
          id: `act-${Date.now()}`,
          timestamp: 'Just now',
          actor: 'Alex Morgan',
          actorRole: 'Employer',
          category: 'Matching' as const,
          action: 'Requirement created',
          details: `Created new requirement "${action.payload.title}" in ${action.payload.location}`
        },
        ...state.activityFeed
      ];
      return {
        ...state,
        requirements: [action.payload, ...state.requirements],
        selectedRequirementId: action.payload.id,
        activityFeed: newFeed,
        toast: {
          id: String(Date.now()),
          type: 'success',
          message: 'Workforce Requirement created',
          subtitle: 'Candidate criteria generated & matching ready'
        }
      };
    }

    case 'UPDATE_REQUIREMENT': {
      return {
        ...state,
        requirements: state.requirements.map(r => r.id === action.payload.id ? action.payload : r),
        toast: {
          id: String(Date.now()),
          type: 'success',
          message: 'Requirement updated successfully'
        }
      };
    }

    case 'VERIFICATION_DECISION': {
      const { caseId, status, reason, note, officer } = action.payload;
      const targetCase = state.verificationCases.find(c => c.id === caseId);
      if (!targetCase) return state;

      const newCaseStatus = status;
      const docStatus: VerificationStatus = status === 'Approved' 
        ? 'Independently confirmed' 
        : status === 'Rejected' 
        ? 'Rejected' 
        : 'Submitted for review';

      // Update case
      const updatedCases = state.verificationCases.map(c => {
        if (c.id !== caseId) return c;
        const newNotes = [...c.notes];
        if (note) newNotes.push(`[${officer}] ${note}`);
        if (reason) newNotes.push(`[Reason] ${reason}`);
        return {
          ...c,
          status: newCaseStatus,
          notes: newNotes,
          reviewer: officer
        };
      });

      // Update candidate's document status and verification history
      const updatedCandidates = state.candidates.map(cand => {
        if (cand.id !== targetCase.candidateId) return cand;

        const updatedDocs = cand.documents.map(doc => {
          if (doc.title.toLowerCase().includes(targetCase.evidenceTitle.toLowerCase()) || 
              targetCase.evidenceTitle.toLowerCase().includes(doc.title.toLowerCase())) {
            return {
              ...doc,
              status: docStatus,
              lastReviewedDate: '2026-10-20',
              verifiedBy: officer,
              notes: note || doc.notes
            };
          }
          return doc;
        });

        // Determine candidate overall verification level
        const hasIndependent = updatedDocs.some(d => d.status === 'Independently confirmed');
        const hasChecked = updatedDocs.some(d => d.status === 'Document checked');
        const newLevel: 'Independently confirmed' | 'Document checked' | 'Self-reported' =
          hasIndependent ? 'Independently confirmed' : hasChecked ? 'Document checked' : 'Self-reported';

        const newHistory = [
          {
            id: `vh-${Date.now()}`,
            date: '2026-10-20',
            action: `${targetCase.evidenceTitle} marked ${status.toUpperCase()}`,
            by: officer,
            category: targetCase.category,
            note: reason || note || 'Decision recorded in verification console'
          },
          ...cand.verificationHistory
        ];

        return {
          ...cand,
          documents: updatedDocs,
          verificationLevel: newLevel,
          verificationHistory: newHistory
        };
      });

      // Add to activity feed
      const newFeed = [
        {
          id: `act-${Date.now()}`,
          timestamp: 'Just now',
          actor: officer,
          actorRole: 'Verification Officer',
          category: 'Verification' as const,
          action: `Evidence ${status}`,
          details: `${targetCase.evidenceTitle} for ${targetCase.candidateName} updated to ${status}.`
        },
        ...state.activityFeed
      ];

      return {
        ...state,
        verificationCases: updatedCases,
        candidates: updatedCandidates,
        activityFeed: newFeed,
        toast: {
          id: String(Date.now()),
          type: status === 'Approved' ? 'success' : status === 'Rejected' ? 'error' : 'warning',
          message: `Decision recorded: Evidence ${status}`,
          subtitle: `Candidate profile & match score automatically updated`
        }
      };
    }

    case 'ASSIGN_CASE': {
      const updatedCases = state.verificationCases.map(c => 
        c.id === action.payload.caseId ? { ...c, reviewer: action.payload.reviewer } : c
      );
      return {
        ...state,
        verificationCases: updatedCases,
        toast: {
          id: String(Date.now()),
          type: 'info',
          message: `Case assigned to ${action.payload.reviewer}`
        }
      };
    }

    case 'ADD_CASE_NOTE': {
      const updatedCases = state.verificationCases.map(c => 
        c.id === action.payload.caseId ? { ...c, notes: [...c.notes, action.payload.note] } : c
      );
      return {
        ...state,
        verificationCases: updatedCases,
        toast: {
          id: String(Date.now()),
          type: 'info',
          message: 'Internal review note saved'
        }
      };
    }

    case 'RECORD_INTERVIEW_OUTCOME': {
      const updatedCases = state.verificationCases.map(c => 
        c.id === action.payload.caseId ? { ...c, interviewOutcome: action.payload.outcome } : c
      );
      return {
        ...state,
        verificationCases: updatedCases,
        toast: {
          id: String(Date.now()),
          type: 'success',
          message: 'Interview & reference screening outcome saved'
        }
      };
    }

    case 'MOVE_PIPELINE_STAGE': {
      const item = state.pipeline.find(p => p.id === action.payload.itemId);
      const cand = item ? state.candidates.find(c => c.id === item.candidateId) : null;
      const updatedPipeline = state.pipeline.map(p => 
        p.id === action.payload.itemId ? { ...p, stage: action.payload.newStage, updatedAt: 'Just now' } : p
      );

      const newFeed = item && cand ? [
        {
          id: `act-${Date.now()}`,
          timestamp: 'Just now',
          actor: 'Alex Morgan',
          actorRole: 'Employer',
          category: 'Pipeline' as const,
          action: `Stage changed to ${action.payload.newStage}`,
          details: `Moved ${cand.name} to ${action.payload.newStage} stage.`
        },
        ...state.activityFeed
      ] : state.activityFeed;

      return {
        ...state,
        pipeline: updatedPipeline,
        activityFeed: newFeed,
        toast: {
          id: String(Date.now()),
          type: 'success',
          message: `Moved candidate to ${action.payload.newStage}`
        }
      };
    }

    case 'ADD_TO_PIPELINE': {
      const existing = state.pipeline.find(
        p => p.candidateId === action.payload.candidateId && p.requirementId === action.payload.requirementId
      );
      if (existing) {
        return {
          ...state,
          toast: {
            id: String(Date.now()),
            type: 'info',
            message: 'Candidate is already in the recruitment pipeline'
          }
        };
      }

      const cand = state.candidates.find(c => c.id === action.payload.candidateId);
      const newItem: PipelineItem = {
        id: `pipe-${Date.now()}`,
        candidateId: action.payload.candidateId,
        requirementId: action.payload.requirementId,
        stage: action.payload.stage || 'Shortlisted',
        matchScore: 90,
        updatedAt: 'Just now',
        notes: 'Added from candidate discovery'
      };

      const newFeed = [
        {
          id: `act-${Date.now()}`,
          timestamp: 'Just now',
          actor: 'Alex Morgan',
          actorRole: 'Employer',
          category: 'Pipeline' as const,
          action: 'Candidate added to pipeline',
          details: `Added ${cand?.name || 'Candidate'} to ${newItem.stage}.`
        },
        ...state.activityFeed
      ];

      return {
        ...state,
        pipeline: [newItem, ...state.pipeline],
        activityFeed: newFeed,
        toast: {
          id: String(Date.now()),
          type: 'success',
          message: `Added ${cand?.name || 'Candidate'} to Pipeline (${newItem.stage})`
        }
      };
    }

    case 'TOGGLE_SHORTLIST_CANDIDATE': {
      const list = state.shortlists.find(s => s.id === action.payload.shortlistId);
      if (!list) return state;

      const cand = state.candidates.find(c => c.id === action.payload.candidateId);
      const exists = list.candidateIds.includes(action.payload.candidateId);
      const newIds = exists
        ? list.candidateIds.filter(id => id !== action.payload.candidateId)
        : [...list.candidateIds, action.payload.candidateId];

      const updatedShortlists = state.shortlists.map(s =>
        s.id === action.payload.shortlistId ? { ...s, candidateIds: newIds } : s
      );

      return {
        ...state,
        shortlists: updatedShortlists,
        toast: {
          id: String(Date.now()),
          type: exists ? 'info' : 'success',
          message: exists
            ? `Removed ${cand?.name} from ${list.name}`
            : `Added ${cand?.name} to ${list.name}`
        }
      };
    }

    case 'CREATE_SHORTLIST': {
      const newList: Shortlist = {
        id: `sl-${Date.now()}`,
        name: action.payload.name,
        description: action.payload.description,
        candidateIds: action.payload.candidateIds,
        createdAt: '2026-10-20'
      };
      return {
        ...state,
        shortlists: [...state.shortlists, newList],
        toast: {
          id: String(Date.now()),
          type: 'success',
          message: `Created shortlist "${action.payload.name}"`
        }
      };
    }

    case 'SIGN_CONTRACT': {
      const updatedContracts = state.contracts.map(c => {
        if (c.id !== action.payload.contractId) return c;
        return {
          ...c,
          status: 'Signed' as const,
          signedDate: '2026-10-20 16:30',
          signatoryName: action.payload.signatoryName,
          signatoryEmail: action.payload.signatoryEmail,
          history: [
            ...c.history,
            {
              date: '2026-10-20 16:30',
              action: 'Simulated digital signature executed (Demo mode)',
              actor: action.payload.signatoryName
            }
          ]
        };
      });

      const newFeed = [
        {
          id: `act-${Date.now()}`,
          timestamp: 'Just now',
          actor: action.payload.signatoryName,
          actorRole: 'Signatory',
          category: 'Contract' as const,
          action: 'Contract signed (Simulated)',
          details: `Agreement executed in verified demo sandbox.`
        },
        ...state.activityFeed
      ];

      return {
        ...state,
        contracts: updatedContracts,
        activityFeed: newFeed,
        toast: {
          id: String(Date.now()),
          type: 'success',
          message: 'Agreement signed successfully (Simulated)',
          subtitle: 'Status updated to Signed with complete audit log'
        }
      };
    }

    case 'CREATE_CONTRACT': {
      return {
        ...state,
        contracts: [action.payload, ...state.contracts],
        toast: {
          id: String(Date.now()),
          type: 'success',
          message: `Contract "${action.payload.name}" created`
        }
      };
    }

    case 'UPDATE_SUBSCRIPTION_PLAN': {
      const planNames = { starter: 'Starter', growth: 'Growth Scale', enterprise: 'Enterprise Industrial' };
      const newFeed = [
        {
          id: `act-${Date.now()}`,
          timestamp: 'Just now',
          actor: 'Alex Morgan',
          actorRole: 'Employer',
          category: 'Subscription' as const,
          action: `Plan changed to ${planNames[action.payload]}`,
          details: `Subscription tier updated in demo billing workspace.`
        },
        ...state.activityFeed
      ];
      return {
        ...state,
        currentPlanId: action.payload,
        activityFeed: newFeed,
        toast: {
          id: String(Date.now()),
          type: 'success',
          message: `Upgraded subscription to ${planNames[action.payload]}`,
          subtitle: 'Workforce quotas and feature entitlements updated'
        }
      };
    }

    case 'TOGGLE_ANNUAL_BILLING':
      return {
        ...state,
        isAnnualBilling: !state.isAnnualBilling
      };

    case 'UPDATE_MATCHING_WEIGHTS': {
      const sum = action.payload.experience + action.payload.qualifications + action.payload.availability + action.payload.location;
      if (sum !== 100) {
        return {
          ...state,
          toast: {
            id: String(Date.now()),
            type: 'error',
            message: `Validation Error: Weights must sum to 100% (currently ${sum}%)`
          }
        };
      }
      return {
        ...state,
        globalMatchingWeights: action.payload,
        toast: {
          id: String(Date.now()),
          type: 'success',
          message: 'Matching weights configuration saved'
        }
      };
    }

    case 'UPDATE_CANDIDATE_PRIVACY': {
      const updatedCandidates = state.candidates.map(c =>
        c.id === action.payload.candidateId ? { ...c, privacy: action.payload.privacy } : c
      );
      return {
        ...state,
        candidates: updatedCandidates,
        toast: {
          id: String(Date.now()),
          type: 'success',
          message: 'Privacy & sharing preferences saved'
        }
      };
    }

    case 'SHARE_PASSPORT': {
      const updatedCandidates = state.candidates.map(c =>
        c.id === action.payload ? { ...c, isPassportShared: true } : c
      );
      return {
        ...state,
        candidates: updatedCandidates,
        toast: {
          id: String(Date.now()),
          type: 'success',
          message: 'Digital Passport shared via secure temporary token',
          subtitle: 'Simulated QR and share code activated'
        }
      };
    }

    case 'REVOKE_PASSPORT_ACCESS': {
      const updatedCandidates = state.candidates.map(c =>
        c.id === action.payload ? { ...c, isPassportShared: false } : c
      );
      return {
        ...state,
        candidates: updatedCandidates,
        toast: {
          id: String(Date.now()),
          type: 'info',
          message: 'Digital Passport access revoked',
          subtitle: 'External preview links disabled'
        }
      };
    }

    case 'SHOW_TOAST':
      return {
        ...state,
        toast: {
          id: String(Date.now()),
          message: action.payload.message,
          type: action.payload.type || 'info',
          subtitle: action.payload.subtitle
        }
      };

    case 'HIDE_TOAST':
      return {
        ...state,
        toast: null
      };

    case 'RESET_DEMO':
      localStorage.removeItem(STORAGE_KEY);
      return {
        currentPersona: 'employer',
        candidates: INITIAL_CANDIDATES,
        requirements: INITIAL_REQUIREMENTS,
        selectedRequirementId: 'req-got-elec',
        verificationCases: INITIAL_CASES,
        contracts: INITIAL_CONTRACTS,
        currentPlanId: 'growth',
        isAnnualBilling: false,
        pipeline: INITIAL_PIPELINE,
        shortlists: INITIAL_SHORTLISTS,
        activityFeed: INITIAL_ACTIVITY,
        globalMatchingWeights: {
          experience: 35,
          qualifications: 35,
          availability: 15,
          location: 15
        },
        contactQuotaUsed: 32,
        toast: {
          id: String(Date.now()),
          type: 'success',
          message: 'Demo state restored to original baseline',
          subtitle: 'All seeded candidates, cases, and requirements refreshed'
        }
      };

    default:
      return state;
  }
}

interface DemoContextValue {
  state: DemoState;
  dispatch: React.Dispatch<DemoAction>;
  resetDemo: () => void;
  showToast: (message: string, type?: ToastNotification['type'], subtitle?: string) => void;
}

const DemoContext = createContext<DemoContextValue | undefined>(undefined);

export const DemoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(demoReducer, undefined, getInitialState);

  // Sync to localStorage
  useEffect(() => {
    try {
      const { toast, ...toPersist } = state;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toPersist));
    } catch {
      // storage quota or incognito
    }
  }, [state]);

  // Auto-dismiss toast
  useEffect(() => {
    if (state.toast) {
      const timer = setTimeout(() => {
        dispatch({ type: 'HIDE_TOAST' });
      }, 4200);
      return () => clearTimeout(timer);
    }
  }, [state.toast]);

  const resetDemo = () => {
    dispatch({ type: 'RESET_DEMO' });
  };

  const showToast = (message: string, type: ToastNotification['type'] = 'info', subtitle?: string) => {
    dispatch({ type: 'SHOW_TOAST', payload: { message, type, subtitle } });
  };

  return (
    <DemoContext.Provider value={{ state, dispatch, resetDemo, showToast }}>
      {children}
    </DemoContext.Provider>
  );
};

export const useDemo = () => {
  const context = useContext(DemoContext);
  if (!context) {
    throw new Error('useDemo must be used within a DemoProvider');
  }
  return context;
};
