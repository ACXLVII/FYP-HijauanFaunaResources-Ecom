'use client'

import Header from '@/components/header'
import Footer from '@/components/footer'

import Welcome from '@/app/components/sectionWelcome'
import PromoBanner from '@/app/components/sectionPromoBanner'
import Prices from '@/app/components/sectionPrices'
import Services from '@/app/components/sectionServices'
import Results from '@/app/components/sectionResults'
// import Contact from '@/app/components/sectionContact'

export default function HomePage() {
  return (
    <div className='bg-[url("/images/backgrounds/SoilBackground.jpg")] bg-cover bg-center bg-fixed'>
      <Header />
      
      <main className="mt-21"> {/* padding for header + green bar */}
        <PromoBanner />
        <Welcome />
        <Prices />
        <Services />
        <Results /> 
        {/* <Contact /> */}
      </main>

      <Footer />
    </div>
  );
}