import React, { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { TabBar } from './TabBar'
import { DemoControls } from '../domain/DemoControls'
import { TourCoach } from '../domain/TourCoach'
import { CommandPalette } from './CommandPalette'
import { Loader } from './Loader'

export const PublicLayout: React.FC = () => {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)
  const location = useLocation()

  return (
    <div className="min-h-screen flex flex-col bg-paper text-text-primary">
      {/* Premium Loader sequence */}
      <Loader />

      {/* Public Top Navbar */}
      <Navbar onOpenCommandPalette={() => setCommandPaletteOpen(true)} />

      {/* Main Page Area */}
      <main id="main" className="flex-1 pb-16 md:pb-0">
        <Outlet />
      </main>

      {/* Editorial Footer */}
      <Footer />

      {/* Mobile Tab Bar */}
      <TabBar />

      {/* Interactive Pitch Aids */}
      <DemoControls />
      <TourCoach />

      {/* Global Command Palette */}
      <CommandPalette open={commandPaletteOpen} onOpenChange={setCommandPaletteOpen} />
    </div>
  )
}
