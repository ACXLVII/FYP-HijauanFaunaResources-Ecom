'use client';

import React, { useEffect, useState } from 'react';

/**
 * Enhanced AR Preview with Multi-Placement
 * - Tap screen to add multiple grass instances
 * - iOS: Uses Quick Look (single placement only - iOS limitation)
 * - Android: Uses Scene Viewer with "Add" button functionality
 */
export default function ARPreviewMultiPlacement({
  children,
  modelSrc,
  iosSrc,
  arPlacement = 'floor',
  className = '',
}) {
  
  const [isClient, setIsClient] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    setIsClient(true);
    
    // Better iOS/iPad detection
    const isAppleDevice = /iPhone|iPad|iPod/i.test(navigator.userAgent) || 
                          (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    setIsIOS(isAppleDevice);
    
    const checkMobile = () => {
      const isMobileDevice = window.innerWidth <= 1024 || 
                             /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ||
                             (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      setIsMobile(isMobileDevice);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Load model-viewer only for Android
    const isAppleCheck = /iPhone|iPad|iPod/i.test(navigator.userAgent) || 
                         (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    if (!isAppleCheck) {
      const script = document.createElement('script');
      script.type = 'module';
      script.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/3.3.0/model-viewer.min.js';
      document.head.appendChild(script);
    }

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleClick = () => {
    if (!isClient || !isMobile) return;
    setShowInstructions(true);
  };

  const handleStartAR = () => {
    setShowInstructions(false);

    // iOS: Use direct anchor link to USDZ
    if (isIOS && iosSrc) {
      const anchor = document.createElement('a');
      anchor.rel = 'ar';
      anchor.href = iosSrc;
      
      document.body.appendChild(anchor);
      anchor.click();
      
      setTimeout(() => {
        const clickEvent = new MouseEvent('click', {
          view: window,
          bubbles: true,
          cancelable: true
        });
        anchor.dispatchEvent(clickEvent);
      }, 50);
      
      setTimeout(() => document.body.removeChild(anchor), 500);
      return;
    }

    // Android: Use model-viewer with enhanced features
    const existingViewer = document.querySelector('#temp-ar-viewer');
    if (existingViewer) {
      existingViewer.remove();
    }

    const viewer = document.createElement('model-viewer');
    viewer.id = 'temp-ar-viewer';
    viewer.setAttribute('src', modelSrc);
    viewer.setAttribute('ar', '');
    viewer.setAttribute('ar-modes', 'scene-viewer');
    viewer.setAttribute('ar-placement', arPlacement);
    
    // Enable multi-placement features
    viewer.setAttribute('ar-scale', 'auto');
    
    viewer.style.cssText = 'position: fixed; width: 1px; height: 1px; top: -9999px; left: -9999px; opacity: 0; pointer-events: none;';
    
    document.body.appendChild(viewer);

    // Wait for model-viewer to load, then activate AR
    setTimeout(() => {
      if (viewer.activateAR) {
        viewer.activateAR();
      }
      
      // Cleanup after 30 seconds
      setTimeout(() => {
        if (document.body.contains(viewer)) {
          viewer.remove();
        }
      }, 30000);
    }, 500);
  };

  if (!isClient) return null;

  if (!isMobile) {
    return (
      <div className={className}>
        <div className="opacity-50 cursor-not-allowed">
          {children}
        </div>
      </div>
    );
  }

  return (
    <>
      <div 
        className={className}
        onClick={handleClick}
      >
        {children}
      </div>

      {/* Instructions Modal */}
      {showInstructions && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          style={{ backdropFilter: 'blur(4px)' }}
        >
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            
            {/* Icon */}
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-center mb-3 text-gray-800">
              AR Multi-Placement
            </h2>

            {/* Instructions */}
            <div className="space-y-3 mb-6">
              {isIOS ? (
                <>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                    <p className="text-gray-700 text-sm pt-0.5">
                      Point your camera at a flat surface
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                    <p className="text-gray-700 text-sm pt-0.5">
                      Tap to place the grass patch
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                    <p className="text-gray-700 text-sm pt-0.5">
                      Use pinch gestures to resize
                    </p>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-4">
                    <p className="text-xs text-yellow-800">
                      <strong>iOS Note:</strong> Quick Look supports single placement. For multiple patches, exit and reopen AR.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                    <p className="text-gray-700 text-sm pt-0.5">
                      Point your camera at a flat surface
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                    <p className="text-gray-700 text-sm pt-0.5">
                      Tap to place your first grass patch
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                    <p className="text-gray-700 text-sm pt-0.5">
                      <strong>Tap empty areas to add more grass!</strong>
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                    <p className="text-gray-700 text-sm pt-0.5">
                      Pinch to resize and drag to move each patch
                    </p>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-4">
                    <p className="text-xs text-green-800">
                      <strong>Pro Tip:</strong> Create your perfect lawn by placing multiple grass patches!
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowInstructions(false)}
                className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleStartAR}
                className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition shadow-lg"
              >
                Start AR
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}

