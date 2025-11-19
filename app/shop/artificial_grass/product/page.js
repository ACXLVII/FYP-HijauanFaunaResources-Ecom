import Header from '@/components/header'
import Footer from '@/components/footer'

export default function ProductNotFound() {
  return (
    <div className='bg-[url("/images/backgrounds/SoilBackground.jpg")] bg-cover bg-center bg-fixed'>
      <Header />
      
      <main className="pt-21"> {/* padding for header + green bar */}
        
        <div className="bg-[#000000]/70 h-[calc(100vh-5rem)]">
          <div className="h-full max-w-[90vw] lg:max-w-[80vw] mx-auto py-8 lg:py-16">
            
            File not found. Please check the URL or return to the homepage.

          </div>
        </div>

        
      </main>

      <Footer />
    </div>
  );
}