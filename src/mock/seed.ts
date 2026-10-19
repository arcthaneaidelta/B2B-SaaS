export interface CustomerAccount {
  accountId: string;
  company: string;
  ownerName: string;
  ownerTitle: string;
  email: string;
  plan: 'Starter' | 'Growth' | 'Scale';
  cadence: 'Monthly' | 'Quarterly';
  template: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
  };
  attributes: {
    includeLogo: boolean;
    personalizeFirstName: boolean;
    addReferenceCode: boolean;
  };
  submittedAt: string;
  isNew?: boolean;
}

export interface CsvRecipientRow {
  rowId: number;
  accountId: string;
  recipientName: string;
  recipientTitle?: string;
  recipientCompany?: string;
  addressLine1: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  referenceCode: string;
  issueType?: 'MISSING_POSTCODE' | 'DUPLICATE_KEY' | 'ORPHAN_ACCOUNT';
}

export interface MergedRecord {
  recordId: string;
  accountId: string;
  company: string;
  senderName: string;
  senderTitle: string;
  senderAddress: CustomerAccount['address'];
  recipientName: string;
  recipientAddress: {
    line1: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
  };
  template: string;
  referenceCode: string;
  attributes: CustomerAccount['attributes'];
  status: 'READY' | 'PROCESSED' | 'FAILED' | 'RETRYING';
}

export interface ErrorLogItem {
  id: string;
  timestamp: string;
  runId: string;
  rowNumber: number;
  accountId: string;
  company: string;
  errorType: 'MISSING_FIELD' | 'INVALID_POSTCODE' | 'DUPLICATE_KEY' | 'ORPHAN_ACCOUNT' | 'API_5XX' | 'RATE_LIMIT';
  failingField: string;
  message: string;
  suggestedFix: string;
  status: 'Open' | 'Retrying' | 'Resolved' | 'Needs data fix';
  rawRecord: Partial<CsvRecipientRow>;
}

export interface RunHistoryItem {
  id: string;
  trigger: 'Schedule' | 'Manual' | 'Sandbox Test';
  startedAt: string;
  duration: string;
  durationSec: number;
  recordsCount: number;
  deliveredCount: number;
  errorsCount: number;
  status: 'Success' | 'Partial Failure' | 'Break / Retry' | 'Running';
  modulesStats: {
    watchRows: number;
    parseDrive: number;
    parseCsv: number;
    iterator: number;
    validateMap: number;
    sendApi: number;
    updateStatus: number;
    breakRoute: number;
    errorLog: number;
  };
}

