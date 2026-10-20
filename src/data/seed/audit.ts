import { SEED_NOW, DAY, HOUR, MIN } from '../../mock/clock'

export interface AuditEntry {
  id: string
  requestId: string
  timestamp: number
  actor: string
  role: 'Admin' | 'Editor' | 'Viewer' | 'System'
  action: 'CREATE' | 'UPDATE' | 'PUBLISH' | 'REVOKE' | 'REFRESH' | 'EXPORT'
  entityType: 'Override' | 'Fee rule' | 'Assumption' | 'FX cache' | 'Provider'
  entityId: string
  summary: string
  reason?: string
  diff?: {
    field: string
    before: string
    after: string
  }[]
}

export const SEED_AUDIT: AuditEntry[] = [
  {
    id: 'aud-012',
    requestId: 'req-89a1c4',
    timestamp: SEED_NOW - 15 * MIN,
    actor: 'System',
    role: 'System',
    action: 'REFRESH',
    entityType: 'FX cache',
    entityId: 'Primary feed (mock)',
    summary: 'Refreshed 9 FX pairs from Primary feed',
  },
  {
    id: 'aud-011',
    requestId: 'req-77b3d2',
    timestamp: SEED_NOW - 1 * HOUR - 20 * MIN,
    actor: 'Priya Menon',
    role: 'Viewer',
    action: 'EXPORT',
    entityType: 'Fee rule',
    entityId: 'fee-matrix-all',
    summary: 'Exported fee matrix snapshot to CSV',
  },
  {
    id: 'aud-010',
    requestId: 'req-63c2e1',
    timestamp: SEED_NOW - 3 * HOUR,
    actor: 'Amara Qureshi',
    role: 'Admin',
    action: 'PUBLISH',
    entityType: 'Assumption',
    entityId: 'japan',
    summary: 'Published Japan spend assumptions (v4)',
    reason: 'Reflected updated hotel benchmark data in Tokyo',
    diff: [
      { field: 'Mid-range Accommodation', before: '$110', after: '$120' },
      { field: 'Comfort Accommodation', before: '$200', after: '$220' },
    ],
  },
  {
    id: 'aud-009',
    requestId: 'req-54f9a0',
    timestamp: SEED_NOW - 1 * DAY - 3 * HOUR,
    actor: 'Daniel Okafor',
    role: 'Editor',
    action: 'UPDATE',
    entityType: 'Fee rule',
    entityId: 'FR-WISE-CARD',
    summary: 'Updated Wise Card Spend rule (v6 -> v7)',
    reason: 'Synchronised with published public pricing schedule',
    diff: [
      { field: 'pctFee', before: '0.50%', after: '0.55%' },
    ],
  },
  {
    id: 'aud-008',
    requestId: 'req-48e7b3',
    timestamp: SEED_NOW - 1 * DAY - 4 * HOUR,
    actor: 'Daniel Okafor',
    role: 'Editor',
    action: 'UPDATE',
    entityType: 'Fee rule',
    entityId: 'FR-METRO-ATM',
    summary: 'Scheduled Metro National ATM fee revision for 1 Nov 2026',
    reason: 'Annual retail banking tariff adjustment notice',
    diff: [
      { field: 'pctFee (effective 2026-11-01)', before: '2.00%', after: '2.25%' },
    ],
  },
  {
    id: 'aud-007',
    requestId: 'req-39d6c4',
    timestamp: SEED_NOW - 2 * DAY,
    actor: 'System',
    role: 'System',
    action: 'REVOKE',
    entityType: 'Override',
    entityId: 'OVR-0418',
    summary: 'Expired manual rate override GBP/MXN (24.10)',
    reason: 'Override reached 48-hour expiration TTL',
  },
  {
    id: 'aud-006',
    requestId: 'req-28c5d2',
    timestamp: SEED_NOW - 4 * DAY - 4 * HOUR,
    actor: 'Amara Qureshi',
    role: 'Admin',
    action: 'CREATE',
    entityType: 'Override',
    entityId: 'OVR-0418',
    summary: 'Created manual rate override GBP/MXN: 24.30 -> 24.10',
    reason: 'Feed lag during central bank announcement',
    diff: [
      { field: 'Rate', before: '24.3000', after: '24.1000' },
      { field: 'Applies to', before: 'N/A', after: 'All providers' },
    ],
  },
  {
    id: 'aud-005',
    requestId: 'req-19b4e1',
    timestamp: SEED_NOW - 5 * DAY,
    actor: 'System',
    role: 'System',
    action: 'REVOKE',
    entityType: 'Override',
    entityId: 'OVR-0411',
    summary: 'Expired manual rate override GBP/JPY (190.00)',
    reason: 'Override reached scheduled expiration',
  },
  {
    id: 'aud-004',
    requestId: 'req-08a3f0',
    timestamp: SEED_NOW - 5 * DAY - 4 * HOUR,
    actor: 'Amara Qureshi',
    role: 'Admin',
    action: 'CREATE',
    entityType: 'Override',
    entityId: 'OVR-0411',
    summary: 'Created manual rate override GBP/JPY: 196.40 -> 190.00',
    reason: 'Manual correction while primary feed lags',
    diff: [
      { field: 'Rate', before: '196.4000', after: '190.0000' },
    ],
  },
  {
    id: 'aud-003',
    requestId: 'req-97f2a9',
    timestamp: SEED_NOW - 8 * DAY,
    actor: 'Daniel Okafor',
    role: 'Editor',
    action: 'UPDATE',
    entityType: 'Fee rule',
    entityId: 'FR-REVOLUT-CARD',
    summary: 'Published Revolut weekend markup revision (v5 -> v6)',
    reason: 'Provider adjusted global weekend exchange fee schedule',
    diff: [
      { field: 'weekendMarkupPct', before: '0.50%', after: '1.00%' },
    ],
  },
  {
    id: 'aud-002',
    requestId: 'req-86e1b8',
    timestamp: SEED_NOW - 12 * DAY,
    actor: 'Amara Qureshi',
    role: 'Admin',
    action: 'REVOKE',
    entityType: 'Override',
    entityId: 'OVR-0397',
    summary: 'Revoked manual rate override GBP/TRY (56.10)',
    reason: 'Primary feed re-established normal quotation cadence',
  },
  {
    id: 'aud-001',
    requestId: 'req-75d0c7',
    timestamp: SEED_NOW - 12 * DAY - 6 * HOUR,
    actor: 'Daniel Okafor',
    role: 'Editor',
    action: 'CREATE',
    entityType: 'Override',
    entityId: 'OVR-0397',
    summary: 'Created manual rate override GBP/TRY: 55.90 -> 56.10 for Metro & Harbour',
    reason: 'Bank feed published a stale close; aligning to desk rate',
  },
]
