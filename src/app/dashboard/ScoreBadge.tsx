import React from 'react'

export function ScoreBadge({ points, show }: { points: number; show: boolean }) {
  return (
    <div
      className={`fixed top-8 right-8 z-50 transition-all duration-500 ${
        show ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'
      } pointer-events-none`}
    >
      <div className="bg-green-500 text-white px-6 py-3 rounded-full shadow-lg text-lg font-bold animate-bounce">
        +{points} points!
      </div>
    </div>
  )
} 