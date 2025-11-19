import { AiFillTikTok, AiFillFacebook  } from "react-icons/ai";

const navigation = {
  social: [
    {
      name: 'Facebook',
      href: 'https://www.facebook.com/FablushGirdle/',
      icon: AiFillFacebook,
    },
    {
      name: 'TikTok',
      href: 'https://www.tiktok.com/@hijauanfaunalandscape',
      icon: AiFillTikTok,
    },
  ],
};
  
export default function Example() {
  return (
    <footer className="bg-white">
      
      {/* Footer Content BEGINS */}
      <div className="max-w-7xl mx-auto py-8"> {/* pb-8 */}

        {/* Logo BEGINS */}
        <div className="flex items-center justify-center mt-8 sm:mt-10 lg:mt-12 mb-4 sm:mb-5 lg:mb-6">
          <img
            alt="Hijauan Fauna Resources Sdn. Bhd."
            src="/images/HFRlogo.png"
            className="h-40 sm:h-50 lg:h-60 object-contain"
          />
        </div>
        {/* Logo ENDS */} 
        
        {/* Disclaimer BEGINS */}
        <div className="flex justify-center mb-4 sm:mb-5 lg:mb-6">
          <p className="mx-16 lg:mx-32 text-justify text-black text-sm/6">
            Hijauan Fauna Resources specializes in the supply and installation of artificial grass, as well as landscaping work and lawn maintenance.
          </p>
        </div>
        {/* Disclaimer Group ENDS */}

        {/* Social Links BEGINS */}
        <div className="flex justify-center mb-8 sm:mb-10 lg:mb-12">
          <div className="grid grid-cols-2 gap-8 sm:flex sm:flex-row sm:space-x-8">
            {navigation.social.map((item) => (
            <a key={item.name} href={item.href} className="flex items-center text-black hover:text-gray-800 space-x-2">
              <item.icon aria-hidden="true" className="size-6" />
              <span>{item.name}</span>
            </a>
            ))}
          </div>
        </div>
        {/* Social Links ENDS */}

        {/* Copyright Mark BEGINS */}
        <div className="justify-center mb-8 sm:mb-10 lg:mb-12">
          <p className="mx-16 text-center text-sm text-black/50">
            &copy; 2025 Hijauan Fauna Resources Sdn. Bhd. All rights reserved.
          </p>
        </div>
        {/* Copyright Mark ENDS */}

      </div>
      {/* Footer Content ENDS */}

    </footer>
  )
}