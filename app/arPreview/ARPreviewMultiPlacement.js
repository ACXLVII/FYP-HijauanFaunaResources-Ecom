'use client';

import React, { useEffect, useState, useRef } from 'react';

/**
 * Fast AR Preview - Optimized for Speed
 * - iOS: Native <a rel="ar"> for instant Quick Look
 * - Android: model-viewer with Scene Viewer
 * - Proper grass scaling for realistic size
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

  // Fast initialization - no delays
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    setIsClient(true);
    
    // Detect iOS
    const isIOSDevice = /iPhone|iPad|iPod/i.test(navigator.userAgent) || 
                        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    setIsIOS(isIOSDevice);
    
    // Detect mobile
    const isMobileDevice = window.innerWidth <= 1024 || 
                           /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    setIsMobile(isMobileDevice);

    // Load model-viewer ONLY for Android (skip for iOS for speed)
    if (!isIOSDevice && isMobileDevice) {
      const loadModelViewer = async () => {
        if (window.customElements?.get('model-viewer')) return;
        try {
          await import('@google/model-viewer');
        } catch (err) {
          console.error('Failed to load model-viewer:', err);
        }
      };
      loadModelViewer();
    }
  }, []);

  // Android: Direct AR activation - NO delays
  const handleAndroidARClick = () => {
    if (!modelViewerRef.current) return;
    
    const viewer = modelViewerRef.current;
    if (viewer && typeof viewer.activateAR === 'function') {
      // Instant activation - no waiting
      viewer.activateAR().catch(err => {
        console.error('AR failed:', err);
      });
    }
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

  // iOS: Use model-viewer like Android (to fix texture issue)
  // Native Quick Look has single-sided rendering issues with USDZ files
  return (
    <>
      {/* AR Button */}
      <div className={className} onClick={handleAndroidARClick}>
        {children}
      </div>

      {/* Model Viewer - Works for both iOS and Android */}
      {isClient && (
        <model-viewer
          ref={modelViewerRef}
          src={modelSrc}
          ios-src={iosSrc}
          ar
          ar-modes="scene-viewer webxr quick-look"
          ar-placement="floor"
          ar-scale="fixed"
          scale="0.35 0.35 0.35"
          camera-controls
          loading="eager"
          interaction-prompt="none"
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
