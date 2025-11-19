import Header from '@/components/header'
import Footer from '@/components/footer'

import Heading from '@/app/landscaping/components/sectionHeading'
import Marketing from '@/app/landscaping/components/sectionMarketing'
import Reviews from '@/app/landscaping/components/sectionReviews'
import Contact from '@/app/landscaping/components/sectionContact'

export default function ServiceLandscaping() {
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