import { EmployerRequirement } from '../types';

export const INITIAL_REQUIREMENTS: EmployerRequirement[] = [
  {
    id: 'req-got-elec',
    title: 'Industrial Electrician',
    department: 'Manufacturing Automation Plant 4',
    location: 'Gothenburg, Sweden',
    employmentType: 'Full-time',
    workArrangement: 'On-site',
    status: 'Active',
    createdAt: '2026-10-01',
    description: 'We are seeking an authorized or certified Industrial Electrician with minimum 3 years documented experience in medium/high voltage distribution, automated production cells, and industrial switchgear. Must hold active SSG Entre and ECY or equivalent competence.',
    mandatoryCriteria: [
      {
        id: 'mc-1',
        label: 'Minimum 3 years documented industrial electrical experience',
        type: 'min_experience',
        targetValue: 3
      },
      {
        id: 'mc-2',
        label: 'Verified Electrical qualification (ECY or Elsäkerhetsverket AL)',
        type: 'required_doc',
        targetValue: 'Electrical Certificate'
      },
      {
        id: 'mc-3',
        label: 'Current availability within 30 days',
        type: 'availability',
        targetValue: 'Immediate'
      }
    ],
    preferenceWeights: {
      experience: 35,
      qualifications: 35,
      availability: 15,
      location: 15
    }
  },
  {
    id: 'req-stk-auto',
    title: 'Automation & Robotics Engineer',
    department: 'Controls & Digitalization',
    location: 'Stockholm, Sweden',
    employmentType: 'Full-time',
    workArrangement: 'Hybrid',
    status: 'Active',
    createdAt: '2026-10-05',
    description: 'Lead robotics commissioning and PLC programming for Scandinavian electric vehicle component manufacturing. Expertise in Siemens TIA Portal and ABB RobotStudio required.',
    mandatoryCriteria: [
      {
        id: 'mc-auto-1',
        label: 'Minimum 5 years industrial automation experience',
        type: 'min_experience',
        targetValue: 5
      },
      {
        id: 'mc-auto-2',
        label: 'Verified Mechatronics or Automation Engineering Degree',
        type: 'required_doc',
        targetValue: 'Degree / Vocational'
      }
    ],
    preferenceWeights: {
      experience: 40,
      qualifications: 30,
      availability: 15,
      location: 15
    }
  },
  {
    id: 'req-mal-mech',
    title: 'Mechanical Technician',
    department: 'Precision Packaging Systems',
    location: 'Malmö, Sweden',
    employmentType: 'Full-time',
    workArrangement: 'On-site',
    status: 'Active',
    createdAt: '2026-10-08',
    description: 'Precision mechanical assembly and hydraulic troubleshooting for pharmaceutical and aseptic packaging machinery in Skåne.',
    mandatoryCriteria: [
      {
        id: 'mc-mech-1',
        label: 'Minimum 3 years mechanical maintenance or fabrication',
        type: 'min_experience',
        targetValue: 3
      },
      {
        id: 'mc-mech-2',
        label: 'Documented Vocational Mechanical Diploma or Hydraulics Cert',
        type: 'required_doc',
        targetValue: 'Equipment Operation'
      }
    ],
    preferenceWeights: {
      experience: 30,
      qualifications: 35,
      availability: 20,
      location: 15
    }
  },
  {
    id: 'req-upp-hvac',
    title: 'Commercial HVAC Service Specialist',
    department: 'Facilities & Energy Solutions',
    location: 'Uppsala, Sweden',
    employmentType: 'Contract',
    workArrangement: 'On-site',
    status: 'Active',
    createdAt: '2026-10-12',
    description: 'Seasonal heat pump retrofit and F-Gas cooling circuit inspection for public healthcare and life-science facilities in Uppsala and north Stockholm.',
    mandatoryCriteria: [
      {
        id: 'mc-hvac-1',
        label: 'Certified F-Gas Refrigerant Certificate Cat 1 (INCERT)',
        type: 'required_doc',
        targetValue: 'Equipment Operation'
      },
      {
        id: 'mc-hvac-2',
        label: 'Available immediately for contract assignment',
        type: 'availability',
        targetValue: 'Immediate'
      }
    ],
    preferenceWeights: {
      experience: 25,
      qualifications: 40,
      availability: 25,
      location: 10
    }
  },
  {
    id: 'req-ume-wind',
    title: 'Renewable Energy & Wind Turbine Tech',
    department: 'Northern Power Infrastructure',
    location: 'Umeå, Sweden',
    employmentType: 'Full-time',
    workArrangement: 'On-site',
    status: 'Active',
    createdAt: '2026-10-14',
    description: 'Cold-climate wind park technician. Involves turbine climb, pitch hydraulic servicing, and high voltage grid disconnection under strict safety protocols.',
    mandatoryCriteria: [
      {
        id: 'mc-wind-1',
        label: 'Active Global Wind Organisation (GWO) BST Certificate',
        type: 'required_doc',
        targetValue: 'Safety / ID06'
      },
      {
        id: 'mc-wind-2',
        label: 'Minimum 3 years industrial or wind maintenance',
        type: 'min_experience',
        targetValue: 3
      }
    ],
    preferenceWeights: {
      experience: 30,
      qualifications: 40,
      availability: 15,
      location: 15
    }
  }
];
