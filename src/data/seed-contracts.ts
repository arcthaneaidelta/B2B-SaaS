import { ContractAgreement } from '../types';

export const INITIAL_CONTRACTS: ContractAgreement[] = [
  {
    id: 'ctr-001',
    name: 'Nordic Industrial Solutions – Verified Electrician Master Agreement',
    companyName: 'Nordic Industrial Solutions AB',
    candidateName: 'Erik Lindström',
    template: 'Standard Placement Framework',
    createdAt: '2026-10-12',
    sentDate: '2026-10-14',
    signedDate: '2026-10-16',
    expiryDate: '2027-10-16',
    status: 'Signed',
    signatoryEmail: 'alex.morgan@nordicindustrial.se',
    signatoryName: 'Alex Morgan',
    valueSEK: 145000,
    isSimulated: true,
    history: [
      { date: '2026-10-12 09:30', action: 'Draft agreement prepared from template', actor: 'Alex Morgan' },
      { date: '2026-10-14 11:15', action: 'Agreement dispatched for simulated signature', actor: 'Alex Morgan' },
      { date: '2026-10-15 14:20', action: 'Agreement opened and reviewed by counterparty', actor: 'Erik Lindström' },
      { date: '2026-10-16 16:45', action: 'Simulated digital signature executed', actor: 'Erik Lindström' }
    ]
  },
  {
    id: 'ctr-002',
    name: 'Automation Consultant Framework Agreement Q4',
    companyName: 'Nordic Industrial Solutions AB',
    candidateName: 'Johan Berg',
    template: 'Master Services Subcontract',
    createdAt: '2026-10-15',
    sentDate: '2026-10-16',
    expiryDate: '2027-04-15',
    status: 'Viewed',
    signatoryEmail: 'johan.berg@automation-nordic.se',
    signatoryName: 'Johan Berg',
    valueSEK: 280000,
    isSimulated: true,
    history: [
      { date: '2026-10-15 10:00', action: 'Contract created from Master Services template', actor: 'Alex Morgan' },
      { date: '2026-10-16 09:12', action: 'Contract dispatched for recipient review', actor: 'Alex Morgan' },
      { date: '2026-10-17 11:05', action: 'Recipient opened agreement document', actor: 'Johan Berg' }
    ]
  },
  {
    id: 'ctr-003',
    name: 'Skåne Packaging Mechanical Support SLA',
    companyName: 'Tetra Pak Partner Network',
    candidateName: 'Sofia Nilsson',
    template: 'Direct Hire Guarantee',
    createdAt: '2026-10-16',
    sentDate: '2026-10-17',
    expiryDate: '2027-10-17',
    status: 'Sent',
    signatoryEmail: 'sofia.nilsson@skanetech.se',
    signatoryName: 'Sofia Nilsson',
    valueSEK: 95000,
    isSimulated: true,
    history: [
      { date: '2026-10-16 14:00', action: 'Agreement drafted and approved internally', actor: 'Alex Morgan' },
      { date: '2026-10-17 08:30', action: 'Dispatched to candidate via simulated email', actor: 'Alex Morgan' }
    ]
  },
  {
    id: 'ctr-004',
    name: 'Hospital HVAC Urgent Maintenance Term Sheet',
    companyName: 'Region Uppsala Fastigheter',
    candidateName: 'Lina Andersson',
    template: 'Standard Placement Framework',
    createdAt: '2026-10-18',
    expiryDate: '2026-11-18',
    status: 'Draft',
    signatoryEmail: 'uppsala.hvac@region.se',
    signatoryName: 'Lina Andersson',
    valueSEK: 68000,
    isSimulated: true,
    history: [
      { date: '2026-10-18 16:10', action: 'Draft initial terms created', actor: 'Alex Morgan' }
    ]
  },
  {
    id: 'ctr-005',
    name: 'Vattenfall Wind Farm Substation Safety Protocol NDA',
    companyName: 'Vattenfall Onshore Services',
    candidateName: 'Freja Larsson',
    template: 'NDA & Verification Protocol',
    createdAt: '2026-09-01',
    sentDate: '2026-09-02',
    signedDate: '2026-09-03',
    expiryDate: '2026-10-01',
    status: 'Expired',
    signatoryEmail: 'freja.larsson@nordicwind.se',
    signatoryName: 'Freja Larsson',
    valueSEK: 0,
    isSimulated: true,
    history: [
      { date: '2026-09-01 10:00', action: 'Created', actor: 'Alex Morgan' },
      { date: '2026-10-01 00:00', action: 'Agreement reached expiration date without renewal', actor: 'System' }
    ]
  },
  {
    id: 'ctr-006',
    name: 'Electrolux Assembly Line Controls Subcontract',
    companyName: 'Electrolux Home Products Sweden',
    candidateName: 'Gustav Eklund',
    template: 'Master Services Subcontract',
    createdAt: '2026-09-10',
    sentDate: '2026-09-11',
    expiryDate: '2027-03-10',
    status: 'Cancelled',
    signatoryEmail: 'gustav.eklund@iot-nordic.se',
    signatoryName: 'Gustav Eklund',
    valueSEK: 120000,
    isSimulated: true,
    history: [
      { date: '2026-09-10 11:20', action: 'Created draft', actor: 'Alex Morgan' },
      { date: '2026-09-15 15:40', action: 'Cancelled by employer due to scope revision', actor: 'Alex Morgan' }
    ]
  }
];
