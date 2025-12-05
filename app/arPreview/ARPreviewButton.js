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

  // Request camera permission and activate AR
  const handleClick = useCallback(async () => {
    if (!isClient || !isMobile || isActivating || !modelViewerRef.current) return;

    setIsActivating(true);
    setError(null);

    try {
      // Request camera permission first
      if (navigator.mediaDevices?.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        // Stop the stream immediately - we just needed permission
        stream.getTracks().forEach(track => track.stop());
      }

      // Wait a moment for model-viewer to be ready
      await new Promise(resolve => setTimeout(resolve, 200));

      // Activate AR
      const modelViewer = modelViewerRef.current;
      if (modelViewer && typeof modelViewer.activateAR === 'function') {
        await modelViewer.activateAR();
      } else {
        throw new Error('AR not available. Please try a different browser or device.');
      }
    } catch (err) {
      console.error('AR activation error:', err);
      setError(err.message || 'Failed to start AR. Please ensure camera permission is granted.');
      setIsActivating(false);
    }
  }, [isClient, isMobile, isActivating]);

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
          ios-src={iosSrc ? `/api/models${iosSrc}` : undefined}
          poster={posterSrc}
          ar
          ar-modes="webxr quick-look scene-viewer"
          ar-placement={arPlacement}
          camera-controls
          style={{ display: 'none' }}
        />
      )}
    </>
  );
}
