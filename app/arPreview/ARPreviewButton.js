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

  // Force hide model-viewer when not activating
  useEffect(() => {
    if (!isActivating && modelViewerRef.current) {
      console.log('isActivating changed to false, forcing hide');
      modelViewerRef.current.style.cssText = 'display: none !important; position: fixed !important; top: -9999px !important; left: -9999px !important; width: 1px !important; height: 1px !important; visibility: hidden !important; opacity: 0 !important; pointer-events: none !important; z-index: -1 !important;';
    }
  }, [isActivating]);

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
    if (!modelViewerRef.current) {
      setError('AR not available. Please refresh the page and try again.');
      setShowInstructions(false);
      return;
    }

    setShowInstructions(false);
    setIsActivating(true);

    const modelViewer = modelViewerRef.current;

    try {
      // Hide model-viewer function
      const hideModelViewer = () => {
        console.log('Hiding model-viewer');
        if (modelViewerRef.current) {
          modelViewerRef.current.style.cssText = 'display: none !important; position: fixed !important; top: -9999px !important; left: -9999px !important; width: 1px !important; height: 1px !important; visibility: hidden !important; opacity: 0 !important; pointer-events: none !important; z-index: -1 !important;';
        }
        setIsActivating(false);
      };
      
      // Listen for visibility change (when user switches away from AR)
      const visibilityHandler = () => {
        if (document.visibilityState === 'visible' && isActivating) {
          console.log('Visibility changed, hiding model');
          setTimeout(hideModelViewer, 500);
        }
      };
      document.addEventListener('visibilitychange', visibilityHandler);
      
      // Listen for AR session end
      const arStatusHandler = (event) => {
        console.log('AR status:', event.detail.status);
        if (event.detail.status === 'not-presenting' || event.detail.status === 'failed') {
          hideModelViewer();
          document.removeEventListener('visibilitychange', visibilityHandler);
        }
      };
      modelViewer.addEventListener('ar-status', arStatusHandler);
      
      // Fallback: Check periodically if AR is still active
      const checkInterval = setInterval(() => {
        if (modelViewer.canActivateAR && !modelViewer.modelIsVisible) {
          console.log('AR inactive detected via polling');
          hideModelViewer();
          clearInterval(checkInterval);
          document.removeEventListener('visibilitychange', visibilityHandler);
        }
      }, 1000);
      
      // Cleanup after 5 minutes max
      const maxTimeout = setTimeout(() => {
        console.log('Max timeout reached, forcing cleanup');
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
        // AR activated - cleanup handlers are set up above
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
  }, [isActivating]);

  if (!isClient || !isMobile) {
    return null;
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
        className={className}
        disabled={isActivating}
      >
        {children}
      </button>

      {/* Hidden model-viewer - will be activated programmatically */}
      {/* Android: Scene Viewer (direct camera) | iOS: Quick Look (AR dialog) */}
      {isClient && (
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
