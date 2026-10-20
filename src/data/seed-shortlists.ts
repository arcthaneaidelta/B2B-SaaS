import { Shortlist } from '../types';

export const INITIAL_SHORTLISTS: Shortlist[] = [
  {
    id: 'sl-1',
    name: 'Gothenburg Electrical Team',
    requirementId: 'req-got-elec',
    candidateIds: ['cand-erik-lindstrom', 'cand-astrid-lindgren', 'cand-emil-svensson'],
    createdAt: '2026-10-14',
    description: 'Targeted shortlist for Torslanda plant electrical automation commissioning.'
  },
  {
    id: 'sl-2',
    name: 'Q4 Industrial Hiring',
    candidateIds: ['cand-sofia-nilsson', 'cand-johan-berg', 'cand-marcus-holm'],
    createdAt: '2026-10-10',
    description: 'Cross-functional candidate pool for mechanical, automation and welding competencies.'
  }
];
