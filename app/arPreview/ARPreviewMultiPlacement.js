'use client';

import React, { useEffect, useState, useRef } from 'react';

/**
 * Unified AR Preview using model-viewer
 * - Works on both Android and iOS
 * - Android: Uses Scene Viewer or WebXR (via model-viewer)
 * - iOS: Uses Quick Look (via model-viewer)
 */
export default function ARPreviewMultiPlacement({
  children,
  modelSrc,
  iosSrc,
  arPlacement = 'floor',
  className = '',
}) {
  
  const modelViewerRef = useRef(null);
  const [isClient, setIsClient] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [isActivating, setIsActivating] = useState(false);
  const [error, setError] = useState(null);

  // Initialize client-side detection and load model-viewer
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    setIsClient(true);
    
    // Detect iOS devices
    const userAgentCheck = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    const iPadOSCheck = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
    const vendorCheck = /iPad|iPhone|iPod/.test(navigator.vendor);
    const isIOSDevice = userAgentCheck || iPadOSCheck || vendorCheck;
    setIsIOS(isIOSDevice);
    
    // Detect mobile devices
    const checkMobile = () => {
      const isMobileDevice = window.innerWidth <= 1024 || 
                             /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      setIsMobile(isMobileDevice);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Load model-viewer
    const loadModelViewer = async () => {
      if (window.customElements?.get('model-viewer')) return;
      try {
        await import('@google/model-viewer');
        await window.customElements.whenDefined('model-viewer');
      } catch (err) {
        console.error('Failed to load model-viewer:', err);
      }
    };
    loadModelViewer();

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Force hide model-viewer when not activating
  useEffect(() => {
    if (!isActivating && modelViewerRef.current) {
      if (modelViewerRef.current) {
        modelViewerRef.current.style.cssText = 'display: none !important; position: fixed !important; top: -9999px !important; left: -9999px !important; width: 1px !important; height: 1px !important; visibility: hidden !important; opacity: 0 !important; pointer-events: none !important; z-index: -1 !important;';
      }
    }
  }, [isActivating]);

  const handleClick = () => {
    if (!isClient || !isMobile) return;
    setShowInstructions(true);
  };

  const handleStartAR = async () => {
    if (!modelViewerRef.current) {
      setError('AR not available. Please refresh the page and try again.');
      setShowInstructions(false);
      return;
    }

    setShowInstructions(false);
    setIsActivating(true);
    setError(null);

    const modelViewer = modelViewerRef.current;

    try {
      // Hide model-viewer function
      const hideModelViewer = () => {
        if (modelViewerRef.current) {
          modelViewerRef.current.style.cssText = 'display: none !important; position: fixed !important; top: -9999px !important; left: -9999px !important; width: 1px !important; height: 1px !important; visibility: hidden !important; opacity: 0 !important; pointer-events: none !important; z-index: -1 !important;';
        }
        setIsActivating(false);
      };
      
      // Listen for visibility change (when user switches away from AR)
      const visibilityHandler = () => {
        if (document.visibilityState === 'visible' && isActivating) {
          setTimeout(hideModelViewer, 500);
        }
      };
      document.addEventListener('visibilitychange', visibilityHandler);
      
      // Listen for AR session end
      const arStatusHandler = (event) => {
        if (event.detail.status === 'not-presenting' || event.detail.status === 'failed') {
          hideModelViewer();
          document.removeEventListener('visibilitychange', visibilityHandler);
        }
      };
      modelViewer.addEventListener('ar-status', arStatusHandler);
      
      // Fallback: Check periodically if AR is still active
      const checkInterval = setInterval(() => {
        if (modelViewer.canActivateAR && !modelViewer.modelIsVisible) {
          hideModelViewer();
          clearInterval(checkInterval);
          document.removeEventListener('visibilitychange', visibilityHandler);
        }
      }, 1000);
      
      // Cleanup after 5 minutes max
      const maxTimeout = setTimeout(() => {
        hideModelViewer();
        clearInterval(checkInterval);
        document.removeEventListener('visibilitychange', visibilityHandler);
      }, 300000); // 5 minutes
      
      // Make model-viewer visible for AR activation
      modelViewer.style.cssText = 'position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 9999; background: transparent; display: block; visibility: visible; opacity: 1;';
      
      // Wait for model to load if needed
      if (!modelViewer.loaded) {
        await new Promise((resolve, reject) => {
          const timeout = setTimeout(() => reject(new Error('Model loading timeout. Please check your connection.')), 15000);
          const onLoad = () => {
            clearTimeout(timeout);
            modelViewer.removeEventListener('load', onLoad);
            resolve();
          };
          modelViewer.addEventListener('load', onLoad);
          if (modelViewer.loaded) {
            clearTimeout(timeout);
            resolve();
          }
        });
      }

      // Wait a moment for everything to be ready
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Activate AR
      if (modelViewer && typeof modelViewer.activateAR === 'function') {
        await modelViewer.activateAR();
      } else {
        clearInterval(checkInterval);
        clearTimeout(maxTimeout);
        document.removeEventListener('visibilitychange', visibilityHandler);
        throw new Error('AR not available on this device or browser.');
      }
      
    } catch (err) {
      console.error('AR activation error:', err);
      setError(err.message || 'Failed to start AR. Please try again or use a different device.');
      setIsActivating(false);
      // Force hide model-viewer
      if (modelViewerRef.current) {
        modelViewerRef.current.style.cssText = 'display: none !important; position: fixed !important; top: -9999px !important; left: -9999px !important; width: 1px !important; height: 1px !important; visibility: hidden !important; opacity: 0 !important; pointer-events: none !important; z-index: -1 !important;';
      }
    }
  };

  if (!isClient) return null;

  // Hide button if iOS but no iosSrc provided
  if (isIOS && !iosSrc) {
    return null;
  }

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
      {error && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-xs rounded-lg bg-white p-6 text-center shadow-xl">
            <h2 className="mb-2 text-lg font-semibold text-gray-900">AR Error</h2>
            <p className="mb-4 text-sm text-gray-700">{error}</p>
            <button
              type="button"
              className="w-full rounded-md bg-[#623183] px-4 py-2 text-sm font-semibold text-white"
              onClick={() => setError(null)}
            >
              OK
            </button>
          </div>
        </div>
      )}

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
              AR Preview
            </h2>

            {/* Unified Instructions */}
            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                <p className="text-gray-700 text-sm pt-0.5">
                  Point your camera at a flat surface (floor or table)
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                <p className="text-gray-700 text-sm pt-0.5">
                  Wait for surface detection (you'll see tracking indicators)
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                <p className="text-gray-700 text-sm pt-0.5">
                  <strong>Tap on the surface</strong> to place the model in AR
                </p>
              </div>
              {isIOS && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
                  <p className="text-xs text-blue-800">
                    <strong>iOS Note:</strong> You may see a dialog to "Open this 3D model" - tap it to continue.
                  </p>
                </div>
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
                disabled={isActivating}
              >
                {isActivating ? 'Starting...' : 'Start AR'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Hidden model-viewer - will be activated programmatically */}
      {isClient && (
        <model-viewer
          ref={modelViewerRef}
          src={modelSrc}
          ios-src={iosSrc}
          ar
          ar-modes="webxr scene-viewer quick-look"
          ar-placement={arPlacement}
          ar-scale="auto"
          camera-controls
          loading="eager"
          style={{ 
            display: 'none',
            position: 'fixed',
            top: '-9999px',
            left: '-9999px',
            width: '1px',
            height: '1px',
            visibility: 'hidden',
            opacity: 0,
            pointerEvents: 'none'
          }}
        />
      )}
    </>
  );
}
