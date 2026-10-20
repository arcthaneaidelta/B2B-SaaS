import React, { useState } from 'react'
import { Server, Database, CheckCircle2, Copy, Check } from 'lucide-react'
import { Chip } from '../../components/ui/Chip'
import { Button } from '../../components/ui/Button'
import { useToast } from '../../components/ui/Toast'

const POSTGRES_SCHEMA = `-- ==============================================================================
-- RELZIWALLET PRODUCTION POSTGRESQL SCHEMA (DDL)
-- Prepared by Shahzaib Akram for Relziwallet Production Architecture
-- ==============================================================================

-- 1. Currencies & decimal precision
CREATE TABLE currencies (
    code VARCHAR(3) PRIMARY KEY,
    name VARCHAR(64) NOT NULL,
    symbol VARCHAR(8) NOT NULL,
    minor_unit INT NOT NULL DEFAULT 2, -- e.g. JPY=0, GBP=2, KWD=3
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. FX Mid-market Rates Cache with audited provenance
CREATE TABLE fx_rates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    base_currency VARCHAR(3) REFERENCES currencies(code),
    target_currency VARCHAR(3) REFERENCES currencies(code),
    mid_rate NUMERIC(18, 8) NOT NULL, -- IEEE 754 avoidance
    source_feed VARCHAR(32) NOT NULL, -- 'ECB', 'INTERBANK_REUTERS'
    fetched_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    CONSTRAINT uq_rate_pair UNIQUE (base_currency, target_currency)
);

-- 3. Providers registry (Wise, Revolut, etc.)
CREATE TABLE providers (
    id VARCHAR(32) PRIMARY KEY,
    name VARCHAR(64) NOT NULL,
    category VARCHAR(32) NOT NULL, -- 'neobank', 'transfer_specialist', 'bank', 'cash_desk'
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    current_rule_version INT NOT NULL DEFAULT 1,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Immutable Fee Rules Schedule (versioned)
CREATE TABLE fee_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id VARCHAR(32) REFERENCES providers(id),
    transaction_type VARCHAR(16) NOT NULL, -- 'card', 'atm', 'transfer'
    percent_fee NUMERIC(8, 6) NOT NULL DEFAULT 0.0,
    fixed_fee NUMERIC(10, 4) NOT NULL DEFAULT 0.0,
    fixed_currency VARCHAR(3) REFERENCES currencies(code),
    monthly_allowance NUMERIC(12, 2) DEFAULT NULL,
    weekend_markup_pct NUMERIC(8, 6) NOT NULL DEFAULT 0.0,
    rule_version INT NOT NULL,
    effective_from TIMESTAMPTZ NOT NULL,
    effective_to TIMESTAMPTZ DEFAULT NULL,
    created_by VARCHAR(64) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Administrative Overrides with fat-finger guard (<10%)
CREATE TABLE rate_overrides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scope VARCHAR(16) NOT NULL, -- 'all', 'provider'
    target_provider_id VARCHAR(32) REFERENCES providers(id),
    base_currency VARCHAR(3) REFERENCES currencies(code),
    target_currency VARCHAR(3) REFERENCES currencies(code),
    adjustment_bps INT NOT NULL, -- Basis points (+/-)
    reason TEXT NOT NULL,
    created_by VARCHAR(64) NOT NULL,
    starts_at TIMESTAMPTZ NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    is_revoked BOOLEAN NOT NULL DEFAULT FALSE,
    revoked_reason TEXT DEFAULT NULL
);

-- 6. Regional Spend Indices (CMS)
CREATE TABLE regional_indices (
    id VARCHAR(32) PRIMARY KEY,
    city VARCHAR(64) NOT NULL,
    country VARCHAR(64) NOT NULL,
    local_currency VARCHAR(3) REFERENCES currencies(code),
    cost_index NUMERIC(6, 4) NOT NULL, -- multiplier vs US baseline
    cash_share_pct INT NOT NULL CHECK (cash_share_pct BETWEEN 0 AND 100),
    accommodation_values JSONB NOT NULL,
    last_reviewed_at TIMESTAMPTZ NOT NULL,
    reviewed_by VARCHAR(64) NOT NULL,
    version INT NOT NULL DEFAULT 1
);

-- 7. Audit Log with JSON before/after state diffs
CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_email VARCHAR(128) NOT NULL,
    actor_role VARCHAR(32) NOT NULL,
    action VARCHAR(64) NOT NULL, -- 'CREATE_OVERRIDE', 'PUBLISH_FEE_MATRIX', 'UPDATE_CMS'
    entity_type VARCHAR(32) NOT NULL,
    entity_id VARCHAR(64) NOT NULL,
    before_state JSONB DEFAULT NULL,
    after_state JSONB DEFAULT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_fx_rates_lookup ON fx_rates(base_currency, target_currency);
CREATE INDEX idx_fee_rules_active ON fee_rules(provider_id, transaction_type, rule_version);
`

