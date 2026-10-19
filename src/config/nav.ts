export interface NavItem {
  label: string;
  href: string;
  icon?: string;
  badge?: string;
  description?: string;
}

export const STOREFRONT_NAV: NavItem[] = [
  { label: 'Plans', href: '/plans' },
  { label: 'How it works', href: '/how-it-works' },
  { label: 'See the pipeline', href: '/app' },
];

export const APP_NAV_ITEMS: NavItem[] = [
  { label: 'Overview', href: '/app', icon: 'LayoutDashboard', description: 'Pipeline metrics & scenario health' },
  { label: 'Pipeline', href: '/app/pipeline', icon: 'Workflow', description: 'Make.com scenario canvas & live run' },
  { label: 'Data', href: '/app/data', icon: 'Table2', description: 'Sheets, CSV drop & merge visualizer' },
  { label: 'Runs', href: '/app/runs', icon: 'Clock', description: 'Historical scenario executions & logs' },
  { label: 'Errors', href: '/app/errors', icon: 'AlertTriangle', badge: 'errorsCount', description: 'Incomplete executions & retry queue' },
  { label: 'Payloads', href: '/app/payloads', icon: 'Code', description: 'Sender & recipient JSON inspector' },
  { label: 'Test Run', href: '/app/test', icon: 'CheckCircle2', description: 'End-to-end sandbox verification' },
  { label: 'Handoff', href: '/app/handoff', icon: 'BookOpen', description: 'Loom runbook, maintenance & retainer' },
];
