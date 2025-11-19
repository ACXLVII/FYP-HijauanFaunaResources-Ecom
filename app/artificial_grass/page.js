import Header from '@/components/header'
import Footer from '@/components/footer'

import Heading from '@/app/artificial_grass/components/sectionHeading'
import Marketing from '@/app/artificial_grass/components/sectionMarketing'
import Thicknesses from '@/app/artificial_grass/components/sectionThicknesses'
import Grades from '@/app/artificial_grass/components/sectionGrades'
import Reviews from '@/app/artificial_grass/components/sectionReviews'
import Contact from '@/app/artificial_grass/components/sectionContact'

export default function ServiceArtificialGrass() {
  return (
    <div className='bg-[url("/images/backgrounds/SoilBackground.jpg")] bg-cover bg-center bg-fixed'>
      <Header />
      
      <main className="pt-21"> {/* padding for header + green bar */}
        {/* <Heading /> */}
        <Marketing />
        <Grades />
        <Thicknesses />
        <Reviews />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}