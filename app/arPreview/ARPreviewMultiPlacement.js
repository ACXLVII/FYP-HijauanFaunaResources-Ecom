'use client';

import React, { useEffect, useState, useRef } from 'react';

/**
 * AR Preview - Fresh, Fast Implementation
 * - iOS: Uses native <a rel="ar"> for Quick Look
 * - Android: Uses model-viewer for Scene Viewer
 * - Floor placement with exact square shape
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

  // Initialize client-side detection and load model-viewer
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    setIsClient(true);
    
    // Detect iOS devices
    const userAgentCheck = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    const iPadOSCheck = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
    const isIOSDevice = userAgentCheck || iPadOSCheck;
    setIsIOS(isIOSDevice);
    
    // Detect mobile devices
    const checkMobile = () => {
      const isMobileDevice = window.innerWidth <= 1024 || 
                             /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      setIsMobile(isMobileDevice);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Load model-viewer library for Android
    if (!isIOSDevice) {
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

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Android AR activation (model-viewer)
  const handleAndroidARClick = () => {
    if (!modelViewerRef.current) {
      console.error('Model viewer not ready');
      return;
    }
    
    console.log('Android AR clicked - activating...');
    
    const viewer = modelViewerRef.current;
    if (viewer && typeof viewer.activateAR === 'function') {
      viewer.activateAR().catch(err => {
        console.error('AR activation failed:', err);
      });
    } else {
      console.error('activateAR not available');
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

  // iOS: Use native <a rel="ar"> for Quick Look
  if (isIOS && iosSrc) {
    return (
      <a
        href={iosSrc}
        rel="ar"
        className={className}
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        <img 
          src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
          alt="AR Preview"
          style={{ display: 'none' }}
        />
        {children}
      </a>
    );
  }

  // Android: Use model-viewer
  return (
    <>
      {/* AR Button - Click to activate (Android) */}
      <div className={className} onClick={handleAndroidARClick}>
        {children}
      </div>

      {/* Model Viewer - Hidden but ready for AR (Android only) */}
      {isClient && !isIOS && (
        <model-viewer
          ref={modelViewerRef}
          src={modelSrc}
          ar
          ar-modes="webxr scene-viewer"
          ar-placement="floor"
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
