import { PipelineItem } from '../types';

export const INITIAL_PIPELINE: PipelineItem[] = [
  {
    id: 'pipe-1',
    candidateId: 'cand-erik-lindstrom',
    requirementId: 'req-got-elec',
    stage: 'Shortlisted',
    matchScore: 92,
    updatedAt: '2026-10-18 14:22',
    notes: 'Exceptional match. Verified ECY and SSG Entre. Ready for technical conversation.'
  },
  {
    id: 'pipe-2',
    candidateId: 'cand-sofia-nilsson',
    requirementId: 'req-mal-mech',
    stage: 'Contact Requested',
    matchScore: 88,
    updatedAt: '2026-10-17 11:30',
    notes: 'Direct contact request dispatched via verified candidate portal.'
  },
  {
    id: 'pipe-3',
    candidateId: 'cand-johan-berg',
    requirementId: 'req-stk-auto',
    stage: 'Interview',
    matchScore: 84,
    updatedAt: '2026-10-16 16:15',
    notes: 'Interview scheduled with Chief Automation Architect for Wednesday 14:00 CET.'
  },
  {
    id: 'pipe-4',
    candidateId: 'cand-lina-andersson',
    requirementId: 'req-upp-hvac',
    stage: 'New Match',
    matchScore: 81,
    updatedAt: '2026-10-18 09:10',
    notes: 'Automated match produced from Uppsala hospital emergency requirement.'
  },
  {
    id: 'pipe-5',
    candidateId: 'cand-marcus-holm',
    requirementId: 'req-mal-mech',
    stage: 'Decision',
    matchScore: 78,
    updatedAt: '2026-10-15 13:40',
    notes: 'Reference check completed. Offer letter pending final internal signoff.'
  },
  {
    id: 'pipe-6',
    candidateId: 'cand-freja-larsson',
    requirementId: 'req-ume-wind',
    stage: 'Shortlisted',
    matchScore: 94,
    updatedAt: '2026-10-16 10:05',
    notes: 'GWO certification confirmed. Wind turbine specialist top candidate.'
  },
  {
    id: 'pipe-7',
    candidateId: 'cand-astrid-lindgren',
    requirementId: 'req-got-elec',
    stage: 'New Match',
    matchScore: 89,
    updatedAt: '2026-10-17 15:20',
    notes: 'Overqualified for standard maintenance, excellent for lead inspection role.'
  }
];