export const DemoNotesPage: React.FC = () => {
  const { toast } = useToast()
  const [copiedSchema, setCopiedSchema] = useState(false)

  const handleCopySchema = () => {
    navigator.clipboard.writeText(POSTGRES_SCHEMA)
    setCopiedSchema(true)
    toast({
      title: 'Schema Copied',
      description: 'Production PostgreSQL DDL copied to clipboard.',
      type: 'success',
    })
    setTimeout(() => setCopiedSchema(false), 2000)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Proposal Author Badge & Header */}
      <div className="bg-surface border-2 border-pine-600 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-divider pb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-pine-600 text-white font-display text-xl font-bold flex items-center justify-center shadow-sm">
              SA
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display text-2xl font-bold text-ink">Shahzaib Akram</span>
                <Chip variant="pine" size="sm">Proposal Author & Full-Stack Architect</Chip>
              </div>
              <p className="text-xs font-mono text-text-muted mt-0.5">
                Technical Submission for Relziwallet High-Fidelity Frontend & Calculation Prototype
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Chip variant="neutral" size="sm">Specification: PRD v1.0 Compliant</Chip>
          </div>
        </div>

        <p className="text-sm text-text-secondary leading-relaxed">
          This interactive demo was architected and built to prove complete mastery over Relziwallet's multi-layered requirements: <strong>deterministic 12-decimal arbitrary-precision money math</strong>, <strong>full transaction waterfall auditing ("show the math")</strong>, <strong>multi-card payment strategy simulation</strong>, and an <strong>integrated Operator Admin control plane</strong> with real-time public synchronization.
        </p>
      </div>

      {/* Requirement Matrix */}
      <div className="space-y-4">
        <div>
          <h2 className="font-display text-2xl text-ink font-semibold">PRD Requirement & Fulfillment Matrix</h2>
          <p className="text-xs text-text-secondary">Summary of all core client specifications and their verified implementations.</p>
        </div>

        <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-sunken border-b border-divider text-text-muted uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4">Section / Requirement</th>
                <th className="py-3 px-4">Design Specification</th>
                <th className="py-3 px-4">Implementation in Prototype</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-divider/60">
              <tr>
                <td className="py-3 px-4 font-bold text-text-primary">Section 2: Money Precision</td>
                <td className="py-3 px-4 text-text-secondary">Zero native float arithmetic; 12-dp intermediate Big.js; half-up display rounding.</td>
                <td className="py-3 px-4 text-pine-700"><code>src/engine/money.ts</code> with Big.js wrapping all math.</td>
                <td className="py-3 px-4"><span className="text-emerald-700 font-bold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> 100% Passed</span></td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-text-primary">Section 3: 12-Step Waterfall</td>
                <td className="py-3 px-4 text-text-secondary">Audit trace, gross send, spread, fixed/pct fee netting, rate overrides, weekend markups.</td>
                <td className="py-3 px-4 text-pine-700"><code>src/engine/quote.ts</code> + <code>ReceiptPanel.tsx</code> disclosure.</td>
                <td className="py-3 px-4"><span className="text-emerald-700 font-bold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> 100% Passed</span></td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-text-primary">Section 4: Test Vectors (T1–T12)</td>
                <td className="py-3 px-4 text-text-secondary">12 verified numerical vectors covering Wise, Revolut, ATM tiers, weekend markups.</td>
                <td className="py-3 px-4 text-pine-700"><code>src/engine/quote.test.ts</code> (All 12 automated unit tests pass in Vitest).</td>
                <td className="py-3 px-4"><span className="text-emerald-700 font-bold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> 100% Passed</span></td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-text-primary">Section 6: Multi-Card Strategy</td>
                <td className="py-3 px-4 text-text-secondary">Multi-provider split, ATM schedule, backup card recommendation, bank delta.</td>
                <td className="py-3 px-4 text-pine-700"><code>src/features/trip/PaymentStrategyPage.tsx</code> (U10).</td>
                <td className="py-3 px-4"><span className="text-emerald-700 font-bold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> 100% Passed</span></td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-text-primary">Section 9: Admin Control Plane</td>
                <td className="py-3 px-4 text-text-secondary">FX cache TTL, overrides with fat-finger guard, fee matrix editing, regional CMS drafts, audit log.</td>
                <td className="py-3 px-4 text-pine-700"><code>src/features/admin/</code> (A01–A09) with instant public synchronization.</td>
                <td className="py-3 px-4"><span className="text-emerald-700 font-bold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> 100% Passed</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Proposed AWS Production Architecture */}
      <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex items-center gap-3">
          <Server className="w-6 h-6 text-pine-700" />
          <div>
            <h2 className="font-display text-xl text-ink font-semibold">Proposed AWS Production Architecture</h2>
            <p className="text-xs font-mono text-text-muted">High-availability, sub-50ms latency multi-region deployment</p>
          </div>
        </div>

        {/* Visual Architecture Diagram (SVG / Box Representation) */}
        <div className="p-6 bg-sunken rounded-xl border border-divider space-y-4 font-mono text-xs">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-surface border border-border rounded-xl shadow-xs space-y-1">
              <span className="text-[10px] uppercase text-text-muted block">Edge / CDN</span>
              <strong className="text-sm text-text-primary">Amazon CloudFront + Route 53</strong>
              <p className="text-[10px] text-text-secondary">Global edge caching, TLS termination, WAF DDoS protection.</p>
            </div>

            <div className="p-4 bg-surface border border-border rounded-xl shadow-xs space-y-1">
              <span className="text-[10px] uppercase text-text-muted block">Application Tier</span>
              <strong className="text-sm text-text-primary">ECS Fargate / Node.js API</strong>
              <p className="text-[10px] text-text-secondary">Stateless container cluster autoscaling on CPU/Memory load.</p>
            </div>

            <div className="p-4 bg-surface border border-border rounded-xl shadow-xs space-y-1">
              <span className="text-[10px] uppercase text-text-muted block">In-Memory Cache</span>
              <strong className="text-sm text-text-primary">ElastiCache Redis 7</strong>
              <p className="text-[10px] text-text-secondary">Sub-millisecond FX rate cache with 60s TTL and pub/sub invalidation.</p>
            </div>

            <div className="p-4 bg-surface border border-border rounded-xl shadow-xs space-y-1">
              <span className="text-[10px] uppercase text-text-muted block">Primary Database</span>
              <strong className="text-sm text-text-primary">Amazon Aurora PostgreSQL</strong>
              <p className="text-[10px] text-text-secondary">Multi-AZ replication, numeric(18,8) storage, point-in-time recovery.</p>
            </div>
          </div>

          <div className="p-3 bg-pine-50/60 border border-pine-200/80 rounded-lg text-pine-900 text-xs flex items-center justify-between">
            <span><strong>EventBridge Schedule:</strong> Ingests ECB rate feeds every 60 seconds; triggers cache invalidation across all nodes.</span>
            <Chip variant="pine" size="sm">Zero Cold-Start</Chip>
          </div>
        </div>
      </div>

      {/* PostgreSQL Database Schema */}
      <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Database className="w-6 h-6 text-pine-700" />
            <div>
              <h2 className="font-display text-xl text-ink font-semibold">Production PostgreSQL DDL</h2>
              <p className="text-xs font-mono text-text-muted">Strict relational integrity, arbitrary precision decimal types</p>
            </div>
          </div>

          <Button variant="outline" size="sm" onClick={handleCopySchema} className="gap-1.5 font-mono text-xs">
            {copiedSchema ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedSchema ? 'Copied' : 'Copy DDL'}
          </Button>
        </div>

        <div className="bg-ink text-text-on-dark p-4 rounded-xl font-mono text-xs overflow-x-auto max-h-96">
          <pre>{POSTGRES_SCHEMA}</pre>
        </div>
      </div>
    </div>
  )
}
