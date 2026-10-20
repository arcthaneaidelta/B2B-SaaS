import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { SEED_AUDIT, type AuditEntry } from '../data/seed/audit'
import { OVERRIDE_HISTORY, seedFxPairs, type FxPair, type Override } from '../data/seed/fxCache'
import { SEED_NOTIFICATIONS, type AdminNotification } from '../data/seed/notifications'
import { FEE_RULES, MATRIX_HISTORY, PROVIDERS, type MatrixVersion } from '../data/seed/providers'
import { seedRegions } from '../data/seed/regions'
import { SEED_TRIPS, type SavedTrip } from '../data/seed/trips'
import type { Style, FeeRule, Provider, RateInfo, RegionRecord } from '../engine/types'
import { MIN, mockNow, resetClock } from './clock'

export interface UserPrefs {
  homeCcy: string
  defaultStyle: Style
  density: 'comfortable' | 'compact'
  motionPreference: 'system' | 'reduce' | 'no-preference'
  adminRole: 'Admin' | 'Editor' | 'Viewer'
  adminUser: { name: string; email: string; role: 'Admin' | 'Editor' | 'Viewer' }
}

export interface DemoSettings {
  staleFeed: boolean
  failNextWrite: boolean
  slowNetwork: boolean
  tourDismissed: boolean
  tourActive: boolean
  autoDemoPlayed: boolean
}

export interface AppState {
  prefs: UserPrefs
  fxPairs: FxPair[]
  activeOverrides: Override[]
  overrideHistory: Override[]
  providers: Provider[]
  feeRules: FeeRule[]
  feeRuleDrafts: Record<string, Partial<FeeRule>>
  matrixHistory: MatrixVersion[]
  regions: RegionRecord[]
  savedTrips: SavedTrip[]
  auditEntries: AuditEntry[]
  notifications: AdminNotification[]
  demo: DemoSettings

  // Actions
  setPrefs: (p: Partial<UserPrefs>) => void
  setDemo: (d: Partial<DemoSettings>) => void
  resetDemoData: () => void

  // FX Actions
  refreshPair: (pair: string) => Promise<boolean>
  refreshAllPairs: () => Promise<void>
  toggleAutoRefresh: (pair: string) => void

  // Overrides Actions
  createOverride: (override: Omit<Override, 'id' | 'createdAt' | 'status'>) => Promise<Override>
  revokeOverride: (id: string, reason?: string) => Promise<void>
  extendOverride: (id: string, additionalMs: number) => Promise<void>

  // Fee Matrix Actions
  updateRuleDraftCell: (ruleId: string, field: keyof FeeRule, value: any) => void
  discardFeeDrafts: () => void
  publishFeeDrafts: (note: string, effectiveFrom: string) => Promise<number>
  restoreFeeVersion: (version: number) => Promise<void>
  toggleProviderStatus: (providerId: string, status: 'active' | 'paused') => Promise<void>

  // Regions Actions
  updateRegionDraft: (regionId: string, values: RegionRecord['values'], meta: RegionRecord['draftMeta']) => void
  publishRegionDraft: (regionId: string, note?: string) => Promise<void>

  // Trips Actions
  saveTrip: (trip: SavedTrip) => Promise<void>
  deleteTrip: (id: string) => Promise<void>
  deleteSavedTrip: (id: string) => Promise<void>
  duplicateTrip: (id: string) => Promise<SavedTrip>
  getActiveProviders: () => Provider[]
  getRateInfo: (homeCcy: string, destCcy: string, providerId?: string) => RateInfo

  // Notifications Actions
  markNotificationRead: (id: string) => void
  clearAllNotifications: () => void

  // Audit Actions
  addAuditEntry: (entry: Omit<AuditEntry, 'id' | 'timestamp' | 'requestId'>) => void
  trips: SavedTrip[]
}

const defaultPrefs: UserPrefs = {
  homeCcy: 'GBP',
  defaultStyle: 'comfort',
  density: 'comfortable',
  motionPreference: 'system',
  adminRole: 'Admin',
  adminUser: { name: 'Amara Qureshi', email: 'amara@relziwallet.example', role: 'Admin' },
}