export const SEEDED_ACCOUNTS: CustomerAccount[] = [
  {
    accountId: "ACCT-0417",
    company: "Northgate Dental",
    ownerName: "Priya Raman",
    ownerTitle: "Practice Manager",
    email: "priya@northgatedental.com",
    plan: "Growth",
    cadence: "Monthly",
    template: "welcome_v2",
    address: {
      line1: "214 Elm Street",
      city: "Columbus",
      state: "OH",
      postcode: "43215",
      country: "US"
    },
    attributes: {
      includeLogo: true,
      personalizeFirstName: true,
      addReferenceCode: true
    },
    submittedAt: "2026-10-19 08:42"
  },
  {
    accountId: "ACCT-0392",
    company: "Harbor & Pine Realty",
    ownerName: "Marcus Ellery",
    ownerTitle: "Principal Broker",
    email: "m.ellery@harborpine.com",
    plan: "Scale",
    cadence: "Quarterly",
    template: "closing_gift_v3",
    address: {
      line1: "740 Waterfront Drive",
      city: "Portland",
      state: "ME",
      postcode: "04101",
      country: "US"
    },
    attributes: {
      includeLogo: true,
      personalizeFirstName: true,
      addReferenceCode: true
    },
    submittedAt: "2026-10-18 16:15"
  },
  {
    accountId: "ACCT-0455",
    company: "Fieldstone Insurance",
    ownerName: "Hannah Voss",
    ownerTitle: "Client Director",
    email: "hvoss@fieldstoneins.com",
    plan: "Starter",
    cadence: "Monthly",
    template: "policy_anniversary",
    address: {
      line1: "1200 Market St",
      city: "Denver",
      state: "CO",
      postcode: "80202",
      country: "US"
    },
    attributes: {
      includeLogo: false,
      personalizeFirstName: true,
      addReferenceCode: true
    },
    submittedAt: "2026-10-18 11:30"
  },
  {
    accountId: "ACCT-0431",
    company: "Brightwater Law",
    ownerName: "Oluwaseun Adeyemi",
    ownerTitle: "Managing Partner",
    email: "adeyemi@brightwaterlaw.com",
    plan: "Growth",
    cadence: "Monthly",
    template: "retainer_welcome",
    address: {
      line1: "500 Capitol Square",
      city: "Richmond",
      state: "VA",
      postcode: "23219",
      country: "US"
    },
    attributes: {
      includeLogo: true,
      personalizeFirstName: true,
      addReferenceCode: false
    },
    submittedAt: "2026-10-17 14:20"
  },
  {
    accountId: "ACCT-0408",
    company: "Ridgeline Physio",
    ownerName: "Tomás Herrera",
    ownerTitle: "Clinical Director",
    email: "tomas@ridgelinephysio.com",
    plan: "Starter",
    cadence: "Monthly",
    template: "recovery_milestone",
    address: {
      line1: "330 Boulder Peak Way",
      city: "Salt Lake City",
      state: "UT",
      postcode: "84101",
      country: "US"
    },
    attributes: {
      includeLogo: false,
      personalizeFirstName: true,
      addReferenceCode: true
    },
    submittedAt: "2026-10-17 09:12"
  },
  {
    accountId: "ACCT-0463",
    company: "Copperleaf Mortgage",
    ownerName: "Naomi Fischer",
    ownerTitle: "Lending VP",
    email: "fischer@copperleafmortgage.com",
    plan: "Scale",
    cadence: "Quarterly",
    template: "rate_lock_welcome",
    address: {
      line1: "888 Financial Parkway",
      city: "Charlotte",
      state: "NC",
      postcode: "28202",
      country: "US"
    },
    attributes: {
      includeLogo: true,
      personalizeFirstName: true,
      addReferenceCode: true
    },
    submittedAt: "2026-10-16 17:45"
  },
  {
    accountId: "ACCT-0472",
    company: "Alderwood Wealth",
    ownerName: "Jonathan Crane",
    ownerTitle: "Wealth Advisor",
    email: "jcrane@alderwoodwealth.com",
    plan: "Growth",
    cadence: "Monthly",
    template: "quarterly_review",
    address: {
      line1: "450 Bellevue Center",
      city: "Seattle",
      state: "WA",
      postcode: "98004",
      country: "US"
    },
    attributes: {
      includeLogo: true,
      personalizeFirstName: false,
      addReferenceCode: true
    },
    submittedAt: "2026-10-16 10:05"
  },
  {
    accountId: "ACCT-0480",
    company: "Beacon Health Partners",
    ownerName: "Dr. Evelyn Vance",
    ownerTitle: "COO",
    email: "evance@beaconpartners.org",
    plan: "Scale",
    cadence: "Quarterly",
    template: "provider_welcome",
    address: {
      line1: "15 Medical Center Blvd",
      city: "Boston",
      state: "MA",
      postcode: "02115",
      country: "US"
    },
    attributes: {
      includeLogo: true,
      personalizeFirstName: true,
      addReferenceCode: true
    },
    submittedAt: "2026-10-15 13:22"
  },
  {
    accountId: "ACCT-0491",
    company: "Solis Architectural",
    ownerName: "Mateo Silva",
    ownerTitle: "Design Principal",
    email: "mateo@solisarchitecture.com",
    plan: "Growth",
    cadence: "Monthly",
    template: "design_handover",
    address: {
      line1: "100 Arts Plaza, Ste 400",
      city: "Austin",
      state: "TX",
      postcode: "78701",
      country: "US"
    },
    attributes: {
      includeLogo: true,
      personalizeFirstName: true,
      addReferenceCode: true
    },
    submittedAt: "2026-10-15 09:30"
  },
  {
    accountId: "ACCT-0504",
    company: "Highline Logistics",
    ownerName: "Karen MacIntyre",
    ownerTitle: "VP Operations",
    email: "kmacintyre@highlinelog.com",
    plan: "Starter",
    cadence: "Monthly",
    template: "partner_acknowledgment",
    address: {
      line1: "420 Industrial Access Rd",
      city: "Indianapolis",
      state: "IN",
      postcode: "46204",
      country: "US"
    },
    attributes: {
      includeLogo: false,
      personalizeFirstName: false,
      addReferenceCode: true
    },
    submittedAt: "2026-10-14 15:40"
  },
  {
    accountId: "ACCT-0518",
    company: "Vantage Engineering",
    ownerName: "Vikram Sethi",
    ownerTitle: "Technical Director",
    email: "vsethi@vantageeng.com",
    plan: "Growth",
    cadence: "Monthly",
    template: "site_signoff",
    address: {
      line1: "65 Tech Park Loop",
      city: "Pittsburgh",
      state: "PA",
      postcode: "15213",
      country: "US"
    },
    attributes: {
      includeLogo: true,
      personalizeFirstName: true,
      addReferenceCode: true
    },
    submittedAt: "2026-10-14 11:15"
  },
  {
    accountId: "ACCT-0527",
    company: "Cascade Biotech",
    ownerName: "Sarah Sterling",
    ownerTitle: "Chief of Staff",
    email: "sterling@cascadebio.com",
    plan: "Scale",
    cadence: "Quarterly",
    template: "trial_acknowledgment",
    address: {
      line1: "210 Innovation Way",
      city: "San Diego",
      state: "CA",
      postcode: "92121",
      country: "US"
    },
    attributes: {
      includeLogo: true,
      personalizeFirstName: true,
      addReferenceCode: false
    },
    submittedAt: "2026-10-13 16:50"
  },
  {
    accountId: "ACCT-0539",
    company: "Horizon Capital",
    ownerName: "Derek Lindqvist",
    ownerTitle: "Senior Partner",
    email: "d.lindqvist@horizoncap.com",
    plan: "Scale",
    cadence: "Monthly",
    template: "investor_quarterly",
    address: {
      line1: "55 Wall Street, Fl 18",
      city: "New York",
      state: "NY",
      postcode: "10005",
      country: "US"
    },
    attributes: {
      includeLogo: true,
      personalizeFirstName: true,
      addReferenceCode: true
    },
    submittedAt: "2026-10-13 10:14"
  },
  {
    accountId: "ACCT-0544",
    company: "Crestview Dental Studio",
    ownerName: "Elena Rostova",
    ownerTitle: "Clinic Director",
    email: "rostova@crestviewdental.com",
    plan: "Growth",
    cadence: "Monthly",
    template: "patient_care_pack",
    address: {
      line1: "780 Crestview Heights",
      city: "Minneapolis",
      state: "MN",
      postcode: "55402",
      country: "US"
    },
    attributes: {
      includeLogo: true,
      personalizeFirstName: true,
      addReferenceCode: true
    },
    submittedAt: "2026-10-12 14:08"
  }
];

