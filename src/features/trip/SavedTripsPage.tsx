import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Trash2, Copy, ArrowRight, Calendar, Users, MapPin, Download } from 'lucide-react'
import { useStore } from '../../mock/store'
import { formatMoney } from '../../engine/format'
import { Button } from '../../components/ui/Button'
import { Chip } from '../../components/ui/Chip'
import { useToast } from '../../components/ui/Toast'
import { STYLE_LABEL } from '../../engine/types'
import type { SavedTrip } from '../../data/seed/trips'

export const SavedTripsPage: React.FC = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { savedTrips, regions, deleteSavedTrip, saveTrip } = useStore()

  const handleCloneTrip = (trip: SavedTrip) => {
    const cloned: SavedTrip = {
      ...trip,
      id: `${trip.destinationId}-${Date.now().toString().slice(-4)}`,
      name: `${trip.name} (Copy)`,
      savedAt: Date.now(),
    }
    saveTrip(cloned)
    toast({
      title: 'Trip Cloned',
      description: `Created a copy of ${trip.name}.`,
      type: 'success',
    })
  }

  const handleDeleteTrip = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    deleteSavedTrip(id)
    toast({
      title: 'Trip Removed',
      description: 'Trip removed from your saved list.',
      type: 'info',
    })
  }

  const handleExportJSON = (trip: SavedTrip, e: React.MouseEvent) => {
    e.stopPropagation()
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(trip, null, 2))
    const downloadAnchor = document.createElement('a')
    downloadAnchor.setAttribute('href', dataStr)
    downloadAnchor.setAttribute('download', `relziwallet-trip-${trip.id}.json`)
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()
    toast({
      title: 'Trip Exported',
      description: 'JSON file downloaded.',
      type: 'success',
    })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-divider pb-6">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl text-ink font-semibold">
            Saved Trip Itineraries & FX Budgets
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Access your simulated trips, review multi-card payment strategies, or create a new FX-optimized itinerary.
          </p>
        </div>

        <Button variant="primary" onClick={() => navigate('/trip/wizard')} className="gap-2 font-mono text-xs">
          <Plus className="w-4 h-4" /> Plan New Trip
        </Button>
      </div>

      {savedTrips.length === 0 ? (
        <div className="bg-surface border border-border rounded-2xl p-12 text-center space-y-4 max-w-md mx-auto">
          <MapPin className="w-10 h-10 text-text-muted mx-auto" />
          <h2 className="font-display text-lg text-ink font-semibold">No Saved Trips Yet</h2>
          <p className="text-xs text-text-secondary">
            Use the Trip Wizard to build a customized spend model based on your travel style and destination.
          </p>
          <Button variant="primary" onClick={() => navigate('/trip/wizard')} className="font-mono text-xs">
            Start Trip Wizard
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedTrips.map((trip) => {
            const dest = regions.find((r) => r.id === trip.destinationId)

            return (
              <div
                key={trip.id}
                onClick={() => navigate(`/trip/${trip.id}`)}
                className="bg-surface border border-border hover:border-pine-500 rounded-2xl p-6 flex flex-col justify-between transition-all hover:shadow-md cursor-pointer group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Chip variant="pine" size="sm">{STYLE_LABEL[trip.style] || trip.style}</Chip>
                    <span className="text-[10px] font-mono text-text-muted">
                      {dest?.name || trip.destinationId}
                    </span>
                  </div>

                  <div>
                    <h2 className="font-display text-lg text-ink font-semibold group-hover:text-pine-800 transition-colors">
                      {trip.name}
                    </h2>
                    <div className="flex items-center gap-4 text-xs font-mono text-text-muted mt-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" /> {trip.nights} nights
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" /> {trip.travellers} {trip.travellers === 1 ? 'traveler' : 'travelers'}
                      </span>
                    </div>
                  </div>

                  {/* Amount preview */}
                  <div className="p-3 bg-sunken rounded-xl">
                    <div className="text-[10px] font-mono text-text-muted uppercase">Estimated Spend ({trip.homeCcy})</div>
                    <div className="text-xl font-mono font-bold text-ink">
                      {formatMoney(trip.totalHome, trip.homeCcy)}
                    </div>
                    <div className="text-[11px] font-mono text-text-muted">
                      Est. FX fee loss: ~{formatMoney(trip.fxCostHome, trip.homeCcy)}
                    </div>
                  </div>
                </div>

                {/* Action Toolbar */}
                <div className="pt-4 border-t border-divider mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      title="Export JSON"
                      onClick={(e) => handleExportJSON(trip, e)}
                      className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-sunken transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      title="Clone Trip"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleCloneTrip(trip)
                      }}
                      className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-sunken transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      title="Delete Trip"
                      onClick={(e) => handleDeleteTrip(trip.id, e)}
                      className="p-1.5 rounded-lg text-text-muted hover:text-error hover:bg-error-50 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <span className="text-xs font-mono font-semibold text-pine-700 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    Simulator <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
