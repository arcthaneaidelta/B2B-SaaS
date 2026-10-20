import { AuditEvent } from '../types';

export const INITIAL_ACTIVITY: AuditEvent[] = [
  {
    id: 'act-1',
    timestamp: '12 min ago',
    actor: 'Sofia Berg',
    actorRole: 'Verification Officer',
    category: 'Verification',
    action: 'Qualification review completed',
    details: 'ECY Full Professional Electrician Certificate validated for Erik Lindström.'
  },
  {
    id: 'act-2',
    timestamp: '1 h ago',
    actor: 'Erik Lindström',
    actorRole: 'Candidate',
    category: 'Matching',
    action: 'Candidate confirmed availability',
    details: 'Updated status to Immediate availability with Regional travel flexibility.'
  },
  {
    id: 'act-3',
    timestamp: '3 h ago',
    actor: 'Alex Morgan',
    actorRole: 'Employer',
    category: 'Matching',
    action: 'New requirement created',
    details: 'Created "Industrial Electrician" (Gothenburg) with deterministic criteria matching.'
  },
  {
    id: 'act-4',
    timestamp: 'Yesterday',
    actor: 'Alex Morgan',
    actorRole: 'Employer',
    category: 'Pipeline',
    action: 'Shortlist updated',
    details: 'Added Erik Lindström (92% match) to "Gothenburg Electrical Team".'
  },
  {
    id: 'act-5',
    timestamp: 'Yesterday',
    actor: 'Sofia Berg',
    actorRole: 'Verification Officer',
    category: 'Verification',
    action: 'Reference check verified',
    details: 'Completed supervisor verification for Sofia Nilsson at Tetra Pak.'
  },
  {
    id: 'act-6',
    timestamp: '2 days ago',
    actor: 'Alex Morgan',
    actorRole: 'Employer',
    category: 'Contract',
    action: 'Simulated contract executed',
    details: 'Simulated e-signature recorded for "Nordic Industrial – Verified Electrician Master Agreement".'
  },
  {
    id: 'act-7',
    timestamp: '3 days ago',
    actor: 'Robin Andersson',
    actorRole: 'Platform Administrator',
    category: 'Security',
    action: 'Matching weights updated',
    details: 'Recalibrated default industrial experience weight to 35% across platform.'
  },
  {
    id: 'act-8',
    timestamp: '3 days ago',
    actor: 'Freja Larsson',
    actorRole: 'Candidate',
    category: 'Verification',
    action: 'Digital Passport shared',
    details: 'Generated secure time-limited verification share code for Vattenfall project.'
  },
  {
    id: 'act-9',
    timestamp: '4 days ago',
    actor: 'Alex Morgan',
    actorRole: 'Employer',
    category: 'Subscription',
    action: 'Plan upgraded to Growth Scale',
    details: 'Unlocked 15 active requirements quota and 50 candidate contact unlocks.'
  },
  {
    id: 'act-10',
    timestamp: '5 days ago',
    actor: 'Sofia Berg',
    actorRole: 'Verification Officer',
    category: 'Verification',
    action: 'Expiration notice dispatched',
    details: 'Flagged GWO BST certification for Freja Larsson expiring in 30 days.'
  },
  {
    id: 'act-11',
    timestamp: '6 days ago',
    actor: 'Johan Berg',
    actorRole: 'Candidate',
    category: 'Verification',
    action: 'Ladok degree verified',
    details: 'M.Sc. Mechatronics from KTH confirmed through official registry query.'
  },
  {
    id: 'act-12',
    timestamp: '1 week ago',
    actor: 'Robin Andersson',
    actorRole: 'Platform Administrator',
    category: 'Security',
    action: 'Demo sandbox initialized',
    details: 'Seeded verified Swedish professional directory with strict synthetic data markers.'
  }
];
