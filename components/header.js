'use client'

import {
  useEffect,
  useRef,
  useState,
} from 'react'
import {
  Dialog,
  DialogBackdrop,
  DialogPanel
} from '@headlessui/react'
import {
  FaChevronDown
} from "react-icons/fa";
import {
  GiBandageRoll,
  GiHighGrass,
  GiStonePile
} from "react-icons/gi";
import {
  MdGrass
} from "react-icons/md";
import {
  PiPottedPlant
} from "react-icons/pi";
import {
  TbFountain,
  TbGardenCart,
  TbShovelPitchforks,
  TbTrees
} from 'react-icons/tb'
import {
  FaStar
} from 'react-icons/fa'
import {
  Bars3Icon
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import NavigationPanels from '/components/components/sectionNavigationPanels';
import { useCart } from '@/app/hooks/useCart';

const navigation = {
  menuItems: [
    {
      id: 'menuItem1',
      name: 'Services',
      categories: [
        {
          id: '1',
          name: 'Grass',
          icon: MdGrass,
          subCategories: [
            {
              id: '1',
              name: 'Live Grass',
              icon: GiHighGrass,
              href: '/live_grass',
              imageSrc: '/images/header/navigation/LiveGrassTexture.jpg',
              imageAlt: 'Live Grass',
            },
            {
              id: '2',
              name: 'Artificial Grass',
              icon: GiBandageRoll,
              href: '/artificial_grass',
              imageSrc: '/images/header/navigation/ArtificialGrassTexture.jpg',
              imageAlt: 'Artificial Grass',
            },
          ],
          imageSrc: '/images/header/navigation/Grass.jpg',
          imageAlt: 'Grass',
        },
        {
          id: '2',
          name: 'Landscaping',
          icon: TbTrees,
          href: '/landscaping',
          imageSrc: '/images/header/navigation/Landscaping.jpg',
          imageAlt: 'Landscaping',
        },
        {
          id: '3',
          name: 'Maintenance',
          icon: TbShovelPitchforks,
          href: '/maintenance',
          imageSrc: '/images/header/navigation/Maintenance.jpg',
          imageAlt: 'Maintenance',
        },
      ],
    },
    {
      id: 'menuItem2',
      name: 'Shop',
      promotions: [
        {
          id: '1',
          name: 'Promo 1',
          href: '/',
          imageSrc: '/images/header/navigation/shop/16-9.jpg',
          imageAlt: 'Promo 1',
        },
        {
          id: '2',
          name: 'Promo 2',
          href: '/',
          imageSrc: '/images/header/navigation/shop/4-3.jpg',
          imageAlt: 'Promo 2',
        },
        {
          id: '3',
          name: 'Promo 3',
          href: '/',
          imageSrc: '/images/header/navigation/shop/4-3.jpg',
          imageAlt: 'Promo 3',
        },
      ],
      categories: [
        {
          id: '1',
          name: 'Grass',
          icon: MdGrass,
          subCategories: [
            {
              id: '1',
              name: 'Live',
              href: '/shop/live_grass',
            },
            {
              id: '2',
              name: 'Artificial',
              href: '/shop/artificial_grass',
            },
          ],
        },
        {
          id: '2',
          name: 'Plants',
          icon: PiPottedPlant,
          subCategories: [
            {
              id: '1',
              name: 'Decorative',
              href: '/decorative_plants',
            },
            {
              id: '2',
              name: 'Produce',
              href: '/produce_plants',
            },
          ],
        },
        {
          id: '3',
          name: 'Rocks',
          icon: GiStonePile,
          subCategories: [
            {
              id: '1',
              name: 'Boulders',
              href: '/boulder_rocks',
            },
            {
              id: '2',
              name: 'Pebbles',
              href: '/pebble_rocks',
            },
          ],
        },
        {
          id: '4',
          name: 'Others',
          icon: TbFountain,
          subCategories: [
            {
              id: '1',
              name: 'Furniture',
              href: '/furniture',
            },
            {
              id: '2',
              name: 'Ornaments',
              href: '/ornaments',
            },
          ],
        },
      ],
    },
    {
      id: 'menuItem3',
      name: 'Review',
      categories: [
        {
          id: '1',
          name: 'Write Review',
          icon: FaStar,
          href: '/review',
        },
        {
          id: '2',
          name: 'View Reviews',
          icon: FaStar,
          href: '/review/view',
        },
      ],
    },
  ],
  pages: [
    { name: 'About Us', href: '/about' },
    { name: 'Tips', href: '/tips' },
  ],
}

const servicesPaths = [
  '/live_grass',
  '/artificial_grass',
  '/landscaping',
  '/maintenance',
];
const shopPath = '/shop';
const reviewPath = '/review';

export default function Header() {

  // [MOBILE NAVIGATION STATES AND FUNCTIONS]
  const [mobileNavOpen, setMobileNavOpen] = useState(false) // Mobile navigation panel state.
  useEffect(() => {
    if (!mobileNavOpen) { // If mobile navigation menu is not opened...
      setShowMobileGrassList(false); // Closes grass button list.
      setShowMobileShopList(false); // Closes shop button list.
    }
  }, [mobileNavOpen]);

  const [showMobileGrassList, setShowMobileGrassList] = useState(false); // Mobile grass button list state.
  const mobileGrassRef = useRef(null); // Mobile grass button list ref.
  useEffect(() => {
    if (!showMobileGrassList) return;
    function handleClick(e) {
      if (mobileGrassRef.current && !mobileGrassRef.current.contains(e.target)) {
        setShowMobileGrassList(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showMobileGrassList]);
  
  const [showMobileShopList, setShowMobileShopList] = useState(false); // Mobile shop button list state.
  const mobileShopRef = useRef(null); // Mobile shop button list ref.
  useEffect(() => {
    if (!showMobileShopList) return;
    function handleClick(e) {
      if (mobileShopRef.current && !mobileShopRef.current.contains(e.target)) {
        setShowMobileShopList(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showMobileShopList]);
  
  // [DESKTOP NAVIGATION STATES AND FUNCTIONS]
  const [showDesktopOverlay, setShowDesktopOverlay] = useState(false)

  const pathname = usePathname();
  
  // Add new state for tracking which panel is open
  const [openPanel, setOpenPanel] = useState(null)

  const [showGrassSplit, setShowGrassSplit] = useState(false);
  const grassSplitRef = useRef(null);
  useEffect(() => {
    if (!showGrassSplit) return
    function handleClick(e) {
      if (grassSplitRef.current && !grassSplitRef.current.contains(e.target)) {
        setShowGrassSplit(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [showGrassSplit])

  const handlePanelClose = () => {
    setOpenPanel(null)
    setShowDesktopOverlay(false)
    setShowGrassSplit(false)
  }

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openPanel && !event.target.closest('.navigation-panel') && !event.target.closest('.nav-button')) {
        handlePanelClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [openPanel])

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

  // [CART STATES AND FUNCTIONS]
  const { getCartCount } = useCart();
  const cartCount = getCartCount();

  const isServicesActive = servicesPaths.some(path => pathname.startsWith(path));
  const isShopActive = pathname.startsWith(shopPath);
  const isReviewActive = pathname.startsWith(reviewPath);

  return (
    <div className="z-50">
      
      {/* Mobile Navigation Panel BEGINS */}
      <Dialog open={mobileNavOpen} onClose={setMobileNavOpen} className="relative z-51 lg:hidden">
        
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-[#000000]/50 transition-opacity duration-300 ease-linear data-closed:opacity-0"
        /> {/* ISSUE, hairline gap at bottom */}

        {/* Menu Content BEGINS */}
        <div className="fixed flex inset-0 z-52">
          <DialogPanel
            transition
            className="relative overflow-y-auto flex flex-col w-3/4 bg-[#000000]/50 backdrop-blur-sm shadow-lg transform transition duration-300 ease-in-out data-closed:-translate-x-full"
          >

            {/* Service Links BEGINS */}
            <div className="relative grid grid-cols-1 px-4 my-4">
              
              {/* Home Button */}
              <div
                className="relative overflow-hidden flex items-center justify-center h-30 w-full mb-4 bg-[#FFFFFF] rounded-lg shadow-lg active:shadow-none transition active:scale-99"
                onClick={() => window.location.href = '/'}
                tabIndex={0}
                role="button"
              >
                <div
                  className="absolute inset-0 flex items-center justify-center h-full w-full px-4"
                >
                  <img
                    className="bg-contain bg-center bg-no-repeat"
                    src="/images/hfrLogoTitle.png"
                    alt="Home"
                  />
                </div>
              </div>

              {/* Grass Button */}
              <div ref={mobileGrassRef}>
                {/* Button */}
                <div
                  className="relative overflow-hidden z-54 h-30 bg-[url('/images/header/navigation/grass.jpg')] bg-cover bg-center rounded-lg shadow-lg active:shadow-none transition active:scale-99"
                  onClick={() => setShowMobileGrassList((prev) => !prev)}
                  tabIndex={0}
                  role="button"
                >
                  <h1 className="absolute top-0 left-0 w-full p-2 bg-[#000000]/50 font-bold tracking-tight text-lg text-[#FFFFFF]">
                    Grass
                  </h1>
                </div>
                {/* Dropdown */}
                <div
                  className={`
                    overflow-hidden z-53 mb-4 bg-white rounded-lg shadow-inner
                    origin-top transition-all duration-300 ease-in-out
                    ${showMobileGrassList ? 'max-h-24 opacity-100 translate-y-0 pointer-events-auto' : 'max-h-0 opacity-0 -translate-y-4 pointer-events-none'}
                  `}
                >
                  <div className="p-4 space-y-4">
                    <Link href="/live_grass" className="block text-gray-600">Live Grass</Link>
                    <Link href="/artificial_grass" className="block text-gray-600">Artificial Grass</Link>
                  </div>
                </div>
              </div>

              {/* Landscaping Button */}
              <div
                className="relative overflow-hidden h-30 mb-4 bg-[url('/images/header/navigation/landscaping.jpg')] bg-cover bg-center rounded-lg shadow-lg active:shadow-none transition active:scale-99"
                onClick={() => window.location.href = '/landscaping'}
                tabIndex={0}
                role="button"
              >
                <h1 className="absolute top-0 left-0 w-full p-2 bg-[#000000]/50 font-bold tracking-tight text-lg text-[#FFFFFF]">
                  Landscaping
                </h1>
              </div>
              
              {/* Maintenance Button */}
              <div
                className="relative overflow-hidden h-30 mb-4 bg-[url('/images/header/navigation/maintenance.jpg')] bg-cover bg-center rounded-lg shadow-lg active:shadow-none transition active:scale-99"
                onClick={() => window.location.href = '/maintenance'}
                tabIndex={0}
                role="button"
              >
                <h1 className="absolute top-0 left-0 w-full p-2 bg-[#000000]/50 font-bold tracking-tight text-lg text-[#FFFFFF]">
                  Maintenance
                </h1>
              </div>
              
              {/* Shop Button */}
              <div ref={mobileShopRef}>
                {/* Button */}
                <div
                  className="relative overflow-hidden z-54 h-30 bg-[url('/images/header/navigation/grass.jpg')] bg-cover bg-center rounded-lg shadow-lg active:shadow-none transition active:scale-99"
                  onClick={() => setShowMobileShopList((prev) => !prev)}
                  tabIndex={0}
                  role="button"
                >
                  <h1 className="absolute top-0 left-0 w-full p-2 bg-[#000000]/50 font-bold tracking-tight text-lg text-[#FFFFFF]">
                    Shop
                  </h1>
                </div>
                {/* Dropdown */}
                <div
                  className={`
                    overflow-hidden z-53 mb-4 bg-white rounded-lg shadow-inner
                    origin-top transition-all duration-300 ease-in-out
                    ${showMobileShopList ? 'max-h-54 opacity-100 translate-y-0 pointer-events-auto' : 'max-h-0 opacity-0 -translate-y-4 pointer-events-none'}
                  `}
                >
                  <div className="p-4 space-y-4">
                    <Link href="/shop/live_grass" className="block text-gray-600">Live Grass</Link>
                    <Link href="/shop/artificial_grass" className="block text-gray-600">Artificial Grass</Link>
                    <Link href="/shop/Plants" className="block text-gray-600">Plants</Link>
                    <Link href="/shop/Rocks" className="block text-gray-600">Rocks</Link>
                    <Link href="/shop/Others" className="block text-gray-600">Others</Link>
                  </div>
                </div>
              </div>

              {/* About Button */}
              <div
                className="relative overflow-hidden h-30 mb-4 bg-[url('/images/header/navigation/about.jpg')] bg-cover bg-center rounded-lg shadow-lg active:shadow-none transition active:scale-99"
                onClick={() => window.location.href = '/about'}
                tabIndex={0}
                role="button"
              >
                <h1 className="absolute top-0 left-0 w-full p-2 bg-[#000000]/50 font-bold tracking-tight text-lg text-[#FFFFFF]">
                  About
                </h1>
              </div>

              {/* Tips Button */}
              <div
                className="relative overflow-hidden h-30 mb-4 bg-[url('/images/header/navigation/tips.jpg')] bg-cover bg-center rounded-lg shadow-lg active:shadow-none transition active:scale-99"
                onClick={() => window.location.href = '/tips'}
                tabIndex={0}
                role="button"
              >
                <h1 className="absolute top-0 left-0 w-full p-2 bg-[#000000]/50 font-bold tracking-tight text-lg text-[#FFFFFF]">
                  Tips
                </h1>
              </div>

              {/* Review Button */}
              <div
                className="relative overflow-hidden h-30 bg-[url('/images/header/navigation/Shop.jpg')] bg-cover bg-center rounded-lg shadow-lg active:shadow-none transition active:scale-99"
                onClick={() => window.location.href = '/review'}
                tabIndex={0}
                role="button"
              >
                <h1 className="absolute top-0 left-0 w-full p-2 bg-[#000000]/50 font-bold tracking-tight text-lg text-[#FFFFFF]">
                  Review
                </h1>
              </div>

            </div>

          </DialogPanel>
        </div>
        {/* Menu Content ENDS */}

      </Dialog>
      {/* Mobile Navigation Panel ENDS */}

      {/* Desktop Overlay */}
      {showDesktopOverlay && (
        <div
          className="fixed inset-0 z-44 bg-[#000000]/50 transition-opacity duration-300"
          onClick={handlePanelClose}
          aria-hidden="true"
        />
      )}

      {/* Desktop Header BEGINS */}
      <header className="fixed top-0 z-50 w-full">
        <nav aria-label="Top" className="relative">

          {/* Green Bar BEGINS */}
          <div className="bg-[#56BB00]">
            <div className="flex h-5 max-w-[80vw] items-center justify-between px-4 sm:px-6 lg:px-8">
              
            </div>
          </div>
          {/* Green Bar ENDS */}

          {/* Primary Navigation Bar BEGINS */}
          <div
            className="relative flex items-center h-16 mx-auto bg-[#FFFFFF]"
          >

            {/* Shadow Gradient */}
            <div
              className="absolute left-0 -bottom-4 w-full h-4 pointer-events-none z-50"
              style={{
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.18) 40%, rgba(0,0,0,0.10) 70%, transparent 100%)'
              }}
            />
            
            {/* Logo (lg+) */}
            <div title="Home" className="absolute top-1/2 -translate-y-1/2 lg:left-8 hidden lg:flex lg:items-center">
              <Link href="/">
                <img
                  alt="Hijauan Fauna Resources"
                  src="/images/hfrLogoTitle.png"
                  className="h-8 w-auto"
                />
              </Link>
            </div>

            {/* Navigation (lg+) */}
            <div className="hidden lg:flex lg:flex-1 items-center justify-center h-full">
              <div className="flex items-center justify-center h-full space-x-16">
                {navigation.menuItems.map((category) => {
                  let isActive = false;
                  if (category.name === 'Services') isActive = isServicesActive;
                  if (category.name === 'Shop') isActive = isShopActive;
                  if (category.name === 'Review') isActive = isReviewActive;

                  return (
                    <button
                      key={category.id}
                      className={`
                        nav-button relative flex items-center justify-center h-full
                        text-lg text-[#4A5565] hover:text-[#C39533]
                        cursor-pointer transition-colors duration-200 ease-out
                        ${isActive || openPanel === category.name ? 'text-[#C39533]' : ''}
                      `}
                      onClick={() => {
                        if (openPanel === category.name) {
                          setOpenPanel(null);
                          setShowDesktopOverlay(false);
                        } else {
                          setOpenPanel(category.name);
                          setShowDesktopOverlay(true);
                        }
                      }}
                    >
                      <span className="flex items-center gap-1">
                        {category.name}
                        <FaChevronDown className="ml-1 text-xs" />
                      </span>
                      {openPanel === category.name && (
                        <span className="absolute left-0 bottom-0 w-full h-1 bg-[#C39533] pointer-events-none" />
                      )}
                    </button>
                  );
                })}

                {navigation.pages.map((page) => {
                  const isActive = pathname === page.href;
                  return (
                    <a
                      key={page.name}
                      href={page.href}
                      className={classNames(
                        "flex items-center justify-center h-full text-lg text-[#4A5565] hover:text-[#C39533] relative transition-colors duration-200 ease-out",
                        isActive ? "text-[#C39533]" : "",
                      )}
                    >
                      {page.name}
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Mobile Menu Button (lg-) */}
            <div title="Menu" className="absolute top-1/2 -translate-y-1/2 left-4 lg:left-8 flex items-center lg:hidden">
              <button
                type="button"
                onClick={() => setMobileNavOpen(true)}
                className="text-[#C39533] hover:text-[#E1C46A] cursor-pointer"
              >
                <Bars3Icon aria-hidden="true" className="size-8" />
              </button>
            </div>

            {/* Logo (lg-) */}
            <Link href="/" title="Home" className="absolute left-1/2 -translate-x-1/2 lg:hidden">
              <img
                alt="Hijauan Fauna Resources"
                src="/images/hfrLogoTitle.png"
                className="h-8 w-auto"
              />
            </Link>

            {/* Cart */}
            <Link href="/cart" title="Cart" className="group absolute right-4 lg:right-8 flex items-center justify-end">
              <span className="mr-2 lg:mr-4 text-md lg:text-lg text-gray-600">{cartCount}</span>
              <TbGardenCart
                aria-hidden="true"
                className="size-8 text-[#C39533] group-hover:text-[#E1C46A]"
              />
            </Link>

            {/* Whatsapp Button Mobile */}
            <a
              href="https://wa.me/601127312673" // Current number is Employer F (HF Landscape).
              target="_blank"
              rel="noopener noreferrer"
              className="lg:hidden fixed bottom-4 right-4 z-50 flex items-center justify-center p-4 bg-[#25D366] active:bg-[#25D366]/50 transition-colors text-[#FFFFFF] rounded-full"
              style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.52 3.48A11.93 11.93 0 0 0 12 0C5.37 0 0 5.37 0 12c0 2.11.55 4.16 1.6 5.97L0 24l6.18-1.62A11.93 11.93 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.19-1.24-6.19-3.48-8.52zM12 22c-1.85 0-3.66-.5-5.23-1.44l-.37-.22-3.67.96.98-3.58-.24-.37A9.94 9.94 0 0 1 2 12c0-5.52 4.48-10 10-10s10 4.48 10 10-4.48 10-10 10zm5.2-7.8c-.28-.14-1.65-.81-1.9-.9-.25-.09-.43-.14-.61.14-.18.28-.7.9-.86 1.08-.16.18-.32.2-.6.07-.28-.14-1.18-.44-2.25-1.4-.83-.74-1.39-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.13-.13.28-.32.42-.48.14-.16.18-.28.28-.46.09-.18.05-.34-.02-.48-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.61-.47-.16-.01-.34-.01-.52-.01-.18 0-.48.07-.73.34-.25.27-.97.95-.97 2.3 0 1.35.99 2.65 1.13 2.83.14.18 1.95 2.98 4.74 4.06.66.28 1.18.45 1.58.58.66.21 1.26.18 1.73.11.53-.08 1.65-.67 1.88-1.32.23-.65.23-1.2.16-1.32-.07-.12-.25-.19-.53-.33z"/>
              </svg>
            </a>

            {/* Whatsapp Button Desktop */}
            <a
              href="https://wa.me/601127312673" // Current number is Employer F (HF Landscape).
              target="_blank"
              rel="noopener noreferrer"
              className="hidden fixed bottom-4 right-4 z-50 lg:flex items-center justify-center p-4 bg-[#25D366] active:bg-[#25D366]/50 transition-colors text-[#FFFFFF] rounded-full"
              style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }}
              title="Contact Us on WhatsApp"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.52 3.48A11.93 11.93 0 0 0 12 0C5.37 0 0 5.37 0 12c0 2.11.55 4.16 1.6 5.97L0 24l6.18-1.62A11.93 11.93 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.19-1.24-6.19-3.48-8.52zM12 22c-1.85 0-3.66-.5-5.23-1.44l-.37-.22-3.67.96.98-3.58-.24-.37A9.94 9.94 0 0 1 2 12c0-5.52 4.48-10 10-10s10 4.48 10 10-4.48 10-10 10zm5.2-7.8c-.28-.14-1.65-.81-1.9-.9-.25-.09-.43-.14-.61.14-.18.28-.7.9-.86 1.08-.16.18-.32.2-.6.07-.28-.14-1.18-.44-2.25-1.4-.83-.74-1.39-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.13-.13.28-.32.42-.48.14-.16.18-.28.28-.46.09-.18.05-.34-.02-.48-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.61-.47-.16-.01-.34-.01-.52-.01-.18 0-.48.07-.73.34-.25.27-.97.95-.97 2.3 0 1.35.99 2.65 1.13 2.83.14.18 1.95 2.98 4.74 4.06.66.28 1.18.45 1.58.58.66.21 1.26.18 1.73.11.53-.08 1.65-.67 1.88-1.32.23-.65.23-1.2.16-1.32-.07-.12-.25-.19-.53-.33z"/>
              </svg>
            </a>

          </div>
          {/* Primary Navigation Bar ENDS */}

        </nav>
      </header>
      {/* Desktop Header ENDS */}

      <NavigationPanels
        openPanel={openPanel}
        setOpenPanel={setOpenPanel}
        showGrassSplit={showGrassSplit}
        setShowGrassSplit={setShowGrassSplit}
        grassSplitRef={grassSplitRef}
        navigation={navigation}
      />

    </div>
  )
}