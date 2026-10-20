import React from 'react'
import { Link } from 'react-router-dom'
import { Home, Compass } from 'lucide-react'
import { Button } from '../../components/ui/Button'

export const NotFoundPage: React.FC = () => {
  return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-pine-100 text-pine-800 font-mono text-2xl font-bold flex items-center justify-center mx-auto">
        404
      </div>
      <div className="space-y-2">
        <h1 className="font-display text-3xl text-ink font-semibold">Page Not Found</h1>
        <p className="text-sm text-text-secondary leading-relaxed">
          The requested conversion route or simulation does not exist. It may have been moved or removed.
        </p>
      </div>

      <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link to="/">
          <Button variant="primary" className="gap-2 font-mono text-xs w-full sm:w-auto">
            <Home className="w-3.5 h-3.5" /> Return Home
          </Button>
        </Link>
        <Link to="/convert">
          <Button variant="outline" className="gap-2 font-mono text-xs w-full sm:w-auto">
            <Compass className="w-3.5 h-3.5" /> FX Converter
          </Button>
        </Link>
      </div>
    </div>
  )
}
