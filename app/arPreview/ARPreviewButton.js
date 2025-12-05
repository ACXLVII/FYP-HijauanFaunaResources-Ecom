'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Simple AR Preview Button for mobile devices
 * Uses model-viewer with WebXR (primary) and Quick Look (iOS fallback)
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

  // Load model-viewer web component
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    setIsClient(true);
    
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

    try {
      const modelViewer = modelViewerRef.current;
      
      // Make model-viewer visible and fullscreen for WebXR
      // WebXR requires the element to be in the viewport
      const originalStyle = modelViewer.style.cssText;
      modelViewer.style.cssText = 'position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 9999; background: transparent; display: block;';
      
      // Wait for model to load if needed
      if (!modelViewer.loaded) {
        await new Promise((resolve, reject) => {
          const timeout = setTimeout(() => reject(new Error('Model loading timeout')), 10000);
          const onLoad = () => {
            clearTimeout(timeout);
            modelViewer.removeEventListener('load', onLoad);
            resolve();
          };
          modelViewer.addEventListener('load', onLoad);
          if (modelViewer.loaded) {
            clearTimeout(timeout);
            modelViewer.removeEventListener('load', onLoad);
            resolve();
          }
        });
      }

      // Wait a moment for everything to be ready
      await new Promise(resolve => setTimeout(resolve, 500));

      // Activate AR - WebXR should open camera directly (like Android)
      if (modelViewer && typeof modelViewer.activateAR === 'function') {
        await modelViewer.activateAR();
        // AR activated - camera should show now (WebXR mode)
        // Don't reset isActivating - let AR session continue
      } else {
        throw new Error('AR not available. Please try a different browser or device.');
      }
    } catch (err) {
      console.error('AR activation error:', err);
      setError(err.message || 'Failed to start AR. Please ensure you\'re using a browser that supports WebXR (Safari 15+ or Chrome).');
      setIsActivating(false);
      // Restore original style on error
      if (modelViewerRef.current) {
        modelViewerRef.current.style.cssText = 'display: none;';
      }
    }
  }, []);

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
      {isClient && (
        <model-viewer
          ref={modelViewerRef}
          src={modelSrc}
          poster={posterSrc}
          ar
          ar-modes="webxr scene-viewer"
          ar-placement={arPlacement}
          camera-controls
          style={{ display: 'none', width: '100vw', height: '100vh' }}
        />
      )}
    </>
  );
}
