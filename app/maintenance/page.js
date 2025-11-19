import Header from '@/components/header'
import Footer from '@/components/footer'

import Heading from '@/app/maintenance/components/sectionHeading'
import Marketing from '@/app/maintenance/components/sectionMarketing'
import Reviews from '@/app/maintenance/components/sectionReviews'
import Contact from '@/app/maintenance/components/sectionContact'

export default function ServiceMaintenance() {
  return (
    <div className='bg-[url("/images/backgrounds/SoilBackground.jpg")] bg-cover bg-center bg-fixed'>
      <Header />
      
      <main className="mt-21"> {/* padding for header + green bar */}
        {/* <Heading /> */}
        <Marketing />
        <Reviews />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}