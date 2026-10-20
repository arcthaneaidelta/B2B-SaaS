import { VerificationCase } from '../types';

export const INITIAL_CASES: VerificationCase[] = [
  {
    id: 'case-101',
    candidateId: 'cand-erik-lindstrom',
    candidateName: 'Erik Lindström',
    candidateRole: 'Industrial Electrician',
    evidenceTitle: 'ECY Full Professional Electrician Certificate',
    category: 'Electrical Certificate',
    submissionDate: '2026-10-10',
    reviewer: 'Sofia Berg',
    priority: 'High',
    status: 'Approved',
    notes: [
      'Document matched against Elbranschens Centrala Yrkesnämnd registry.',
      'Physical holographic watermark and national personnummer verified.'
    ],
    checklist: [
      { item: 'National personal identity number matches official records', checked: true },
      { item: 'Issuing body ECY accreditation valid and active', checked: true },
      { item: 'No disciplinary sanctions registered with Elsäkerhetsverket', checked: true },
      { item: 'Digital cryptographic signature verified', checked: true }
    ],
    referenceCheckResult: 'Confirmed by Bravida branch manager Olof Ekman (Positive rating 5/5)',
    interviewOutcome: 'Technical phone screening completed 2026-10-09. Full domain competence confirmed.'
  },
  {
    id: 'case-102',
    candidateId: 'cand-erik-lindstrom',
    candidateName: 'Erik Lindström',
    candidateRole: 'Industrial Electrician',
    evidenceTitle: 'Thermography Level 1 Certification',
    category: 'Equipment Operation',
    submissionDate: '2026-10-18',
    reviewer: 'Sofia Berg',
    priority: 'Normal',
    status: 'Pending',
    notes: [
      'Submitted by candidate via digital portal on 18 Oct 2026.',
      'Awaiting secondary accreditation registry confirmation.'
    ],
    checklist: [
      { item: 'Infrared Training Center verification code checked', checked: false },
      { item: 'Document dates fall within valid operational validity window', checked: true },
      { item: 'Resolution and legibility of scanned certificate sufficient', checked: true }
    ]
  },
  {
    id: 'case-103',
    candidateId: 'cand-sofia-nilsson',
    candidateName: 'Sofia Nilsson',
    candidateRole: 'Mechanical Technician',
    evidenceTitle: 'Swedish Vocational Mechanical Diploma',
    category: 'Degree / Vocational',
    submissionDate: '2026-10-11',
    reviewer: 'Robin Andersson',
    priority: 'Normal',
    status: 'In review',
    notes: [
      'YH vocational exam records requested from Skåne municipality education archive.',
      'Direct contact initiated with registrar.'
    ],
    checklist: [
      { item: 'Vocational program curriculum aligned with standard YH requirements', checked: true },
      { item: 'Direct registrar response received', checked: false },
      { item: 'Practical apprenticeship hours confirmed', checked: true }
    ]
  },
  {
    id: 'case-104',
    candidateId: 'cand-johan-berg',
    candidateName: 'Johan Berg',
    candidateRole: 'Automation Engineer',
    evidenceTitle: 'ABB Robotics Certified Lead Programmer',
    category: 'Equipment Operation',
    submissionDate: '2026-10-14',
    reviewer: 'Sofia Berg',
    priority: 'High',
    status: 'More info needed',
    notes: [
      'Uploaded scan has slight corner clipping obscuring the serial certification badge.',
      'Requested uncompressed high-resolution digital copy from candidate.'
    ],
    checklist: [
      { item: 'ABB Robotics course module code verifiable', checked: true },
      { item: 'Full certificate perimeter visible with clear seal', checked: false },
      { item: 'Identification number matches candidate name', checked: true }
    ],
    interviewOutcome: 'Client review requested expedited verification.'
  },
  {
    id: 'case-105',
    candidateId: 'cand-lina-andersson',
    candidateName: 'Lina Andersson',
    candidateRole: 'HVAC Technician',
    evidenceTitle: 'Swedish F-Gas Refrigerant Certificate Cat 1',
    category: 'Equipment Operation',
    submissionDate: '2026-10-15',
    reviewer: 'Unassigned',
    priority: 'High',
    status: 'Pending',
    expiryDate: '2027-04-10',
    notes: [
      'New submission for urgent Uppsala hospital contract requirement.',
      'Ready for initial review assignment.'
    ],
    checklist: [
      { item: 'INCERT database check for Category 1 authorization', checked: false },
      { item: 'Environmental safety training course certified', checked: false },
      { item: 'Candidate ID confirmed via BankID test credential', checked: true }
    ]
  },
  {
    id: 'case-106',
    candidateId: 'cand-marcus-holm',
    candidateName: 'Marcus Holm',
    candidateRole: 'Maintenance Technician',
    evidenceTitle: 'Employer Work Reference - Hitachi Energy',
    category: 'Work Reference',
    submissionDate: '2026-10-14',
    reviewer: 'Robin Andersson',
    priority: 'Normal',
    status: 'In review',
    notes: [
      'Verifying 5 years of heavy transformer assembly reliability records.',
      'Scheduled verification call with production manager.'
    ],
    checklist: [
      { item: 'Direct corporate email verified from corporate domain', checked: true },
      { item: 'Role title and employment duration match candidate resume', checked: true },
      { item: 'Verbal confirmation phone interview completed', checked: false }
    ],
    referenceCheckResult: 'Awaiting phone callback scheduled for tomorrow 10:00 CET.'
  },
  {
    id: 'case-107',
    candidateId: 'cand-freja-larsson',
    candidateName: 'Freja Larsson',
    candidateRole: 'Renewable Energy Specialist',
    evidenceTitle: 'GWO Basic Safety Training (BST) Modules',
    category: 'Safety / ID06',
    submissionDate: '2026-10-10',
    reviewer: 'Sofia Berg',
    priority: 'Normal',
    status: 'Approved',
    expiryDate: '2026-11-19',
    notes: [
      'Expiring in roughly 30 days! Candidate flagged for refresher reminder.',
      'Verified via GWO WINDA global database.'
    ],
    checklist: [
      { item: 'WINDA WIN ID verified against profile', checked: true },
      { item: 'First Aid, Manual Handling, Fire Awareness all passed', checked: true },
      { item: 'Working at Heights module active', checked: true }
    ]
  },
  {
    id: 'case-108',
    candidateId: 'cand-emil-svensson',
    candidateName: 'Emil Svensson',
    candidateRole: 'Robotics Commissioning Engineer',
    evidenceTitle: 'KUKA Expert Robot Programming Cert',
    category: 'Equipment Operation',
    submissionDate: '2026-10-16',
    reviewer: 'Sofia Berg',
    priority: 'Low',
    status: 'In review',
    notes: [
      'Candidate submitted KRC4 advanced motion programming certificate.',
      'Reviewing against manufacturer training center logs.'
    ],
    checklist: [
      { item: 'KUKA Nordic training center serial verification', checked: false },
      { item: 'Scope covers safe operation and velocity override protocols', checked: true }
    ]
  }
];