export const SEEDED_CSV_ROWS: CsvRecipientRow[] = [
  { rowId: 1, accountId: "ACCT-0417", recipientName: "Daniel Ortiz", addressLine1: "88 Lakeview Ave", city: "Dayton", state: "OH", postcode: "45402", country: "US", referenceCode: "ND-0417-0091" },
  { rowId: 2, accountId: "ACCT-0417", recipientName: "Claire Beauchamp", addressLine1: "144 Highcrest St", city: "Cincinnati", state: "OH", postcode: "45202", country: "US", referenceCode: "ND-0417-0092" },
  { rowId: 3, accountId: "ACCT-0392", recipientName: "Arthur Pendelton", addressLine1: "52 Ocean Cliff Rd", city: "Cape Elizabeth", state: "ME", postcode: "04107", country: "US", referenceCode: "HP-0392-1044" },
  { rowId: 4, accountId: "ACCT-0392", recipientName: "Rebecca Chen", addressLine1: "9 Pine Hill Terrace", city: "Freeport", state: "ME", postcode: "04032", country: "US", referenceCode: "HP-0392-1045" },
  { rowId: 5, accountId: "ACCT-0455", recipientName: "Julian Ward", addressLine1: "410 Arapahoe Rd", city: "Boulder", state: "CO", postcode: "80302", country: "US", referenceCode: "FS-0455-0819" },
  { rowId: 6, accountId: "ACCT-0431", recipientName: "Theresa Gallagher", addressLine1: "305 Monument Ave", city: "Richmond", state: "VA", postcode: "23220", country: "US", referenceCode: "BW-0431-0301" },
  // Row 7 Deliberate Issue: MISSING POSTCODE per PRD §15
  { rowId: 7, accountId: "ACCT-0417", recipientName: "Kenneth Bradley", addressLine1: "712 Oakdale Lane", city: "Akron", state: "OH", postcode: "", country: "US", referenceCode: "ND-0417-0093", issueType: 'MISSING_POSTCODE' },
  { rowId: 8, accountId: "ACCT-0408", recipientName: "Megan O'Connor", addressLine1: "61 Wasatch Blvd", city: "Provo", state: "UT", postcode: "84601", country: "US", referenceCode: "RP-0408-0120" },
  { rowId: 9, accountId: "ACCT-0463", recipientName: "Geoffrey Hayes", addressLine1: "182 Piedmont Way", city: "Raleigh", state: "NC", postcode: "27601", country: "US", referenceCode: "CM-0463-0499" },
  { rowId: 10, accountId: "ACCT-0472", recipientName: "Fiona MacLeod", addressLine1: "900 Mercer St", city: "Seattle", state: "WA", postcode: "98109", country: "US", referenceCode: "AW-0472-0612" },
  { rowId: 11, accountId: "ACCT-0480", recipientName: "Dr. Alistair Finch", addressLine1: "77 Commonwealth Ave", city: "Boston", state: "MA", postcode: "02116", country: "US", referenceCode: "BH-0480-1102" },
  { rowId: 12, accountId: "ACCT-0491", recipientName: "Camila Gutierrez", addressLine1: "420 Congress Ave", city: "Austin", state: "TX", postcode: "78701", country: "US", referenceCode: "SA-0491-0544" },
  // Row 13 Deliberate Issue: DUPLICATE KEY per PRD §15 (same account & recipient name as row 4)
  { rowId: 13, accountId: "ACCT-0392", recipientName: "Rebecca Chen", addressLine1: "9 Pine Hill Terrace", city: "Freeport", state: "ME", postcode: "04032", country: "US", referenceCode: "HP-0392-1045", issueType: 'DUPLICATE_KEY' },
  { rowId: 14, accountId: "ACCT-0504", recipientName: "Warren Schultz", addressLine1: "880 Meridian St", city: "Carmel", state: "IN", postcode: "46032", country: "US", referenceCode: "HL-0504-0233" },
  { rowId: 15, accountId: "ACCT-0518", recipientName: "Deepak Patel", addressLine1: "54 Forbes Ave", city: "Pittsburgh", state: "PA", postcode: "15219", country: "US", referenceCode: "VE-0518-0781" },
  { rowId: 16, accountId: "ACCT-0527", recipientName: "Elena Moretti", addressLine1: "150 Torrey Pines Rd", city: "La Jolla", state: "CA", postcode: "92037", country: "US", referenceCode: "CB-0527-0902" },
  { rowId: 17, accountId: "ACCT-0539", recipientName: "Lawrence Sterling", addressLine1: "120 Broadway, Ste 300", city: "New York", state: "NY", postcode: "10271", country: "US", referenceCode: "HC-0539-1420" },
  { rowId: 18, accountId: "ACCT-0544", recipientName: "Ingrid Holm", addressLine1: "33 Nicollet Mall", city: "Minneapolis", state: "MN", postcode: "55401", country: "US", referenceCode: "CD-0544-0331" },
  // Row 19 Deliberate Issue: ORPHAN ACCOUNT per PRD §15 (ACCT-0999 not in profile list)
  { rowId: 19, accountId: "ACCT-0999", recipientName: "Gareth Thorne", addressLine1: "40 Blackfriars Bridge", city: "London", state: "Greater London", postcode: "EC4V 4DD", country: "UK", referenceCode: "UNK-0999-0012", issueType: 'ORPHAN_ACCOUNT' },
  { rowId: 20, accountId: "ACCT-0417", recipientName: "Brenda Crawford", addressLine1: "15 Scioto Mile", city: "Columbus", state: "OH", postcode: "43215", country: "US", referenceCode: "ND-0417-0094" },
  { rowId: 21, accountId: "ACCT-0431", recipientName: "Victor Vance", addressLine1: "920 Cary St", city: "Richmond", state: "VA", postcode: "23219", country: "US", referenceCode: "BW-0431-0302" },
  // Row 22 Deliberate Issue: SECOND ORPHAN ACCOUNT (ACCT-0888) to get exactly 21 merged, 2 orphaned, 1 duplicate
  { rowId: 22, accountId: "ACCT-0888", recipientName: "Constance Lee", addressLine1: "100 King St West", city: "Toronto", state: "ON", postcode: "M5X 1A9", country: "CA", referenceCode: "UNK-0888-0045", issueType: 'ORPHAN_ACCOUNT' },
  { rowId: 23, accountId: "ACCT-0463", recipientName: "Darren Boyd", addressLine1: "500 Trade St", city: "Charlotte", state: "NC", postcode: "28202", country: "US", referenceCode: "CM-0463-0500" },
  { rowId: 24, accountId: "ACCT-0472", recipientName: "Sylvia Ross", addressLine1: "210 Pike St", city: "Seattle", state: "WA", postcode: "98101", country: "US", referenceCode: "AW-0472-0613" },
];

