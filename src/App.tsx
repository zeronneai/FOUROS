import { useLenis } from './hooks/useLenis'
import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { Curaduria } from './components/Curaduria'
import { Manifiesto } from './components/Manifiesto'
import { Services } from './components/Services'
import { Authenticity } from './components/Authenticity'
import { SocialProof } from './components/SocialProof'
import { Contact } from './components/Contact'
import { Footer } from './components/Footer'

export default function App() {
  useLenis()

  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Curaduria />
        <Manifiesto />
        <Services />
        <Authenticity />
        <SocialProof />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
