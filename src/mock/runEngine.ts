export interface ScenarioNode {
  id: string;
  number: number;
  name: string;
  type: string;
  service: string;
  iconName: string;
  description: string;
  x: number;
  y: number;
  isErrorBranch?: boolean;
  configSummary: {
    connection: string;
    target: string;
    timeout?: string;
    details: Record<string, string>;
  };
}

export const SCENARIO_NODES: ScenarioNode[] = [
  {
    id: 'node-1',
    number: 1,
    name: 'Watch Rows',
    type: 'trigger',
    service: 'Google Sheets',
    iconName: 'Table2',
    description: 'Listen for new rows in Customer Parameters',
    x: 40,
    y: 110,
    configSummary: {
      connection: 'Google Sheets (ops-service@)',
      target: 'Quillfold Production Master',
      details: {
        'Sheet': 'Customer Parameters',
        'Trigger field': 'Row ID / Timestamp',
        'Batch size': '10 rows',
      },
    },
  },
  {
    id: 'node-2',
    number: 2,
    name: 'Parse Drive Link',
    type: 'action',
    service: 'Google Drive / HTTP',
    iconName: 'FileText',
    description: 'Resolve Drive link & fetch CSV bytes',
    x: 230,
    y: 110,
    configSummary: {
      connection: 'Google Drive REST API v3',
      target: 'drive.google.com/uc?export=download',
      timeout: '15000ms',
      details: {
        'URL Pattern': 'https://drive.google.com/file/d/{{link}}',
        'MIME Type': 'text/csv',
        'Max size': '5 MB',
      },
    },
  },
  {
    id: 'node-3',
    number: 3,
    name: 'Parse CSV',
    type: 'parser',
    service: 'CSV Text Parser',
    iconName: 'Code',
    description: 'Parse raw CSV text into typed objects',
    x: 420,
    y: 110,
    configSummary: {
      connection: 'Make Built-in Text Parser',
      target: 'RFC 4180 CSV Engine',
      details: {
        'Delimiter': 'Comma (,)',
        'Header row': 'Yes (row 1)',
        'Escape char': '"',
      },
    },
  },
  {
    id: 'node-4',
    number: 4,
    name: 'Iterator',
    type: 'flow',
    service: 'Flow Control',
    iconName: 'Repeat',
    description: 'Iterate bundles per recipient row',
    x: 610,
    y: 110,
    configSummary: {
      connection: 'Make Core Flow Control',
      target: 'Array Iterator',
      details: {
        'Array expression': '{{2.data.rows}}',
        'Item count': '12 per execution bundle',
      },
    },
  },
  {
    id: 'node-5',
    number: 5,
    name: 'Validate & Map',
    type: 'router',
    service: 'Variables & Router',
    iconName: 'GitBranch',
    description: 'Cross-check key, validate ZIP, route',
    x: 800,
    y: 110,
    configSummary: {
      connection: 'Router Engine',
      target: '2 filter routes (Clean / Error)',
      details: {
        'Filter A (Clean)': 'postcode != empty AND accountId in validProfiles',
        'Filter B (Error)': 'fallback otherwise',
      },
    },
  },
  {
    id: 'node-6',
    number: 6,
    name: 'Send to API',
    type: 'action',
    service: 'HTTP Sandbox',
    iconName: 'Send',
    description: 'POST clean sender + recipient payload',
    x: 990,
    y: 70,
    configSummary: {
      connection: 'HTTP OAuth2 / Bearer Token',
      target: 'POST https://sandbox.api.example.com/v1/shipments',
      timeout: '8000ms',
      details: {
        'Method': 'POST',
        'Headers': 'Content-Type: application/json, Authorization: Bearer sk_sandbox_•••',
        'Retry on 429/500': 'Handled by Break module',
      },
    },
  },
  {
    id: 'node-7',
    number: 7,
    name: 'Update Status',
    type: 'action',
    service: 'Google Sheets',
    iconName: 'CheckSquare',
    description: 'Mark status = DELIVERED in Sheets',
    x: 1180,
    y: 70,
    configSummary: {
      connection: 'Google Sheets (ops-service@)',
      target: 'Customer Parameters!Status',
      details: {
        'Status field': 'DELIVERED',
        'API Request ID': '{{6.data.request_id}}',
      },
    },
  },
  // Error branch nodes
  {
    id: 'node-8',
    number: 8,
    name: 'Break Module',
    type: 'error',
    service: 'Error Directive',
    iconName: 'PauseCircle',
    description: 'Queue incomplete bundle, retry 3x (5m)',
    x: 990,
    y: 220,
    isErrorBranch: true,
    configSummary: {
      connection: 'Make Error Handler Directive',
      target: 'Incomplete Executions Storage',
      details: {
        'Directive': 'Break',
        'Attempts': '3',
        'Interval': '5 minutes',
      },
    },
  },
  {
    id: 'node-9',
    number: 9,
    name: 'Append Error Log',
    type: 'error',
    service: 'Google Sheets',
    iconName: 'FileWarning',
    description: 'Write diagnostic row to Error Log tab',
    x: 1160,
    y: 220,
    isErrorBranch: true,
    configSummary: {
      connection: 'Google Sheets (ops-service@)',
      target: 'Quillfold Master!Error Log',
      details: {
        'Row mapping': 'Timestamp, Run ID, Account ID, Error Reason',
        'Status': 'Awaiting Data Fix',
      },
    },
  },
  {
    id: 'node-10',
    number: 10,
    name: 'Email Alert',
    type: 'error',
    service: 'Mailgun / SMTP',
    iconName: 'Mail',
    description: 'Dispatch instant failure alert to ops team',
    x: 1330,
    y: 220,
    isErrorBranch: true,
    configSummary: {
      connection: 'Transactional Email Service',
      target: 'ops@quillfold-demo.com',
      details: {
        'Subject': '[Quillfold · Sandbox] 1 row needs attention',
        'Template': 'ops_error_digest_v1',
      },
    },
  },
];

export interface ExecutionLogLine {
  id: string;
  time: string;
  level: 'info' | 'warn' | 'error' | 'success';
  nodeNumber: number;
  message: string;
}
