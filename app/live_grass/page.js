import Header from '@/components/header'
import Footer from '@/components/footer'

import Heading from '@/app/live_grass/components/sectionHeading'
import Marketing from '@/app/live_grass/components/sectionMarketing'
import Grasses from '@/app/live_grass/components/sectionGrasses'
import Reviews from '@/app/live_grass/components/sectionReviews'
import Contact from '@/app/live_grass/components/sectionContact'

export default function ServiceLiveGrass() {
  return (
    <div className='bg-[url("/images/backgrounds/SoilBackground.jpg")] bg-cover bg-center bg-fixed'>
      <Header />
      
      <main className="pt-21"> {/* padding for header + green bar */}
        {/* <Heading /> */}
        <Marketing />
        <Grasses />
        <Reviews />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}