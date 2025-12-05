'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

/**
 * AR Preview Button for mobile devices
 * - Android: Uses Scene Viewer (direct camera access)
 * - iOS: Uses Quick Look (shows "Open 3D model" dialog - this is unavoidable on iOS)
 */
export default function ARPreviewButton({
  children,
  modelSrc,
  iosSrc,
  posterSrc,
  arPlacement = 'floor',
  className = '',
}) {
  const modelViewerRef = useRef(null);
  const [isClient, setIsClient] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isActivating, setIsActivating] = useState(false);
  const [error, setError] = useState(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showCloseButton, setShowCloseButton] = useState(false);
  const [renderModelViewer, setRenderModelViewer] = useState(false);

  // Load model-viewer web component
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    setIsClient(true);
    
    // Detect iOS
    setIsIOS(/iPhone|iPad|iPod/i.test(navigator.userAgent));
    
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 1024 || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
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

  // Remove model-viewer from DOM when not activating
  useEffect(() => {
    if (!isActivating) {
      console.log('isActivating changed to false, removing model-viewer');
      setShowCloseButton(false);
      setTimeout(() => {
        setRenderModelViewer(false);
      }, 100);
    }
  }, [isActivating]);

  // Manual close function
  const handleManualClose = useCallback(() => {
    console.log('Manual close triggered');
    setIsActivating(false);
    setShowCloseButton(false);
    // Remove model-viewer from DOM after a brief delay
    setTimeout(() => {
      setRenderModelViewer(false);
    }, 100);
  }, []);

  // Request camera permission
  const handleClick = useCallback(async () => {
    if (!isClient || !isMobile || isActivating) return;

    setIsActivating(true);
    setError(null);

    try {
      // Request camera permission first
      if (navigator.mediaDevices?.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        // Stop the stream immediately - we just needed permission
        stream.getTracks().forEach(track => track.stop());
      }
      
      // Show instructions
      setShowInstructions(true);
      setIsActivating(false);
    } catch (err) {
      console.error('Camera permission error:', err);
      setError('Camera permission is required for AR. Please allow camera access and try again.');
      setIsActivating(false);
    }
  }, [isClient, isMobile, isActivating]);

  // Start AR after instructions
  const handleStartAR = useCallback(async () => {
    setShowInstructions(false);
    setIsActivating(true);
    
    // Mount model-viewer first
    setRenderModelViewer(true);
    
    // Wait for model-viewer to mount
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (!modelViewerRef.current) {
      setError('AR not available. Please refresh the page and try again.');
      setIsActivating(false);
      setRenderModelViewer(false);
      return;
    }

    const modelViewer = modelViewerRef.current;

    try {
      // Hide model-viewer function
      const hideModelViewer = () => {
        console.log('Hiding and removing model-viewer from DOM');
        setIsActivating(false);
        setShowCloseButton(false);
        // Remove from DOM completely
        setTimeout(() => {
          setRenderModelViewer(false);
        }, 100);
      };
      
      // Listen for visibility change (when user switches away from AR)
      const visibilityHandler = () => {
        if (document.visibilityState === 'visible') {
          console.log('Visibility changed, hiding model');
          setTimeout(hideModelViewer, 500);
        }
      };
      document.addEventListener('visibilitychange', visibilityHandler);
      
      // Listen for page focus/blur (additional cleanup trigger)
      const focusHandler = () => {
        console.log('Window focused, checking AR state');
        setTimeout(hideModelViewer, 500);
      };
      window.addEventListener('focus', focusHandler);
      
      // Also cleanup on page hide
      const pageHideHandler = () => {
        console.log('Page hide detected');
        hideModelViewer();
      };
      window.addEventListener('pagehide', pageHideHandler);
      
      // Listen for AR session end
      const arStatusHandler = (event) => {
        console.log('AR status:', event.detail.status);
        if (event.detail.status === 'not-presenting' || event.detail.status === 'failed') {
          hideModelViewer();
          document.removeEventListener('visibilitychange', visibilityHandler);
          window.removeEventListener('focus', focusHandler);
          window.removeEventListener('pagehide', pageHideHandler);
          clearInterval(checkInterval);
          clearTimeout(maxTimeout);
        }
      };
      modelViewer.addEventListener('ar-status', arStatusHandler);
      
      // Quick Look dialog cancellation handler (iOS)
      modelViewer.addEventListener('error', (e) => {
        console.log('Model viewer error or cancellation:', e);
        hideModelViewer();
      }, { once: true });
      
      // Fallback: Check periodically if AR is still active
      const checkInterval = setInterval(() => {
        if (modelViewer.canActivateAR && !modelViewer.modelIsVisible) {
          console.log('AR inactive detected via polling');
          hideModelViewer();
          clearInterval(checkInterval);
          document.removeEventListener('visibilitychange', visibilityHandler);
          window.removeEventListener('focus', focusHandler);
          window.removeEventListener('pagehide', pageHideHandler);
          clearTimeout(maxTimeout);
        }
      }, 1000);
      
      // Cleanup after 5 minutes max
      const maxTimeout = setTimeout(() => {
        console.log('Max timeout reached, forcing cleanup');
        hideModelViewer();
        clearInterval(checkInterval);
        document.removeEventListener('visibilitychange', visibilityHandler);
        window.removeEventListener('focus', focusHandler);
        window.removeEventListener('pagehide', pageHideHandler);
      }, 300000); // 5 minutes
      
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
      
      // Make model-viewer visible just before activating AR
      modelViewer.style.cssText = 'position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 9999; background: transparent; display: block;';
      
      // Activate AR
      if (modelViewer && typeof modelViewer.activateAR === 'function') {
        await modelViewer.activateAR();
        // AR activated - show close button immediately
        setShowCloseButton(true);
        // Cleanup handlers are set up above
      } else {
        clearInterval(checkInterval);
        clearTimeout(maxTimeout);
        document.removeEventListener('visibilitychange', visibilityHandler);
        window.removeEventListener('focus', focusHandler);
        window.removeEventListener('pagehide', pageHideHandler);
        throw new Error('AR not available on this device or browser.');
      }
      
    } catch (err) {
      console.error('AR activation error:', err);
      setError(err.message || 'Failed to start AR. Please try again or use a different device.');
      setIsActivating(false);
      setShowCloseButton(false);
      // Remove model-viewer from DOM
      setTimeout(() => {
        setRenderModelViewer(false);
      }, 100);
    }
  }, [isActivating]);

  if (!isClient || !isMobile) {
    return null;
  }

  return (
    <>
      {/* Fullscreen Overlay - blocks website interaction during AR */}
      {isActivating && (
        <div className="fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm" />
      )}

      {/* Close Button Overlay - appears after AR is activated */}
      {showCloseButton && (
        <div className="fixed inset-0 z-[10000] flex items-start justify-center pt-4 px-4 pointer-events-none">
          <button
            type="button"
            onClick={handleManualClose}
            className="pointer-events-auto bg-red-600 text-white px-6 py-3 rounded-full shadow-2xl font-bold text-lg flex items-center gap-2 animate-pulse"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Close AR
          </button>
        </div>
      )}

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

      {showInstructions && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-sm rounded-lg bg-white p-6 text-center shadow-xl">
            <h2 className="mb-3 text-lg font-semibold text-gray-900">AR Preview Instructions</h2>
            <div className="mb-6 space-y-2 text-left text-sm text-gray-700">
              {isIOS ? (
                <>
                  <p className="flex items-start gap-2">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#623183] text-xs font-semibold text-white">1</span>
                    <span>Tap <strong>"Open this 3D model"</strong> when the dialog appears.</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#623183] text-xs font-semibold text-white">2</span>
                    <span>Point your camera at a flat surface (floor or table).</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#623183] text-xs font-semibold text-white">3</span>
                    <span><strong>Tap on the surface</strong> to place the grass model.</span>
                  </p>
                </>
              ) : (
                <>
                  <p className="flex items-start gap-2">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#623183] text-xs font-semibold text-white">1</span>
                    <span>Point your camera at a flat surface (floor or table).</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#623183] text-xs font-semibold text-white">2</span>
                    <span>Wait for surface detection (you'll see tracking indicators).</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#623183] text-xs font-semibold text-white">3</span>
                    <span><strong>Tap on the surface</strong> to place the grass model.</span>
                  </p>
                </>
              )}
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 shadow hover:bg-gray-50"
                onClick={() => {
                  setShowInstructions(false);
                  setIsActivating(false);
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="flex-1 rounded-md bg-[#623183] px-4 py-2 text-sm font-semibold text-white shadow hover:bg-[#4e2667]"
                onClick={handleStartAR}
              >
                Start AR
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={handleClick}
        className={`${className} ${isActivating ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={isActivating}
      >
        {isActivating ? (
          <div className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>AR Active...</span>
          </div>
        ) : children}
      </button>

      {/* Model-viewer - only rendered when AR is active */}
      {/* Completely removed from DOM when not in use to prevent blocking */}
      {isClient && renderModelViewer && (
        <model-viewer
          ref={modelViewerRef}
          src={modelSrc}
          ios-src={iosSrc}
          poster={posterSrc}
          ar
          ar-modes="scene-viewer quick-look"
          ar-placement={arPlacement}
          camera-controls
          loading="eager"
          style={{ 
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
