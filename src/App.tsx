import { Nav } from '@/components/Nav'
import { Hero } from '@/components/Hero'
import { CurationCard } from '@/components/CurationCard'
import { Gallery } from '@/components/Gallery'
import { Stats } from '@/components/Stats'
import { Footer } from '@/components/Footer'

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <CurationCard />
        <Gallery />
        <Stats />
        <Footer />
      </main>
    </>
  )
}
