import { SubscriptionPlan } from '../types';

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'starter',
    name: 'Starter Verification',
    priceMonthlySEK: 4900,
    priceAnnualSEK: 3900,
    seatLimit: 3,
    contactQuotaMonthly: 15,
    activeRequirementLimit: 3,
    features: [
      '3 Active Workforce Requirements',
      '15 Verified Candidate Contact Unlocks / mo',
      'Document & ID06 Credential Inspection',
      'Standard Explainable Matching Engine',
      'Direct Digital Passport Previews',
      'Standard Email Support (48h response)'
    ],
    supportLevel: 'Standard SLA (48h)'
  },
  {
    id: 'growth',
    name: 'Growth Scale',
    priceMonthlySEK: 11900,
    priceAnnualSEK: 9500,
    seatLimit: 10,
    contactQuotaMonthly: 50,
    activeRequirementLimit: 15,
    features: [
      '15 Active Workforce Requirements',
      '50 Verified Candidate Contact Unlocks / mo',
      'Priority Human-Led Evidence Verification',
      'Multi-seat Kanban Recruitment Pipeline',
      'Candidate Side-by-Side Comparison Matrix',
      'Simulated Contract Drafting & E-Signatures',
      'Expiring Certificate Alerts & Refresh Tracking',
      'Priority Support (4h response)'
    ],
    supportLevel: 'Priority SLA (4h)',
    popular: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise Industrial',
    priceMonthlySEK: 24900,
    priceAnnualSEK: 19900,
    seatLimit: 35,
    contactQuotaMonthly: 200,
    activeRequirementLimit: 50,
    features: [
      'Unlimited Workforce Requirements',
      '200+ Verified Candidate Contact Unlocks / mo',
      'Dedicated Verification Officer Assignment',
      'Custom Weighting & Scoring Criteria Rules',
      'Direct ATS & ERP Data Sync Readiness',
      'Unlimited Electronic Contract Templates',
      'Audit Trail Export & Compliance Logging',
      'Dedicated Customer Success Manager & 24/7 Phone SLA'
    ],
    supportLevel: 'Dedicated 24/7 Account Team'
  }
];

export interface IntegrationSlot {
  id: string;
  name: string;
  category: 'E-Signatures' | 'Payment Gateway' | 'Electronic ID' | 'Worksite Access' | 'Accounting ERP';
  provider: string;
  status: 'Ready for connection' | 'Configured (Sandbox)' | 'Not connected';
  description: string;
  badge: 'Demo preview';
}

export const INTEGRATION_SLOTS: IntegrationSlot[] = [
  {
    id: 'int-bankid',
    name: 'Swedish BankID (Svensk e-legitimation)',
    category: 'Electronic ID',
    provider: 'Finansiell ID-Teknik BID AB',
    status: 'Ready for connection',
    description: 'High-assurance level 3 (Tillitsnivå 3) personal identity verification for Swedish candidates and employers.',
    badge: 'Demo preview'
  },
  {
    id: 'int-id06',
    name: 'ID06 Competence Database Sync',
    category: 'Worksite Access',
    provider: 'ID06 AB Sweden',
    status: 'Ready for connection',
    description: 'Automated live validation of electrical, scaffolding, hot work, and construction competence credentials.',
    badge: 'Demo preview'
  },
  {
    id: 'int-oneflow',
    name: 'Oneflow / Scrive E-Signature API',
    category: 'E-Signatures',
    provider: 'Oneflow AB',
    status: 'Ready for connection',
    description: 'eIDAS compliant qualified electronic contract dispatch and audit logging for candidate placement.',
    badge: 'Demo preview'
  },
  {
    id: 'int-stripe',
    name: 'Stripe Billing & Invoicing (SEK)',
    category: 'Payment Gateway',
    provider: 'Stripe Payments Europe',
    status: 'Ready for connection',
    description: 'Automated B2B recurring subscription charging, VAT reverse-charge compliance, and invoice dispatch.',
    badge: 'Demo preview'
  },
  {
    id: 'int-fortnox',
    name: 'Fortnox / Visma ERP Connector',
    category: 'Accounting ERP',
    provider: 'Fortnox AB',
    status: 'Ready for connection',
    description: 'Direct bookkeeping synchronization for verified placement fees and subscription billing receipts.',
    badge: 'Demo preview'
  }
];
