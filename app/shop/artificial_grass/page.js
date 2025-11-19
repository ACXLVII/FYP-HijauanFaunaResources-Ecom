import Header from '@/components/header'
import Footer from '@/components/footer'

import Heading from '@/app/shop/artificial_grass/components/sectionHeading'
import Content from '@/app/shop/artificial_grass/components/sectionContent'

export default function ShopArtificialGrass() {
  return (
    <div className='bg-[url("/images/backgrounds/SoilBackground.jpg")] bg-cover bg-center bg-fixed'>
      <Header />
      
      <main className="pt-21"> {/* padding for header + green bar */}
        <Heading />
        <Content />
      </main>

      <Footer />
    </div>
  );
}