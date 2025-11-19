import Header from '@/components/header'
import Footer from '@/components/footer'

import Content from '@/app/shop/components/sectionContent'

export default function Shop() {
  return (
    <div className='bg-[url("/images/backgrounds/SoilBackground.jpg")] bg-cover bg-center bg-fixed'>
      <Header />
      
      <main className="mt-21"> {/* padding for header + green bar */}
        <Content />
      </main>

      <Footer />
    </div>
  );
}