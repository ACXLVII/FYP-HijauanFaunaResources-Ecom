import Header from '@/components/header'
import Footer from '@/components/footer'

import Intro from '@/app/about/components/sectionIntro'
import Companies from '@/app/about/components/sectionCompanies.js'
import Contact from '@/app/about/components/sectionContact.js'

export default function About() {
  return (
    <div className='bg-[url("/images/backgrounds/SoilBackground.jpg")] bg-cover bg-center bg-fixed'>
      <Header />
      
      <main className="pt-21"> {/* padding for header + green bar */}
        <Intro />
        <Companies />
        <Contact />       
      </main>

      <Footer />
    </div>
  );
}