const defaultDemo: DemoSettings = {
  staleFeed: false,
  failNextWrite: false,
  slowNetwork: false,
  tourDismissed: false,
  tourActive: false,
  autoDemoPlayed: false,
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      prefs: defaultPrefs,
      fxPairs: seedFxPairs(),
      activeOverrides: [],
      overrideHistory: OVERRIDE_HISTORY,
      providers: PROVIDERS,
      feeRules: FEE_RULES,
      feeRuleDrafts: {},
      matrixHistory: MATRIX_HISTORY,
      regions: seedRegions(),
      savedTrips: SEED_TRIPS,
      trips: SEED_TRIPS,
      auditEntries: SEED_AUDIT,
      notifications: SEED_NOTIFICATIONS,
      demo: defaultDemo,

      setPrefs: (p) => set((s) => ({ prefs: { ...s.prefs, ...p } })),
      setDemo: (d) => set((s) => ({ demo: { ...s.demo, ...d } })),

      resetDemoData: () => {
        resetClock()
        set({
          prefs: defaultPrefs,
          fxPairs: seedFxPairs(),
          activeOverrides: [],
          overrideHistory: OVERRIDE_HISTORY,
          providers: PROVIDERS,
          feeRules: FEE_RULES,
          feeRuleDrafts: {},
          matrixHistory: MATRIX_HISTORY,
          regions: seedRegions(),
          savedTrips: SEED_TRIPS,
          auditEntries: SEED_AUDIT,
          notifications: SEED_NOTIFICATIONS,
          demo: defaultDemo,
        })
      },

      refreshPair: async (pair) => {
        const { demo } = get()
        if (demo.slowNetwork) await new Promise((r) => setTimeout(r, 1200))
        if (demo.failNextWrite) {
          set({ demo: { ...demo, failNextWrite: false } })
          throw new Error('Network timeout contacting feed gateway')
        }

        const now = mockNow()
        let updated = false
        set((s) => ({
          fxPairs: s.fxPairs.map((p) => {
            if (p.pair === pair) {
              updated = true
              // Tiny +/- 0.05% deterministic delta
              const cur = Number(p.rate)
              const delta = (Math.random() - 0.5) * 0.001 * cur
              const newRate = (cur + delta).toFixed(4)
              return {
                ...p,
                rate: newRate,
                fetchedAt: now,
                events: [{ at: now, rate: newRate, ok: true, note: 'Manual refresh' }, ...p.events.slice(0, 4)],
              }
            }
            return p
          }),
        }))

        if (updated) {
          get().addAuditEntry({
            actor: get().prefs.adminUser.name,
            role: get().prefs.adminRole,
            action: 'REFRESH',
            entityType: 'FX cache',
            entityId: pair,
            summary: `Manually refreshed ${pair} from feed`,
          })
        }
        return updated
      },

      refreshAllPairs: async () => {
        const { demo } = get()
        if (demo.slowNetwork) await new Promise((r) => setTimeout(r, 1500))
        const now = mockNow()
        set((s) => ({
          fxPairs: s.fxPairs.map((p) => ({
            ...p,
            fetchedAt: now,
            events: [{ at: now, rate: p.rate, ok: true, note: 'Bulk refresh' }, ...p.events.slice(0, 4)],
          })),
        }))
        get().addAuditEntry({
          actor: get().prefs.adminUser.name,
          role: get().prefs.adminRole,
          action: 'REFRESH',
          entityType: 'FX cache',
          entityId: 'All pairs',
          summary: 'Bulk refreshed all active pairs',
        })
      },

      toggleAutoRefresh: (pair) => {
        set((s) => ({
          fxPairs: s.fxPairs.map((p) => (p.pair === pair ? { ...p, autoRefresh: !p.autoRefresh } : p)),
        }))
      },

      createOverride: async (ov) => {
        const { demo } = get()
        if (demo.slowNetwork) await new Promise((r) => setTimeout(r, 1000))
        if (demo.failNextWrite) {
          set({ demo: { ...demo, failNextWrite: false } })
          throw new Error('Failed to commit override to ledger')
        }

        const now = mockNow()
        const newOverride: Override = {
          ...ov,
          id: `OVR-${Math.floor(1000 + Math.random() * 9000)}`,
          createdAt: now,
          status: 'active',
        }

        set((s) => ({
          activeOverrides: [newOverride, ...s.activeOverrides],
        }))

        get().addAuditEntry({
          actor: get().prefs.adminUser.name,
          role: get().prefs.adminRole,
          action: 'CREATE',
          entityType: 'Override',
          entityId: newOverride.id,
          summary: `Created override ${newOverride.pair}: ${newOverride.liveRateAtCreation} -> ${newOverride.rate}`,
          reason: newOverride.reason,
          diff: [
            { field: 'Rate', before: newOverride.liveRateAtCreation, after: newOverride.rate },
            { field: 'Applies to', before: 'None', after: Array.isArray(newOverride.appliesTo) ? newOverride.appliesTo.join(', ') : 'All providers' },
          ],
        })

        return newOverride
      },

      revokeOverride: async (id, reason = 'Operator revoked override') => {
        const now = mockNow()
        const target = get().activeOverrides.find((o) => o.id === id)
        if (!target) return

        const updated: Override = { ...target, status: 'revoked', endedAt: now }
        set((s) => ({
          activeOverrides: s.activeOverrides.filter((o) => o.id !== id),
          overrideHistory: [updated, ...s.overrideHistory],
        }))

        get().addAuditEntry({
          actor: get().prefs.adminUser.name,
          role: get().prefs.adminRole,
          action: 'REVOKE',
          entityType: 'Override',
          entityId: id,
          summary: `Revoked manual rate override ${target.pair} (${target.rate})`,
          reason,
        })
      },

      extendOverride: async (id, additionalMs) => {
        set((s) => ({
          activeOverrides: s.activeOverrides.map((o) => (o.id === id ? { ...o, expiresAt: o.expiresAt + additionalMs } : o)),
        }))
        const target = get().activeOverrides.find((o) => o.id === id)
        if (target) {
          get().addAuditEntry({
            actor: get().prefs.adminUser.name,
            role: get().prefs.adminRole,
            action: 'UPDATE',
            entityType: 'Override',
            entityId: id,
            summary: `Extended override ${target.pair} expiration`,
          })
        }
      },

      updateRuleDraftCell: (ruleId, field, value) => {
        set((s) => ({
          feeRuleDrafts: {
            ...s.feeRuleDrafts,
            [ruleId]: {
              ...s.feeRuleDrafts[ruleId],
              [field]: value,
            },
          },
        }))
      },

      discardFeeDrafts: () => {
        set({ feeRuleDrafts: {} })
      },

      publishFeeDrafts: async (note, effectiveFrom) => {
        const { feeRuleDrafts, feeRules, matrixHistory, prefs } = get()
        const draftKeys = Object.keys(feeRuleDrafts)
        if (draftKeys.length === 0) return matrixHistory[0].version

        const newVersionNumber = (matrixHistory[0]?.version ?? 7) + 1
        const now = mockNow()
        const changes: { ruleId: string; field: string; before: string; after: string }[] = []

        const updatedRules = feeRules.map((rule) => {
          const draft = feeRuleDrafts[rule.id]
          if (!draft) return rule

          for (const [k, v] of Object.entries(draft)) {
            changes.push({
              ruleId: rule.id,
              field: k,
              before: String((rule as any)[k] ?? ''),
              after: String(v ?? ''),
            })
          }

          return {
            ...rule,
            ...draft,
            version: newVersionNumber,
            effectiveFrom: effectiveFrom || rule.effectiveFrom,
            status: 'published' as const,
          }
        })

        const newVersionRecord: MatrixVersion = {
          version: newVersionNumber,
          author: prefs.adminUser.name,
          at: now,
          note,
          changes,
          snapshot: updatedRules,
        }

        set({
          feeRules: updatedRules,
          feeRuleDrafts: {},
          matrixHistory: [newVersionRecord, ...matrixHistory],
        })

        get().addAuditEntry({
          actor: prefs.adminUser.name,
          role: prefs.adminRole,
          action: 'PUBLISH',
          entityType: 'Fee rule',
          entityId: `v${newVersionNumber}`,
          summary: `Published Fee Matrix v${newVersionNumber} (${changes.length} edits)`,
          reason: note,
          diff: changes.map((c) => ({
            field: `${c.ruleId} ${c.field}`,
            before: c.before,
            after: c.after,
          })),
        })

        return newVersionNumber
      },

      restoreFeeVersion: async (version) => {
        const v = get().matrixHistory.find((m) => m.version === version)
        if (!v) return

        set({
          feeRules: v.snapshot,
          feeRuleDrafts: {},
        })

        get().addAuditEntry({
          actor: get().prefs.adminUser.name,
          role: get().prefs.adminRole,
          action: 'UPDATE',
          entityType: 'Fee rule',
          entityId: `v${version}`,
          summary: `Restored fee matrix rules from snapshot v${version}`,
        })
      },

      toggleProviderStatus: async (providerId, status) => {
        set((s) => ({
          providers: s.providers.map((p) => (p.id === providerId ? { ...p, status } : p)),
        }))
        get().addAuditEntry({
          actor: get().prefs.adminUser.name,
          role: get().prefs.adminRole,
          action: 'UPDATE',
          entityType: 'Provider',
          entityId: providerId,
          summary: `${status === 'active' ? 'Resumed' : 'Paused'} provider ${providerId}`,
        })
      },

      updateRegionDraft: (regionId, values, meta) => {
        set((s) => ({
          regions: s.regions.map((r) =>
            r.id === regionId
              ? {
                  ...r,
                  draft: values,
                  draftMeta: meta,
                  draftSavedAt: mockNow(),
                }
              : r
          ),
        }))
      },

      publishRegionDraft: async (regionId, note = 'Updated regional spend benchmarks') => {
        const now = mockNow()
        const target = get().regions.find((r) => r.id === regionId)
        if (!target || !target.draft) return

        const updatedRegion: RegionRecord = {
          ...target,
          prevValues: target.values,
          values: target.draft,
          cashSharePct: target.draftMeta?.cashSharePct ?? target.cashSharePct,
          sourceNote: target.draftMeta?.sourceNote ?? target.sourceNote,
          confidence: target.draftMeta?.confidence ?? target.confidence,
          draft: null,
          draftMeta: null,
          draftSavedAt: null,
          lastReviewed: new Date(now).toISOString().split('T')[0],
          reviewedBy: get().prefs.adminUser.name,
          publishedAt: now,
          version: target.version + 1,
        }

        set((s) => ({
          regions: s.regions.map((r) => (r.id === regionId ? updatedRegion : r)),
        }))

        get().addAuditEntry({
          actor: get().prefs.adminUser.name,
          role: get().prefs.adminRole,
          action: 'PUBLISH',
          entityType: 'Assumption',
          entityId: regionId,
          summary: `Published ${target.name} regional assumptions (v${updatedRegion.version})`,
          reason: note,
        })
      },

      saveTrip: async (trip) => {
        set((s) => {
          const exists = s.savedTrips.some((t) => t.id === trip.id)
          return {
            savedTrips: exists ? s.savedTrips.map((t) => (t.id === trip.id ? trip : t)) : [trip, ...s.savedTrips],
          }
        })
      },

      deleteTrip: async (id) => {
        set((s) => ({
          savedTrips: s.savedTrips.filter((t) => t.id !== id),
        }))
      },

      duplicateTrip: async (id) => {
        const target = get().savedTrips.find((t) => t.id === id)
        if (!target) throw new Error('Trip not found')
        const copy: SavedTrip = {
          ...target,
          id: `${target.id}-copy-${Date.now().toString().slice(-4)}`,
          name: `${target.name} (Copy)`,
          savedAt: mockNow(),
        }
        set((s) => ({
          savedTrips: [copy, ...s.savedTrips],
        }))
        return copy
      },

      markNotificationRead: (id) => {
        set((s) => ({
          notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
        }))
      },

      clearAllNotifications: () => {
        set((s) => ({
          notifications: s.notifications.map((n) => ({ ...n, read: true })),
        }))
      },

      addAuditEntry: (entry) => {
        const newEntry: AuditEntry = {
          ...entry,
          id: `aud-${Math.floor(1000 + Math.random() * 9000)}`,
          requestId: `req-${Math.random().toString(16).substring(2, 8)}`,
          timestamp: mockNow(),
        }
        set((s) => ({
          auditEntries: [newEntry, ...s.auditEntries],
        }))
      },

      deleteSavedTrip: async (id) => {
        await get().deleteTrip(id)
        set((s) => ({ trips: s.trips.filter((t) => t.id !== id) }))
      },

      getActiveProviders: () => {
        return get().providers.filter((p) => p.status === 'active')
      },

      getRateInfo: (homeCcy, destCcy, providerId) => {
        const info = getRateInfo(get(), homeCcy, destCcy, providerId)
        return (
          info || {
            pair: `${homeCcy}/${destCcy}`,
            rate: 1,
            refRate: '1.0000',
            baseRate: '1.0000',
            overrideActive: false,
            source: 'Fallback',
            fetchedAt: mockNow(),
            freshness: 'fresh',
          }
        )
      },
    }),
    {
      name: 'relziwallet-demo-v1',
      partialize: (state) => ({
        prefs: state.prefs,
        activeOverrides: state.activeOverrides,
        savedTrips: state.savedTrips,
        feeRuleDrafts: state.feeRuleDrafts,
        demo: state.demo,
      }),
    }
  )
)