export const SEEDED_ERRORS: ErrorLogItem[] = [
  {
    id: "ERR-2026-1019-01",
    timestamp: "2026-10-19 09:14:22",
    runId: "RUN-2026-1019-007",
    rowNumber: 7,
    accountId: "ACCT-0417",
    company: "Northgate Dental",
    errorType: "MISSING_FIELD",
    failingField: "postcode",
    message: "Postcode doesn't match the country selected. Check row 7.",
    suggestedFix: "Supply valid 5-digit US ZIP code (e.g. 44308 for Akron, OH)",
    status: "Open",
    rawRecord: {
      accountId: "ACCT-0417",
      recipientName: "Kenneth Bradley",
      addressLine1: "712 Oakdale Lane",
      city: "Akron",
      state: "OH",
      country: "US"
    }
  },
  {
    id: "ERR-2026-1019-02",
    timestamp: "2026-10-19 09:14:24",
    runId: "RUN-2026-1019-007",
    rowNumber: 13,
    accountId: "ACCT-0392",
    company: "Harbor & Pine Realty",
    errorType: "DUPLICATE_KEY",
    failingField: "account_id + recipientName",
    message: "Duplicate key detected for Rebecca Chen under ACCT-0392.",
    suggestedFix: "Verify if duplicate order was submitted or merge into single shipment bundle",
    status: "Needs data fix",
    rawRecord: {
      accountId: "ACCT-0392",
      recipientName: "Rebecca Chen",
      addressLine1: "9 Pine Hill Terrace",
      city: "Freeport",
      state: "ME",
      postcode: "04032"
    }
  },
  {
    id: "ERR-2026-1018-03",
    timestamp: "2026-10-18 16:32:10",
    runId: "RUN-2026-1018-006",
    rowNumber: 19,
    accountId: "ACCT-0999",
    company: "Unknown Account",
    errorType: "ORPHAN_ACCOUNT",
    failingField: "accountId",
    message: "No matching Customer Parameter profile found for ACCT-0999 in Google Sheets.",
    suggestedFix: "Complete onboarding form or update account ID mapping",
    status: "Open",
    rawRecord: {
      accountId: "ACCT-0999",
      recipientName: "Gareth Thorne",
      addressLine1: "40 Blackfriars Bridge",
      city: "London",
      postcode: "EC4V 4DD"
    }
  },
  {
    id: "ERR-2026-1017-04",
    timestamp: "2026-10-17 11:05:40",
    runId: "RUN-2026-1017-005",
    rowNumber: 3,
    accountId: "ACCT-0455",
    company: "Fieldstone Insurance",
    errorType: "API_5XX",
    failingField: "HTTP Endpoint",
    message: "Sandbox upstream 503 Service Unavailable on POST /v1/shipments",
    suggestedFix: "Handled by Make.com Break module (retried 3x, auto-resolved)",
    status: "Resolved",
    rawRecord: {
      accountId: "ACCT-0455",
      recipientName: "Julian Ward"
    }
  }
];

