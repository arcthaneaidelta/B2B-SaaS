import { SEED_NOW, MIN, DAY } from '../../mock/clock'

export interface AdminNotification {
  id: string
  title: string
  description: string
  timeAgo: string
  timestamp: number
  read: boolean
  type: 'warning' | 'info' | 'error' | 'success'
  actionUrl?: string
  actionLabel?: string
}

export const SEED_NOTIFICATIONS: AdminNotification[] = [
  {
    id: 'notif-1',
    title: 'GBP/TRY is ageing (7 min)',
    description: 'Secondary feed latency threshold reached. Auto-refresh queue is pending next retry.',
    timeAgo: '7 min ago',
    timestamp: SEED_NOW - 7 * MIN,
    read: false,
    type: 'warning',
    actionUrl: '/admin/fx-cache',
    actionLabel: 'View in FX cache',
  },
  {
    id: 'notif-2',
    title: 'Override GBP/MXN expired 2 days ago',
    description: 'Manual rate 24.10 expired on schedule. Production reverted to primary feed 24.30.',
    timeAgo: '2 days ago',
    timestamp: SEED_NOW - 2 * DAY,
    read: false,
    type: 'info',
    actionUrl: '/admin/overrides',
    actionLabel: 'View history',
  },
  {
    id: 'notif-3',
    title: '3 regional assumptions past review date',
    description: 'Turkiye (155d), Morocco (131d), and Mexico (110d) have passed the 90-day review cycle.',
    timeAgo: 'Yesterday',
    timestamp: SEED_NOW - 1 * DAY,
    read: false,
    type: 'warning',
    actionUrl: '/admin/regions',
    actionLabel: 'Review assumptions',
  },
  {
    id: 'notif-4',
    title: 'Fee rule Metro National / ATM scheduled for 1 Nov',
    description: 'Scheduled change (pctFee: 2.00% -> 2.25%) is pending automated activation in 12 days.',
    timeAgo: '3 days ago',
    timestamp: SEED_NOW - 3 * DAY,
    read: true,
    type: 'info',
    actionUrl: '/admin/fee-matrix',
    actionLabel: 'Inspect rule',
  },
]
