import { useEffect, useRef, useState } from 'react'
import { VideoScrubHero } from '@/components/VideoScrubHero'
import { Nav } from '@/components/Nav'
import { ScrollCue } from '@/components/ScrollCue'
import { Manifesto } from '@/components/Manifesto'
import { Gallery } from '@/components/Gallery'
import { Stats } from '@/components/Stats'
import { Footer } from '@/components/Footer'

export default function App() {
  // Nav + UI stay hidden until the scroll-sequenced hero finishes.
  // A sentinel placed right after the pinned hero tells us when we've arrived.
  const [revealed, setRevealed] = useState(false)
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setRevealed(true)
      return
    }
    const onScroll = () => {
      const el = sentinelRef.current
      if (!el) return
      setRevealed(el.getBoundingClientRect().top <= window.innerHeight * 0.6)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <>
      <Nav revealed={revealed} />
      <ScrollCue revealed={revealed} />

      <main>
        {/* Scroll-sequenced video hero: the watch assembles as you scroll */}
        <VideoScrubHero id="top" />

        {/* Boundary sentinel: marks the end of the cinematic hero */}
        <div ref={sentinelRef} aria-hidden="true" className="h-px w-full" />

        <Manifesto />
        <Gallery />
        <Stats />
        <Footer />
      </main>
    </>
  )
}
