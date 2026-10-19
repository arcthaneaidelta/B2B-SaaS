export interface PlanTier {
  id: 'starter' | 'growth' | 'scale';
  name: string;
  monthlyPrice: number;
  quarterlyMonthlyEquivalent: number;
  description: string;
  badge?: string;
  isPopular?: boolean;
  recordsPerMonth: number;
  senderProfiles: number | 'Unlimited';
  features: string[];
  specs: {
    csvMerge: boolean;
    errorAlerts: boolean;
    priorityWindow: boolean;
    dedicatedChannel: boolean;
    retryAutomation: boolean;
    customTemplates: number;
  };
}

export const PLANS: PlanTier[] = [
  {
    id: 'starter',
    name: 'Starter',
    monthlyPrice: 49,
    quarterlyMonthlyEquivalent: 44,
    description: 'Essential pipeline for emerging B2B senders with standard volume.',
    recordsPerMonth: 100,
    senderProfiles: 1,
    features: [
      '100 records / month',
      '1 verified sender profile',
      'Google Sheets auto-sync',
      'Email support (24h SLA)',
      'Standard Make.com run window',
    ],
    specs: {
      csvMerge: false,
      errorAlerts: false,
      priorityWindow: false,
      dedicatedChannel: false,
      retryAutomation: true,
      customTemplates: 2,
    },
  },
  {
    id: 'growth',
    name: 'Growth',
    monthlyPrice: 149,
    quarterlyMonthlyEquivalent: 134,
    description: 'Full-featured automated workflow with CSV merge and instant failure alerts.',
    isPopular: true,
    badge: 'Most chosen',
    recordsPerMonth: 500,
    senderProfiles: 5,
    features: [
      '500 records / month',
      '5 verified sender profiles',
      'Multi-row CSV key merge',
      'Real-time error alerts to email',
      'Break module automated retry',
      'Payload inspector & mapping logs',
    ],
    specs: {
      csvMerge: true,
      errorAlerts: true,
      priorityWindow: false,
      dedicatedChannel: false,
      retryAutomation: true,
      customTemplates: 8,
    },
  },
  {
    id: 'scale',
    name: 'Scale',
    monthlyPrice: 349,
    quarterlyMonthlyEquivalent: 314,
    description: 'High-volume production fulfillment with dedicated oversight and priority routing.',
    recordsPerMonth: 2000,
    senderProfiles: 'Unlimited',
    features: [
      '2,000 records / month',
      'Unlimited sender profiles',
      'Priority scenario run window',
      'Dedicated Slack/email channel',
      'Custom webhook triggers',
      'Monthly retainer monitoring included',
    ],
    specs: {
      csvMerge: true,
      errorAlerts: true,
      priorityWindow: true,
      dedicatedChannel: true,
      retryAutomation: true,
      customTemplates: 25,
    },
  },
];

export const PLAN_FEATURE_MATRIX = [
  { name: 'Monthly record allowance', starter: '100', growth: '500', scale: '2,000' },
  { name: 'Sender profiles', starter: '1', growth: '5', scale: 'Unlimited' },
  { name: 'Multi-row CSV key merge', starter: '—', growth: 'Included', scale: 'Included' },
  { name: 'Automated error alerts', starter: 'Daily digest', growth: 'Instant email', scale: 'Instant Slack + Email' },
  { name: 'Make.com Break & Retry loop', starter: '1 retry', growth: '3 retries (5m interval)', scale: '5 retries (adaptive)' },
  { name: 'Payload transformation', starter: 'Standard', growth: 'Advanced regex + titleCase', scale: 'Custom JSON schemes' },
  { name: 'Sandbox test runner', starter: 'Included', growth: 'Included', scale: 'Included' },
  { name: 'Support SLA', starter: '24 hours', growth: '8 hours', scale: '1 hour priority' },
];
