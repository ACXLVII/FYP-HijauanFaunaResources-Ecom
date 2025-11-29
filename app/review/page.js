import Header from '@/components/header'
import Footer from '@/components/footer'

import Heading from '@/app/review/components/sectionHeading'
import ReviewForm from '@/app/review/components/sectionReviewForm'
import ReviewsList from '@/app/review/view/components/sectionReviewsList'

export default function ReviewPage() {
  return (
    <div className='bg-[url("/images/backgrounds/SoilBackground.jpg")] bg-cover bg-center bg-fixed'>
      <Header />
      
      <main className="pt-21"> {/* padding for header + green bar */}
        <Heading />
        
        {/* Combined Reviews Section - View Reviews (Left) and Write Review (Right) */}
        <div className="bg-[#000000]/50">
          <div className="max-w-[90vw] lg:max-w-[80vw] mx-auto py-8 lg:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Left Side - View Reviews */}
              <div className="order-2 lg:order-1">
                <ReviewsList />
              </div>
              
              {/* Right Side - Write Review */}
              <div className="order-1 lg:order-2">
                <ReviewForm />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}