export const SEEDED_RUNS: RunHistoryItem[] = [
  {
    id: "RUN-2026-1019-007",
    trigger: "Schedule",
    startedAt: "2026-10-19 09:14:02",
    duration: "42s",
    durationSec: 42,
    recordsCount: 24,
    deliveredCount: 22,
    errorsCount: 2,
    status: "Partial Failure",
    modulesStats: {
      watchRows: 14,
      parseDrive: 1,
      parseCsv: 24,
      iterator: 24,
      validateMap: 24,
      sendApi: 22,
      updateStatus: 22,
      breakRoute: 2,
      errorLog: 2
    }
  },
  {
    id: "RUN-2026-1019-006",
    trigger: "Manual",
    startedAt: "2026-10-19 07:30:10",
    duration: "38s",
    durationSec: 38,
    recordsCount: 18,
    deliveredCount: 18,
    errorsCount: 0,
    status: "Success",
    modulesStats: {
      watchRows: 14,
      parseDrive: 1,
      parseCsv: 18,
      iterator: 18,
      validateMap: 18,
      sendApi: 18,
      updateStatus: 18,
      breakRoute: 0,
      errorLog: 0
    }
  },
  {
    id: "RUN-2026-1018-005",
    trigger: "Schedule",
    startedAt: "2026-10-18 18:00:00",
    duration: "45s",
    durationSec: 45,
    recordsCount: 32,
    deliveredCount: 31,
    errorsCount: 1,
    status: "Partial Failure",
    modulesStats: {
      watchRows: 14,
      parseDrive: 1,
      parseCsv: 32,
      iterator: 32,
      validateMap: 32,
      sendApi: 31,
      updateStatus: 31,
      breakRoute: 1,
      errorLog: 1
    }
  },
  {
    id: "RUN-2026-1018-004",
    trigger: "Sandbox Test",
    startedAt: "2026-10-18 14:12:33",
    duration: "29s",
    durationSec: 29,
    recordsCount: 12,
    deliveredCount: 12,
    errorsCount: 0,
    status: "Success",
    modulesStats: {
      watchRows: 12,
      parseDrive: 1,
      parseCsv: 12,
      iterator: 12,
      validateMap: 12,
      sendApi: 12,
      updateStatus: 12,
      breakRoute: 0,
      errorLog: 0
    }
  },
  {
    id: "RUN-2026-1017-003",
    trigger: "Schedule",
    startedAt: "2026-10-17 18:00:00",
    duration: "52s",
    durationSec: 52,
    recordsCount: 28,
    deliveredCount: 28,
    errorsCount: 0,
    status: "Break / Retry",
    modulesStats: {
      watchRows: 14,
      parseDrive: 1,
      parseCsv: 28,
      iterator: 28,
      validateMap: 28,
      sendApi: 28,
      updateStatus: 28,
      breakRoute: 1,
      errorLog: 1
    }
  },
  {
    id: "RUN-2026-1017-002",
    trigger: "Schedule",
    startedAt: "2026-10-17 09:00:00",
    duration: "40s",
    durationSec: 40,
    recordsCount: 20,
    deliveredCount: 20,
    errorsCount: 0,
    status: "Success",
    modulesStats: {
      watchRows: 14,
      parseDrive: 1,
      parseCsv: 20,
      iterator: 20,
      validateMap: 20,
      sendApi: 20,
      updateStatus: 20,
      breakRoute: 0,
      errorLog: 0
    }
  }
];
