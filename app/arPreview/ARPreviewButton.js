'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Simple AR Preview Button for mobile devices
 * Uses model-viewer with WebXR only - opens camera directly (works on iOS and Android)
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
  const [showARViewer, setShowARViewer] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  // Start AR after instructions - WebXR only (like Android)
  const handleStartAR = useCallback(async () => {
    if (!modelViewerRef.current) {
      setError('AR not available. Please refresh the page and try again.');
      setShowInstructions(false);
      return;
    }

    setShowInstructions(false);
    setIsActivating(true);
    setIsLoading(true);

    try {
      const modelViewer = modelViewerRef.current;
      
      // Check WebXR support
      const hasWebXR = 'xr' in navigator;
      const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
      
      if (isIOS && !hasWebXR) {
        // iOS without WebXR - show model-viewer with AR button instead
        // User can tap AR button manually (this avoids Quick Look "Zero KB" issue)
        console.log('iOS detected without WebXR - showing model-viewer with AR button');
        setShowARViewer(true);
        setIsActivating(false);
        setIsLoading(false);
        return;
      }
      
      // Make model-viewer visible and fullscreen for WebXR
      // WebXR requires the element to be in the viewport
      const originalStyle = modelViewer.style.cssText;
      modelViewer.style.cssText = 'position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 9999; background: transparent; display: block;';
      
      // Wait for model to load if needed
      if (!modelViewer.loaded) {
        console.log('Waiting for model to load...');
        await new Promise((resolve, reject) => {
          const timeout = setTimeout(() => {
            modelViewer.removeEventListener('load', onLoad);
            reject(new Error('Model loading timeout - the file may be too large'));
          }, 15000); // 15 seconds for large models
          
          const onLoad = () => {
            clearTimeout(timeout);
            modelViewer.removeEventListener('load', onLoad);
            console.log('Model loaded successfully');
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

      // Force WebXR only - no Quick Look fallback
      modelViewer.setAttribute('ar-modes', 'webxr');
      console.log('Attempting to activate WebXR AR...');
      
      // Activate AR - WebXR should open camera directly (like Android)
      if (modelViewer && typeof modelViewer.activateAR === 'function') {
        await modelViewer.activateAR();
        console.log('AR activated - camera should be visible now');
        setIsLoading(false);
        // Don't reset isActivating - let AR session continue
      } else {
        throw new Error('AR not available. Please try a different browser or device.');
      }
    } catch (err) {
      console.error('AR activation error:', err);
      setIsLoading(false);
      
      // If WebXR fails on iOS, show model-viewer as fallback
      const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
      if (isIOS && err.message?.includes('webxr') || !('xr' in navigator)) {
        console.log('WebXR failed on iOS - showing model-viewer with AR button');
        setShowARViewer(true);
        setIsActivating(false);
        return;
      }
      
      setError(err.message || 'Failed to start AR. Please ensure you\'re using a browser that supports WebXR.');
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

      {/* Loading indicator */}
      {isLoading && (
        <div className="fixed inset-0 z-[1001] flex items-center justify-center bg-black/80 px-4">
          <div className="w-full max-w-xs rounded-lg bg-white p-6 text-center shadow-xl">
            <div className="mb-4">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#623183] border-t-transparent"></div>
            </div>
            <h2 className="mb-2 text-lg font-semibold text-gray-900">Loading AR...</h2>
            <p className="text-sm text-gray-600">Preparing 3D model and camera</p>
          </div>
        </div>
      )}

      {/* AR Viewer - shown when WebXR isn't available or as fallback */}
      {showARViewer && (
        <div className="fixed inset-0 z-[9999] bg-black">
          <div className="absolute top-4 left-4 z-[10000]">
            <button
              type="button"
              onClick={() => {
                setShowARViewer(false);
                setIsActivating(false);
                if (modelViewerRef.current) {
                  modelViewerRef.current.style.cssText = 'display: none;';
                }
              }}
              className="flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 shadow-lg"
            >
              <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="text-sm font-semibold text-gray-900">Back</span>
            </button>
          </div>
          <div className="absolute top-4 right-4 z-[10000]">
            <button
              type="button"
              onClick={() => {
                setShowARViewer(false);
                setIsActivating(false);
                if (modelViewerRef.current) {
                  modelViewerRef.current.style.cssText = 'display: none;';
                }
              }}
              className="rounded-full bg-white/90 p-2 shadow-lg"
            >
              <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="absolute bottom-20 left-4 right-4 z-[10000] bg-blue-500/90 text-white p-4 rounded-lg shadow-xl">
            <p className="font-semibold mb-1 text-base">📱 Tap the AR button (cube icon) on the model</p>
            <p className="text-sm opacity-90">This will open AR with your camera directly</p>
          </div>
          <model-viewer
            ref={modelViewerRef}
            src={modelSrc}
            poster={posterSrc}
            ar
            ar-modes="webxr"
            ar-placement={arPlacement}
            camera-controls
            style={{ width: '100vw', height: '100vh', display: 'block' }}
          />
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
      {/* WebXR only - no Quick Look to ensure camera opens directly */}
      {isClient && (
        <model-viewer
          ref={modelViewerRef}
          src={modelSrc}
          poster={posterSrc}
          ar
          ar-modes="webxr"
          ar-placement={arPlacement}
          camera-controls
          style={{ display: 'none', width: '100vw', height: '100vh' }}
        />
      )}
    </>
  );
}
