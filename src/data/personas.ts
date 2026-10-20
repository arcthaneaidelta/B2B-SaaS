import { Persona } from '../types';

export const DEMO_PERSONAS: Persona[] = [
  {
    id: 'employer',
    name: 'Alex Morgan',
    roleTitle: 'Head of Industrial Talent',
    organization: 'Nordic Industrial Solutions AB',
    avatarInitials: 'AM',
    description: 'Employer view: browse explainable matches, create workforce requirements, shortlist candidates, manage pipeline and view contracts.',
    defaultPath: '/app/employer/overview'
  },
  {
    id: 'candidate',
    name: 'Erik Lindström',
    roleTitle: 'Senior Industrial Electrician',
    organization: 'Verified Candidate (Gothenburg)',
    avatarInitials: 'EL',
    description: 'Candidate view: manage qualifications, passport credentials, privacy sharing, and inspect verified certifications.',
    defaultPath: '/app/candidate/overview'
  },
  {
    id: 'verifier',
    name: 'Sofia Berg',
    roleTitle: 'Senior Verification Officer',
    organization: 'VERITY Nordic Verification Bureau',
    avatarInitials: 'SB',
    description: 'Verification console: inspect case evidence, approve or reject certificates, record reference checks, audit expirations.',
    defaultPath: '/app/verification/overview'
  },
  {
    id: 'admin',
    name: 'Robin Andersson',
    roleTitle: 'Platform Administrator',
    organization: 'VERITY HQ (Stockholm)',
    avatarInitials: 'RA',
    description: 'System admin: configure matching weights, manage verification rules, inspect audit logs and demo settings.',
    defaultPath: '/app/admin/overview'
  }
];
