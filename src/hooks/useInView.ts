import { useEffect, useRef, useState } from 'react'

/**
 * Reveals an element once it scrolls into view. Returns a ref + boolean.
 * Under prefers-reduced-motion it reports `true` immediately (no animation).
 */
export function useInView<T extends HTMLElement = HTMLDivElement>(
  rootMargin = '0px 0px -12% 0px',
) {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      setInView(true)
      return
    }

    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { rootMargin, threshold: 0.1 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [rootMargin])

  return { ref, inView }
}
