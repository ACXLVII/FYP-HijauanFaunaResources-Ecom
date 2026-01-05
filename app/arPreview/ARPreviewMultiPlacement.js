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
  const cleanupRef = useRef(null); // Store cleanup functions
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

  // Cleanup function to hide model-viewer
  const hideModelViewer = () => {
    console.log('[AR Cleanup] Starting cleanup, isIOS:', isIOS);
    
    if (modelViewerRef.current) {
      const viewer = modelViewerRef.current;
      
      // Try to exit any presentation mode first
      if (viewer.exitPresent && typeof viewer.exitPresent === 'function') {
        try {
          viewer.exitPresent();
          console.log('[AR Cleanup] Called exitPresent');
        } catch (e) {
          console.warn('[AR Cleanup] Could not exit present:', e);
        }
      }
      
      // For iOS, try to dismiss AR if it's still active
      if (isIOS && viewer.dismissPoster && typeof viewer.dismissPoster === 'function') {
        try {
          viewer.dismissPoster();
          console.log('[AR Cleanup] Called dismissPoster (iOS)');
        } catch (e) {
          console.warn('[AR Cleanup] Could not dismiss poster:', e);
        }
      }
      
      // Hide the model-viewer completely (use cssText to override all previous styles)
      // BUT keep the ar attribute intact (don't remove it)
      viewer.style.cssText = 'display: none !important; position: fixed !important; top: -9999px !important; left: -9999px !important; width: 1px !important; height: 1px !important; visibility: hidden !important; opacity: 0 !important; pointer-events: none !important; z-index: -9999 !important;';
      
      // IMPORTANT: Don't remove the 'ar' attribute
      // This was breaking iOS re-launches. The element must keep its AR configuration.
      
      console.log('[AR Cleanup] Model viewer hidden');
    }
    setIsActivating(false);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Clean up any active listeners
      if (cleanupRef.current) {
        cleanupRef.current();
      }
      hideModelViewer();
    };
  }, []);

  // Force hide model-viewer when not activating
  useEffect(() => {
    if (!isActivating && modelViewerRef.current) {
      hideModelViewer();
    }
  }, [isActivating]);

  const handleClick = () => {
    if (!isClient || !isMobile) return;
    setShowInstructions(true);
  };

  const handleStartAR = async () => {
    console.log('[AR Start] handleStartAR called, isIOS:', isIOS);
    
    if (!modelViewerRef.current) {
      setError('AR not available. Please refresh the page and try again.');
      setShowInstructions(false);
      return;
    }

    // Clean up any previous AR session
    if (cleanupRef.current) {
      console.log('[AR Start] Cleaning up previous session');
      cleanupRef.current();
      cleanupRef.current = null;
      // Wait a moment for cleanup to complete
      await new Promise(resolve => setTimeout(resolve, 150));
    }

    setShowInstructions(false);
    setIsActivating(true);
    setError(null);
    
    console.log('[AR Start] State reset, starting AR activation...');

    const modelViewer = modelViewerRef.current;
    let checkInterval = null;
    let maxTimeout = null;
    let visibilityHandler = null;
    let arStatusHandler = null;
    let pageShowHandler = null; // For iOS page show event
    let pageHideHandler = null; // For iOS page hide event

    // Create cleanup function
    const cleanup = () => {
      if (checkInterval) clearInterval(checkInterval);
      if (maxTimeout) clearTimeout(maxTimeout);
      if (visibilityHandler) document.removeEventListener('visibilitychange', visibilityHandler);
      if (arStatusHandler && modelViewer) modelViewer.removeEventListener('ar-status', arStatusHandler);
      if (pageShowHandler) window.removeEventListener('pageshow', pageShowHandler);
      if (pageHideHandler) window.removeEventListener('pagehide', pageHideHandler);
      hideModelViewer();
    };

    // Store cleanup function
    cleanupRef.current = cleanup;

    try {
      // Listen for visibility change (when user switches away from AR)
      visibilityHandler = () => {
        console.log('[AR Visibility] State changed:', document.visibilityState);
        if (document.visibilityState === 'visible') {
          // On iOS, when returning from Quick Look, check if AR is done
          if (isIOS) {
            console.log('[AR iOS] Document visible, waiting to check AR state');
            setTimeout(() => {
              if (modelViewer && !modelViewer.modelIsVisible) {
                console.log('[AR iOS] AR not visible, cleaning up');
                cleanup();
              } else {
                console.log('[AR iOS] Model still visible or viewer not ready');
              }
            }, 300);
          } else {
            setTimeout(() => {
              if (modelViewer && !modelViewer.modelIsVisible) {
                console.log('[AR Android] AR not visible, cleaning up');
                cleanup();
              }
            }, 500);
          }
        }
      };
      document.addEventListener('visibilitychange', visibilityHandler);
      
      // iOS-specific: Listen for pageshow/pagehide events
      if (isIOS) {
        pageShowHandler = () => {
          console.log('[AR iOS] Page shown, checking if AR is still active');
          // When page becomes visible again (after Quick Look closes)
          setTimeout(() => {
            if (modelViewer && !modelViewer.modelIsVisible) {
              console.log('[AR iOS] Page shown and AR not visible, cleaning up');
              cleanup();
            }
          }, 200);
        };
        window.addEventListener('pageshow', pageShowHandler);

        pageHideHandler = () => {
          // Page is being hidden (Quick Look opening)
          console.log('[AR iOS] Page hiding (Quick Look opening)');
          // Don't cleanup here, just note it
        };
        window.addEventListener('pagehide', pageHideHandler);
      }
      
      // Listen for AR session end
      arStatusHandler = (event) => {
        const status = event.detail?.status;
        console.log('[AR Status] AR status event:', status);
        if (status === 'not-presenting' || status === 'failed' || status === 'session-ended') {
          console.log('[AR Status] AR session ended, cleaning up');
          cleanup();
        }
      };
      modelViewer.addEventListener('ar-status', arStatusHandler);
      
      // Fallback: Check periodically if AR is still active
      checkInterval = setInterval(() => {
        if (modelViewer) {
          // Check if AR is no longer active
          const isARActive = modelViewer.arActive || 
                           (modelViewer.canActivateAR && modelViewer.modelIsVisible);
          
          if (!isARActive && isActivating) {
            console.log('[AR Polling] AR inactive detected, cleaning up');
            cleanup();
          }
        }
      }, 1000); // Check every second
      
      // Cleanup after 5 minutes max
      maxTimeout = setTimeout(() => {
        cleanup();
      }, 300000); // 5 minutes
      
      // Make model-viewer visible for AR activation
      // Clear any previous inline styles and make it temporarily visible
      modelViewer.style.cssText = 'position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 9999; background: transparent; display: block; visibility: visible; opacity: 1;';
      console.log('[AR Activation] Model viewer made visible');
      
      // Wait for model to load if needed
      if (!modelViewer.loaded) {
        console.log('[AR Activation] Waiting for model to load...');
        await new Promise((resolve, reject) => {
          const timeout = setTimeout(() => reject(new Error('Model loading timeout. Please check your connection.')), 15000);
          const onLoad = () => {
            clearTimeout(timeout);
            modelViewer.removeEventListener('load', onLoad);
            console.log('[AR Activation] Model loaded successfully');
            resolve();
          };
          modelViewer.addEventListener('load', onLoad);
          if (modelViewer.loaded) {
            clearTimeout(timeout);
            console.log('[AR Activation] Model already loaded');
            resolve();
          }
        });
      } else {
        console.log('[AR Activation] Model already loaded');
      }

      // Wait a moment for everything to be ready
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Activate AR
      if (modelViewer && typeof modelViewer.activateAR === 'function') {
        console.log('[AR Activation] Calling activateAR() on model-viewer');
        await modelViewer.activateAR();
        console.log('[AR Activation] activateAR() completed - AR should now be visible');
        
        // For iOS, let Quick Look run independently
        // Our event listeners (pageshow, visibilitychange) will cleanup when user closes it
        // For Android, the cleanup happens via ar-status and polling
      } else {
        console.error('[AR Activation] activateAR function not available');
        cleanup();
        throw new Error('AR not available on this device or browser.');
      }
      
    } catch (err) {
      console.error('AR activation error:', err);
      setError(err.message || 'Failed to start AR. Please try again or use a different device.');
      cleanup();
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
            pointerEvents: 'none',
            zIndex: -9999
          }}
        />
      )}
    </>
  );
}
