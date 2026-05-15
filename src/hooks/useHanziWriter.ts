import { useEffect, useRef } from 'react'
import HanziWriter from 'hanzi-writer'

export interface HanziWriterOptions {
  hanzi: string
  width?: number
  height?: number
  autoAnimate?: boolean
  onAnimationComplete?: () => void
}

export interface HanziWriterHandle {
  animate: () => void
}

export function useHanziWriter(
  containerRef: React.RefObject<HTMLDivElement | null>,
  options: HanziWriterOptions,
): HanziWriterHandle {
  const writerRef = useRef<HanziWriter | null>(null)
  const onCompleteRef = useRef(options.onAnimationComplete)
  onCompleteRef.current = options.onAnimationComplete

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    el.innerHTML = ''

    const writer = HanziWriter.create(el, options.hanzi, {
      width: options.width ?? 220,
      height: options.height ?? 220,
      padding: 8,
      showOutline: true,
      strokeColor: '#1e293b',
      outlineColor: '#e2e8f0',
      strokeAnimationSpeed: 1,
      delayBetweenStrokes: 250,
    })

    writerRef.current = writer

    if (options.autoAnimate) {
      writer
        .animateCharacter()
        .then(() => {
          onCompleteRef.current?.()
        })
        .catch(() => {
          // animation was cancelled (component unmounted mid-animation)
        })
    } else {
      writer.showCharacter()
    }

    return () => {
      if (el) el.innerHTML = ''
      writerRef.current = null
    }
    // Re-create writer only when the character changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.hanzi])

  return {
    animate: () => {
      writerRef.current?.animateCharacter().then(() => {
        onCompleteRef.current?.()
      }).catch(() => {})
    },
  }
}
