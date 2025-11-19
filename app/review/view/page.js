import Header from '@/components/header'
import Footer from '@/components/footer'

import Heading from '@/app/review/view/components/sectionHeading'
import ReviewsList from '@/app/review/view/components/sectionReviewsList'

export default function ViewReviewsPage() {
  return (
    <div className='bg-[url("/images/backgrounds/SoilBackground.jpg")] bg-cover bg-center bg-fixed'>
      <Header />
      
      <main className="pt-21"> {/* padding for header + green bar */}
        <Heading />
        <ReviewsList />
      </main>

      <Footer />
    </div>
  );
}




