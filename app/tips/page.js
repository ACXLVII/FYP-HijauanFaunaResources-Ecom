import Header from '@/components/header'
import Footer from '@/components/footer'

import Heading from '@/app/tips/components/sectionHeading'
import TipsGrass from '@/app/tips/components/sectionTipsGrass'
import TipsPlants from '@/app/tips/components/sectionTipsPlants'

export default function TipsPage() {
  return (
    <div className='bg-[url("/images/backgrounds/SoilBackground.jpg")] bg-cover bg-center bg-fixed'>
      <Header />
      
      <main className="pt-21"> {/* padding for header + green bar */}
        {/* <Heading /> */}
        <TipsGrass />
        <TipsPlants />
      </main>

      <Footer />
    </div>
  );
}