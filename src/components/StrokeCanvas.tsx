import { useRef } from 'react'
import { useHanziWriter } from '../hooks/useHanziWriter'

interface StrokeCanvasProps {
  hanzi: string
  autoAnimate?: boolean
  size?: number
  onAnimationComplete?: () => void
}

export default function StrokeCanvas({
  hanzi,
  autoAnimate = false,
  size = 220,
  onAnimationComplete,
}: StrokeCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const handle = useHanziWriter(containerRef, {
    hanzi,
    width: size,
    height: size,
    autoAnimate,
    onAnimationComplete,
  })

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        ref={containerRef}
        style={{ width: size, height: size }}
        className="rounded-2xl bg-white shadow-inner border border-gray-200"
      />
      <button
        onClick={() => handle.animate()}
        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
      >
        ↺ Replay animation
      </button>
    </div>
  )
}
