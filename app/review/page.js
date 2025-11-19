import Header from '@/components/header'
import Footer from '@/components/footer'

import Heading from '@/app/review/components/sectionHeading'
import ReviewForm from '@/app/review/components/sectionReviewForm'

export default function ReviewPage() {
  return (
    <div className='bg-[url("/images/backgrounds/SoilBackground.jpg")] bg-cover bg-center bg-fixed'>
      <Header />
      
      <main className="pt-21"> {/* padding for header + green bar */}
        <Heading />
        <ReviewForm />
      </main>

      <Footer />
    </div>
  );
}




