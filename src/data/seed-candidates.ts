import { Candidate } from '../types';

export const INITIAL_CANDIDATES: Candidate[] = [
  {
    id: 'cand-erik-lindstrom',
    name: 'Erik Lindström',
    initials: 'EL',
    title: 'Industrial Electrician',
    location: 'Gothenburg, Sweden',
    availability: 'Immediate',
    experienceYears: 6,
    travelFlexibility: 'Regional (up to 50km)',
    verificationLevel: 'Document checked',
    rating: 4.9,
    passportId: 'PASS-SE-7849-EL',
    isPassportShared: true,
    summary: 'Experienced Swedish certified industrial electrician specializing in high-voltage industrial installations, automated cell power distribution, and preventive substation maintenance. Holds active ECY certificate and SSG Entre safety passport.',
    skills: ['High Voltage (10kV)', 'PLC Hardware Integration', 'SSG Entre', 'Switchgear Maintenance', 'CAD Electrical Schematics', 'Fault Diagnostics'],
    languages: [
      { language: 'Swedish', level: 'Native', confirmed: true },
      { language: 'English', level: 'Professional', confirmed: true }
    ],
    employmentHistory: [
      {
        role: 'Lead Installation Electrician',
        company: 'Volvo Cars Torslanda (via Assemblin)',
        location: 'Gothenburg',
        period: '2021 – Present',
        verified: true,
        description: 'Supervised industrial robotics power feeder cabling, cabinet assembly, and planned outage maintenance.'
      },
      {
        role: 'Industrial Electrician Apprentice & Tech',
        company: 'Bravida Nordic AB',
        location: 'Gothenburg',
        period: '2018 – 2021',
        verified: true,
        description: 'Executed planned maintenance cycles on manufacturing plants, variable frequency drives, and motor circuits.'
      }
    ],
    documents: [
      {
        id: 'doc-el-1',
        title: 'ECY Full Professional Electrician Certificate',
        category: 'Electrical Certificate',
        issuer: 'Elbranschens Centrala Yrkesnämnd (ECY)',
        issueDate: '2019-06-14',
        status: 'Document checked',
        lastReviewedDate: '2026-10-12',
        verifiedBy: 'Sofia Berg',
        documentNumber: 'ECY-2019-94821',
        fileSize: '1.4 MB PDF',
        notes: 'Certificate verified against ECY national registry. Seal validated.'
      },
      {
        id: 'doc-el-2',
        title: 'SSG Entre Industrial Safety Passport',
        category: 'Safety / ID06',
        issuer: 'SSG Standard Solutions Group',
        issueDate: '2025-03-10',
        expiryDate: '2028-03-10',
        status: 'Independently confirmed',
        lastReviewedDate: '2026-10-08',
        verifiedBy: 'Sofia Berg',
        documentNumber: 'SSG-ENTRE-449102',
        fileSize: '890 KB PDF',
        notes: 'Active safety passport registered for petrochemical and manufacturing plant access.'
      },
      {
        id: 'doc-el-3',
        title: 'ID06 Competence Card',
        category: 'Safety / ID06',
        issuer: 'ID06 AB Sweden',
        issueDate: '2024-01-15',
        expiryDate: '2029-01-15',
        status: 'Independently confirmed',
        lastReviewedDate: '2026-09-20',
        verifiedBy: 'Sofia Berg',
        documentNumber: 'ID06-SE-908123-EL',
        fileSize: '420 KB PDF'
      },
      {
        id: 'doc-el-4',
        title: 'Thermography Level 1 Certification',
        category: 'Equipment Operation',
        issuer: 'Infrared Training Center Nordic',
        issueDate: '2023-11-05',
        status: 'Submitted for review',
        lastReviewedDate: '2026-10-19',
        documentNumber: 'ITC-ND-8821',
        fileSize: '1.1 MB PDF',
        notes: 'Awaiting secondary seal verification.'
      }
    ],
    verificationHistory: [
      { id: 'vh-1', date: '2026-10-12', action: 'ECY Certificate verified', by: 'Sofia Berg', category: 'Electrical Certificate', note: 'Validated against national registry.' },
      { id: 'vh-2', date: '2026-10-08', action: 'SSG Entre Safety Passport confirmed', by: 'Sofia Berg', category: 'Safety / ID06', note: 'Direct database check completed.' },
      { id: 'vh-3', date: '2026-10-01', action: 'Profile registered & self-declared evidence uploaded', by: 'Erik Lindström', category: 'Account' }
    ],
    privacy: {
      anonymousInitialReview: false,
      directContactAllowed: true,
      shareFullDocumentsOnMatch: true,
      salaryExpectationPublic: false
    }
  },
  {
    id: 'cand-sofia-nilsson',
    name: 'Sofia Nilsson',
    initials: 'SN',
    title: 'Mechanical Technician',
    location: 'Malmö, Sweden',
    availability: '2 weeks notice',
    experienceYears: 5,
    travelFlexibility: 'Regional (up to 50km)',
    verificationLevel: 'Independently confirmed',
    rating: 4.8,
    passportId: 'PASS-SE-4120-SN',
    isPassportShared: true,
    summary: 'Precision mechanical technician with strong background in CNC calibration, hydraulic drive repair, and cleanroom packaging equipment in Skåne region.',
    skills: ['Hydraulic Troubleshooting', 'CNC Milling Calibration', 'Pneumatics', 'Precision Measurement', 'Bearing Diagnostics'],
    languages: [
      { language: 'Swedish', level: 'Native', confirmed: true },
      { language: 'English', level: 'Fluent', confirmed: true },
      { language: 'Danish', level: 'Professional', confirmed: false }
    ],
    employmentHistory: [
      {
        role: 'Mechanical Maintenance Lead',
        company: 'Tetra Pak Packaging Solutions',
        location: 'Lund',
        period: '2022 – Present',
        verified: true,
        description: 'Overseeing preventive line servicing on high-speed aseptic packaging machinery.'
      },
      {
        role: 'Tooling & Mechanical Fitter',
        company: 'Alfa Laval Nordic',
        location: 'Malmö',
        period: '2019 – 2022',
        verified: true,
        description: 'Assembled heat exchanger hydraulic compression plates and pressure test vessels.'
      }
    ],
    documents: [
      {
        id: 'doc-sn-1',
        title: 'Swedish Vocational Mechanical Engineering Diploma (Yrkeshögskola)',
        category: 'Degree / Vocational',
        issuer: 'Skåne Vocational Institute',
        issueDate: '2019-05-30',
        status: 'Independently confirmed',
        lastReviewedDate: '2026-10-11',
        verifiedBy: 'Sofia Berg',
        documentNumber: 'YH-MALMO-2019-551',
        fileSize: '2.1 MB PDF'
      },
      {
        id: 'doc-sn-2',
        title: 'Hydraulics Level II Specialist Certificate',
        category: 'Equipment Operation',
        issuer: 'Hydraulikutbildning Sverige',
        issueDate: '2022-09-14',
        status: 'Independently confirmed',
        lastReviewedDate: '2026-10-11',
        verifiedBy: 'Sofia Berg',
        documentNumber: 'HYS-8931-SE',
        fileSize: '1.2 MB PDF'
      }
    ],
    verificationHistory: [
      { id: 'vh-sn-1', date: '2026-10-11', action: 'Vocational Diploma independently confirmed', by: 'Sofia Berg', category: 'Degree / Vocational' },
      { id: 'vh-sn-2', date: '2026-10-11', action: 'Reference check completed with Tetra Pak supervisor', by: 'Sofia Berg', category: 'Work Reference', note: 'Verified 4 years of clean mechanical reliability track record.' }
    ],
    privacy: {
      anonymousInitialReview: false,
      directContactAllowed: true,
      shareFullDocumentsOnMatch: true,
      salaryExpectationPublic: true
    }
  },
  {
    id: 'cand-johan-berg',
    name: 'Johan Berg',
    initials: 'JB',
    title: 'Automation & Robotics Engineer',
    location: 'Stockholm, Sweden',
    availability: '1 month notice',
    experienceYears: 8,
    travelFlexibility: 'Sweden wide',
    verificationLevel: 'Document checked',
    rating: 4.95,
    passportId: 'PASS-SE-9012-JB',
    isPassportShared: true,
    summary: 'Senior Automation Engineer with extensive commissioning experience in Siemens TIA Portal, Beckhoff TwinCAT 3, and ABB RobotStudio IRC5/OmniCore systems.',
    skills: ['Siemens S7-1500 / TIA Portal', 'Beckhoff TwinCAT', 'ABB RobotStudio', 'Industrial Ethernet / Profinet', 'Safety PLC (Pilz)', 'SCADA / Ignition'],
    languages: [
      { language: 'Swedish', level: 'Native', confirmed: true },
      { language: 'English', level: 'Fluent', confirmed: true }
    ],
    employmentHistory: [
      {
        role: 'Senior Automation Consultant',
        company: 'ÅF Pöyry (AFRY)',
        location: 'Stockholm',
        period: '2020 – Present',
        verified: true,
        description: 'Delivered robotic palletizing and battery cell assembly lines for Swedish OEM clients.'
      },
      {
        role: 'Controls Engineer',
        company: 'Scania CV AB',
        location: 'Södertälje',
        period: '2016 – 2020',
        verified: true,
        description: 'Engineered engine assembly cell control architectures and functional safety circuits.'
      }
    ],
    documents: [
      {
        id: 'doc-jb-1',
        title: 'M.Sc. Mechatronics & Control Systems',
        category: 'Degree / Vocational',
        issuer: 'KTH Royal Institute of Technology',
        issueDate: '2016-06-15',
        status: 'Independently confirmed',
        lastReviewedDate: '2026-10-14',
        verifiedBy: 'Sofia Berg',
        documentNumber: 'KTH-2016-MECH-481',
        fileSize: '3.4 MB PDF'
      },
      {
        id: 'doc-jb-2',
        title: 'ABB Robotics Certified Lead Programmer',
        category: 'Equipment Operation',
        issuer: 'ABB Robotics University Västerås',
        issueDate: '2021-04-18',
        status: 'Document checked',
        lastReviewedDate: '2026-10-14',
        verifiedBy: 'Sofia Berg',
        documentNumber: 'ABB-ROB-99821'
      }
    ],
    verificationHistory: [
      { id: 'vh-jb-1', date: '2026-10-14', action: 'KTH Master Degree validated against Ladok', by: 'Sofia Berg', category: 'Degree / Vocational' }
    ],
    privacy: {
      anonymousInitialReview: false,
      directContactAllowed: true,
      shareFullDocumentsOnMatch: true,
      salaryExpectationPublic: false
    }
  },
  {
    id: 'cand-lina-andersson',
    name: 'Lina Andersson',
    initials: 'LA',
    title: 'HVAC & Heat Pump Specialist',
    location: 'Uppsala, Sweden',
    availability: 'Immediate',
    experienceYears: 4,
    travelFlexibility: 'Local only (within 20km)',
    verificationLevel: 'Document checked',
    rating: 4.75,
    passportId: 'PASS-SE-3381-LA',
    isPassportShared: true,
    summary: 'Certified cooling technician category 1 (Kylcertifikat Kategori 1) with hands-on expertise in commercial refrigeration, district heating exchanges, and geothermal heat pump retrofits.',
    skills: ['Kylcertifikat Kat 1 (F-Gas)', 'Refrigeration Cycle Diagnostics', 'Heat Exchanger Optimization', 'OVK Ventilation Compliance', 'Building Automation'],
    languages: [
      { language: 'Swedish', level: 'Native', confirmed: true },
      { language: 'English', level: 'Professional', confirmed: true }
    ],
    employmentHistory: [
      {
        role: 'Commercial HVAC Service Technician',
        company: 'Assemblin Ventilation AB',
        location: 'Uppsala',
        period: '2022 – Present',
        verified: true,
        description: 'Managed seasonal heat pump inspections, refrigerant recovery, and air volume balancing.'
      }
    ],
    documents: [
      {
        id: 'doc-la-1',
        title: 'Swedish F-Gas Refrigerant Certificate Cat 1',
        category: 'Equipment Operation',
        issuer: 'INCERT - Certification in Sweden',
        issueDate: '2022-04-10',
        expiryDate: '2027-04-10',
        status: 'Document checked',
        lastReviewedDate: '2026-10-15',
        verifiedBy: 'Sofia Berg',
        documentNumber: 'INCERT-FGAS-1-2022-8119'
      }
    ],
    verificationHistory: [
      { id: 'vh-la-1', date: '2026-10-15', action: 'INCERT F-Gas database status matched', by: 'Sofia Berg', category: 'Equipment Operation' }
    ],
    privacy: {
      anonymousInitialReview: true,
      directContactAllowed: false,
      shareFullDocumentsOnMatch: true,
      salaryExpectationPublic: false
    }
  },
  {
    id: 'cand-marcus-holm',
    name: 'Marcus Holm',
    initials: 'MH',
    title: 'Maintenance Technician & Welder',
    location: 'Västerås, Sweden',
    availability: 'Immediate',
    experienceYears: 7,
    travelFlexibility: 'Regional (up to 50km)',
    verificationLevel: 'Document checked',
    rating: 4.85,
    passportId: 'PASS-SE-5529-MH',
    isPassportShared: true,
    summary: 'Versatile industrial maintenance specialist with certified TIG/MIG welding credentials, gearbox overhaul experience, and heavy mechanical rigging competence.',
    skills: ['TIG / MIG Welding (EN ISO 9606)', 'Gearbox Overhaul', 'Rigging & Lifting Cert', 'Vibration Analysis', 'Hot Work Permit (Heta Arbeten)'],
    languages: [
      { language: 'Swedish', level: 'Native', confirmed: true },
      { language: 'English', level: 'Basic', confirmed: false }
    ],
    employmentHistory: [
      {
        role: 'Mechanical Maintenance Specialist',
        company: 'Hitachi Energy (former ABB)',
        location: 'Västerås',
        period: '2019 – Present',
        verified: true,
        description: 'Maintained transformer fabrication bays, high-capacity overhead cranes, and vacuum drying chambers.'
      }
    ],
    documents: [
      {
        id: 'doc-mh-1',
        title: 'Heta Arbeten (Hot Works) Certificate',
        category: 'Safety / ID06',
        issuer: 'Brandskyddsföreningen',
        issueDate: '2023-05-12',
        expiryDate: '2028-05-12',
        status: 'Independently confirmed',
        lastReviewedDate: '2026-10-14',
        verifiedBy: 'Sofia Berg',
        documentNumber: 'HA-2023-99412'
      },
      {
        id: 'doc-mh-2',
        title: 'ISO 9606-1 Pressure Equipment Welder Approval',
        category: 'Equipment Operation',
        issuer: 'Kiwa Inspecta Sweden',
        issueDate: '2024-02-18',
        expiryDate: '2027-02-18',
        status: 'Document checked',
        lastReviewedDate: '2026-10-14',
        verifiedBy: 'Sofia Berg',
        documentNumber: 'KIWA-WELD-2024-331'
      }
    ],
    verificationHistory: [
      { id: 'vh-mh-1', date: '2026-10-14', action: 'Heta Arbeten certificate confirmed', by: 'Sofia Berg', category: 'Safety / ID06' }
    ],
    privacy: {
      anonymousInitialReview: false,
      directContactAllowed: true,
      shareFullDocumentsOnMatch: true,
      salaryExpectationPublic: true
    }
  },
  {
    id: 'cand-astrid-lindgren',
    name: 'Astrid Lindgren',
    initials: 'AL',
    title: 'Electrical Systems Inspector',
    location: 'Linköping, Sweden',
    availability: '1 month notice',
    experienceYears: 10,
    travelFlexibility: 'Sweden wide',
    verificationLevel: 'Independently confirmed',
    rating: 4.98,
    passportId: 'PASS-SE-1002-AL',
    isPassportShared: true,
    summary: 'Senior Authorized Electrical Inspector (Auktoriserad Elinstallatör AL) with decade of compliance audits in aerospace and industrial manufacturing facilities.',
    skills: ['Auktoriserad Elinstallatör AL', 'Substation Inspection', 'IEC 60364 Standards', 'Lightning Protection', 'Arc Flash Risk Assessment'],
    languages: [
      { language: 'Swedish', level: 'Native', confirmed: true },
      { language: 'English', level: 'Fluent', confirmed: true }
    ],
    employmentHistory: [
      {
        role: 'Chief Compliance Inspector',
        company: 'Saab Aeronautics Facilities',
        location: 'Linköping',
        period: '2018 – Present',
        verified: true,
        description: 'Responsible for statutory periodic electrical inspection protocols and high-current test bays.'
      }
    ],
    documents: [
      {
        id: 'doc-al-1',
        title: 'Auktorisation Låg- och Högspänning (AL)',
        category: 'Electrical Certificate',
        issuer: 'Elsäkerhetsverket (National Electrical Safety Board)',
        issueDate: '2016-08-20',
        status: 'Independently confirmed',
        lastReviewedDate: '2026-09-30',
        verifiedBy: 'Sofia Berg',
        documentNumber: 'ELS-AL-88912'
      }
    ],
    verificationHistory: [
      { id: 'vh-al-1', date: '2026-09-30', action: 'Elsäkerhetsverket register checked and confirmed', by: 'Sofia Berg', category: 'Electrical Certificate' }
    ],
    privacy: {
      anonymousInitialReview: false,
      directContactAllowed: true,
      shareFullDocumentsOnMatch: true,
      salaryExpectationPublic: false
    }
  },
  {
    id: 'cand-emil-svensson',
    name: 'Emil Svensson',
    initials: 'ES',
    title: 'Robotics Commissioning Engineer',
    location: 'Gothenburg, Sweden',
    availability: 'Immediate',
    experienceYears: 4,
    travelFlexibility: 'Nordic travel accepted',
    verificationLevel: 'Document checked',
    rating: 4.7,
    passportId: 'PASS-SE-2291-ES',
    isPassportShared: true,
    summary: 'Robotics technician specialized in KUKA and Fanuc automotive cells, vision inspection lighting, and safety gate interlocks.',
    skills: ['KUKA KRC4 Programming', 'Fanuc Roboguide', 'Cognex Machine Vision', 'Safety Circuit Validation', 'Python Scripting'],
    languages: [
      { language: 'Swedish', level: 'Native', confirmed: true },
      { language: 'English', level: 'Fluent', confirmed: true }
    ],
    employmentHistory: [
      {
        role: 'Robotics Integration Specialist',
        company: 'Semcon Engineering',
        location: 'Gothenburg',
        period: '2022 – Present',
        verified: true,
        description: 'Commissioned material handling robot cells for battery production lines.'
      }
    ],
    documents: [
      {
        id: 'doc-es-1',
        title: 'KUKA Expert Robot Programming Cert',
        category: 'Equipment Operation',
        issuer: 'KUKA Nordic Training Center',
        issueDate: '2022-11-10',
        status: 'Document checked',
        lastReviewedDate: '2026-10-04',
        verifiedBy: 'Robin Andersson',
        documentNumber: 'KUKA-EXP-2022-441'
      }
    ],
    verificationHistory: [
      { id: 'vh-es-1', date: '2026-10-04', action: 'KUKA certificate checked', by: 'Robin Andersson', category: 'Equipment Operation' }
    ],
    privacy: {
      anonymousInitialReview: false,
      directContactAllowed: true,
      shareFullDocumentsOnMatch: true,
      salaryExpectationPublic: true
    }
  },
  {
    id: 'cand-freja-larsson',
    name: 'Freja Larsson',
    initials: 'FL',
    title: 'Renewable Energy & Wind Turbine Tech',
    location: 'Umeå, Sweden',
    availability: '2 weeks notice',
    experienceYears: 5,
    travelFlexibility: 'Nordic travel accepted',
    verificationLevel: 'Independently confirmed',
    rating: 4.9,
    passportId: 'PASS-SE-6631-FL',
    isPassportShared: true,
    summary: 'GWO-certified wind turbine service engineer. Experienced in cold-climate wind farm generator troubleshooting, blade pitch hydraulics, and rope access.',
    skills: ['GWO Basic Safety Training (BST)', 'Hydraulic Pitch Control', 'Wind Generator Maintenance', 'IRATA Rope Access Level 1', 'Substation LOTO'],
    languages: [
      { language: 'Swedish', level: 'Native', confirmed: true },
      { language: 'English', level: 'Fluent', confirmed: true }
    ],
    employmentHistory: [
      {
        role: 'Field Service Specialist',
        company: 'Vattenfall Vindkraft AB',
        location: 'Västerbotten / Umeå',
        period: '2021 – Present',
        verified: true,
        description: 'Serviced 4.2MW onshore turbines at Markbygden wind park.'
      }
    ],
    documents: [
      {
        id: 'doc-fl-1',
        title: 'Global Wind Organisation (GWO) BST Full Module',
        category: 'Safety / ID06',
        issuer: 'GWO WINDA Registry',
        issueDate: '2024-05-19',
        expiryDate: '2026-11-19',
        status: 'Independently confirmed',
        lastReviewedDate: '2026-10-10',
        verifiedBy: 'Sofia Berg',
        documentNumber: 'WINDA-FL-2024-9182',
        notes: 'Expiring in roughly 30 days! Candidate flagged for refresher reminder.'
      }
    ],
    verificationHistory: [
      { id: 'vh-fl-1', date: '2026-10-10', action: 'WINDA international registry confirmation matched', by: 'Sofia Berg', category: 'Safety / ID06' }
    ],
    privacy: {
      anonymousInitialReview: false,
      directContactAllowed: true,
      shareFullDocumentsOnMatch: true,
      salaryExpectationPublic: false
    }
  },
  {
    id: 'cand-oskar-nystrom',
    name: 'Oskar Nyström',
    initials: 'ON',
    title: 'Safety & ID06 Compliance Officer',
    location: 'Stockholm, Sweden',
    availability: 'Immediate',
    experienceYears: 9,
    travelFlexibility: 'Regional (up to 50km)',
    verificationLevel: 'Independently confirmed',
    rating: 4.92,
    passportId: 'PASS-SE-8820-ON',
    isPassportShared: true,
    summary: 'Senior Construction and Industrial Site Safety Director (BAS-P / BAS-U). Expert in Swedish Work Environment Authority (Arbetsmiljöverket) regulations.',
    skills: ['BAS-P / BAS-U Certified', 'ID06 Worksite Auditing', 'SAM Systematic Work Environment', 'Accident Root-Cause Investigation'],
    languages: [
      { language: 'Swedish', level: 'Native', confirmed: true },
      { language: 'English', level: 'Fluent', confirmed: true }
    ],
    employmentHistory: [
      {
        role: 'Lead Health & Safety Auditor',
        company: 'Skanska Sverige AB',
        location: 'Stockholm',
        period: '2017 – Present',
        verified: true,
        description: 'Supervised site compliance on Slussen redevelopment and hospital infrastructure projects.'
      }
    ],
    documents: [
      {
        id: 'doc-on-1',
        title: 'Byggbranschens BAS-P / BAS-U Certification',
        category: 'Safety / ID06',
        issuer: 'Byggbranschens Utbildningscenter',
        issueDate: '2022-03-15',
        expiryDate: '2027-03-15',
        status: 'Independently confirmed',
        lastReviewedDate: '2026-08-15',
        verifiedBy: 'Sofia Berg',
        documentNumber: 'BUC-BAS-2022-1088'
      }
    ],
    verificationHistory: [
      { id: 'vh-on-1', date: '2026-08-15', action: 'BAS certificate verified with issuing academy', by: 'Sofia Berg', category: 'Safety / ID06' }
    ],
    privacy: {
      anonymousInitialReview: false,
      directContactAllowed: true,
      shareFullDocumentsOnMatch: true,
      salaryExpectationPublic: false
    }
  },
  {
    id: 'cand-ebba-karlsson',
    name: 'Ebba Karlsson',
    initials: 'EK',
    title: 'Mechatronics & Drives Specialist',
    location: 'Lund, Sweden',
    availability: '2 weeks notice',
    experienceYears: 3,
    travelFlexibility: 'Regional (up to 50km)',
    verificationLevel: 'Document checked',
    rating: 4.65,
    passportId: 'PASS-SE-7711-EK',
    isPassportShared: false,
    summary: 'Junior to mid-level mechatronics technician trained on brushless servo drives, automated guided vehicles (AGVs), and sensor telemetry.',
    skills: ['Servo Drives (SEW Eurodrive)', 'AGV Navigation', 'Sensor Calibration', 'Python Data Logging'],
    languages: [
      { language: 'Swedish', level: 'Native', confirmed: true },
      { language: 'English', level: 'Fluent', confirmed: true }
    ],
    employmentHistory: [
      {
        role: 'Intralogistics Technician',
        company: 'Kollmorgen Automation AB',
        location: 'Lund',
        period: '2023 – Present',
        verified: true,
        description: 'Configured automated guided vehicle motion profiles and safety laser scanners.'
      }
    ],
    documents: [
      {
        id: 'doc-ek-1',
        title: 'Yrkeshögskoleexamen Automation & Mekatronik',
        category: 'Degree / Vocational',
        issuer: 'Hermods Yrkeshögskola',
        issueDate: '2023-06-10',
        status: 'Document checked',
        lastReviewedDate: '2026-09-12',
        verifiedBy: 'Robin Andersson',
        documentNumber: 'HERM-YH-2023-772'
      }
    ],
    verificationHistory: [
      { id: 'vh-ek-1', date: '2026-09-12', action: 'Diploma reviewed and transcripts stored', by: 'Robin Andersson', category: 'Degree / Vocational' }
    ],
    privacy: {
      anonymousInitialReview: true,
      directContactAllowed: false,
      shareFullDocumentsOnMatch: false,
      salaryExpectationPublic: false
    }
  },
  {
    id: 'cand-gustav-eklund',
    name: 'Gustav Eklund',
    initials: 'GE',
    title: 'PLC Programmer & Industrial IoT',
    location: 'Helsingborg, Sweden',
    availability: '1 month notice',
    experienceYears: 6,
    travelFlexibility: 'Regional (up to 50km)',
    verificationLevel: 'Document checked',
    rating: 4.8,
    passportId: 'PASS-SE-4490-GE',
    isPassportShared: true,
    summary: 'Process control engineer with specialization in food & beverage line automation, brewery clean-in-place (CIP) sequences, and OPC-UA data bridges.',
    skills: ['Mitsubishi Electric PLC', 'Schneider EcoStruxure', 'OPC-UA / MQTT', 'Clean-In-Place CIP', 'Ethernet/IP'],
    languages: [
      { language: 'Swedish', level: 'Native', confirmed: true },
      { language: 'English', level: 'Fluent', confirmed: true },
      { language: 'German', level: 'Professional', confirmed: false }
    ],
    employmentHistory: [
      {
        role: 'Control Systems Programmer',
        company: 'Carlsberg Supply Company Sverige',
        location: 'Falkenberg / Helsingborg',
        period: '2020 – Present',
        verified: true,
        description: 'Optimized bottling line batch control recipes and reduced valve cycle downtime.'
      }
    ],
    documents: [
      {
        id: 'doc-ge-1',
        title: 'Mitsubishi Melsoft Certified Engineer',
        category: 'Equipment Operation',
        issuer: 'Beijer Electronics Nordic',
        issueDate: '2021-09-15',
        status: 'Document checked',
        lastReviewedDate: '2026-10-02',
        verifiedBy: 'Sofia Berg',
        documentNumber: 'BEIJER-CERT-2021-992'
      }
    ],
    verificationHistory: [
      { id: 'vh-ge-1', date: '2026-10-02', action: 'Certificate verified with Beijer Electronics Sweden', by: 'Sofia Berg', category: 'Equipment Operation' }
    ],
    privacy: {
      anonymousInitialReview: false,
      directContactAllowed: true,
      shareFullDocumentsOnMatch: true,
      salaryExpectationPublic: true
    }
  },
  {
    id: 'cand-maja-wallin',
    name: 'Maja Wallin',
    initials: 'MW',
    title: 'Process Automation Engineer',
    location: 'Örebro, Sweden',
    availability: 'Available from Q3',
    experienceYears: 7,
    travelFlexibility: 'Sweden wide',
    verificationLevel: 'Self-reported',
    rating: 4.5,
    passportId: 'PASS-SE-1193-MW',
    isPassportShared: false,
    summary: 'Industrial process automation engineer working with chemical dosing loops, instrumentation calibration, and safety shutdown interlocks. Verification pending document submission.',
    skills: ['Endress+Hauser Flowmeters', 'Valmet DNA SCADA', 'Pressure Transmitter Calibration', 'SIL2 Safety Loops'],
    languages: [
      { language: 'Swedish', level: 'Native', confirmed: true },
      { language: 'English', level: 'Professional', confirmed: false }
    ],
    employmentHistory: [
      {
        role: 'Process Instrumentation Specialist',
        company: 'BillerudKorsnäs Packaging Board',
        location: 'Frövi / Örebro',
        period: '2019 – Present',
        verified: false,
        description: 'Maintained pulp consistency transmitters and steam pressure reduction valves.'
      }
    ],
    documents: [
      {
        id: 'doc-mw-1',
        title: 'B.Sc. Chemical & Process Engineering',
        category: 'Degree / Vocational',
        issuer: 'Örebro University',
        issueDate: '2019-06-05',
        status: 'Self-reported',
        notes: 'Pending official diploma verification from candidate.'
      }
    ],
    verificationHistory: [
      { id: 'vh-mw-1', date: '2026-10-18', action: 'Profile created, awaiting evidence upload', by: 'Maja Wallin', category: 'Account' }
    ],
    privacy: {
      anonymousInitialReview: true,
      directContactAllowed: false,
      shareFullDocumentsOnMatch: false,
      salaryExpectationPublic: false
    }
  }
];