/**
 * Selectors to compute rate info for any given home -> dest pair,
 * accounting for mid-market rate feeds, cross rates, overrides, and stale states.
 */
export function getRateInfo(
  state: AppState,
  homeCcy: string,
  destCcy: string,
  providerId?: string
): RateInfo | null {
  if (homeCcy === destCcy) {
    return {
      pair: `${homeCcy}/${destCcy}`,
      rate: 1,
      refRate: '1.0000',
      baseRate: '1.0000',
      overrideActive: false,
      source: 'Identical currency',
      fetchedAt: mockNow(),
      freshness: 'fresh',
    }
  }

  // Look for GBP-based pair in cache
  const pairs = state.fxPairs
  const now = mockNow()

  const getGbpRate = (ccy: string): { rate: number; fetchedAt: number; source: string; isOverride: boolean; ovId?: string; exp?: number } => {
    if (ccy === 'GBP') return { rate: 1, fetchedAt: now, source: 'Base currency', isOverride: false }
    const pairName = `GBP/${ccy}`

    // Check if an active override matches
    const ov = state.activeOverrides.find((o) => o.pair === pairName && o.expiresAt > now)
    if (ov) {
      const applies = ov.appliesTo === 'all' || (providerId && Array.isArray(ov.appliesTo) && ov.appliesTo.includes(providerId))
      if (applies) {
        return { rate: Number(ov.rate), fetchedAt: ov.createdAt, source: 'Manual override', isOverride: true, ovId: ov.id, exp: ov.expiresAt }
      }
    }

    const p = pairs.find((x) => x.pair === pairName)
    if (p) return { rate: Number(p.rate), fetchedAt: p.fetchedAt, source: p.source, isOverride: false }
    return { rate: 1, fetchedAt: now, source: 'Mock fallback', isOverride: false }
  }

  const homeData = getGbpRate(homeCcy)
  const destData = getGbpRate(destCcy)

  // Rate = units of dest per 1 unit of home = (GBP->dest) / (GBP->home)
  const crossRateNum = destData.rate / homeData.rate
  const crossRateStr = crossRateNum.toFixed(6)

  // Stale detection
  const oldestFetch = Math.min(homeData.fetchedAt, destData.fetchedAt)
  const ageMs = now - oldestFetch
  let freshness: RateInfo['freshness'] = 'fresh'
  if (state.demo.staleFeed || ageMs > 10 * MIN) freshness = 'stale'
  else if (ageMs > 5 * MIN) freshness = 'ageing'

  return {
    pair: `${homeCcy}/${destCcy}`,
    rate: crossRateNum,
    refRate: crossRateStr,
    baseRate: crossRateStr,
    overrideActive: destData.isOverride || homeData.isOverride,
    overrideId: destData.ovId || homeData.ovId,
    overrideExpiresAt: destData.exp || homeData.exp,
    source: destData.isOverride ? 'Manual override' : destData.source,
    fetchedAt: oldestFetch,
    freshness,
  }
}
