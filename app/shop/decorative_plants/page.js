import Header from '@/components/header'
import Footer from '@/components/footer'

import Heading from '@/app/shop/decorative_plants/components/sectionHeading'
import Content from '@/app/shop/decorative_plants/components/sectionContent'

export default function ShopDecorativePlants() {
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

