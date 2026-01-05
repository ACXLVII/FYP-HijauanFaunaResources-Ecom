'use client';

import React, { useEffect, useState, useRef } from 'react';

/**
 * AR Preview - Fresh, Fast Implementation
 * - Floor placement with exact square shape
 * - Optimized for quick loading
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

    // Load model-viewer library
    const loadModelViewer = async () => {
      if (window.customElements?.get('model-viewer')) return;
      try {
        await import('@google/model-viewer');
      } catch (err) {
        console.error('Failed to load model-viewer:', err);
      }
    };
    loadModelViewer();

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Simple AR activation - just trigger it directly
  const handleARClick = () => {
    if (!modelViewerRef.current) return;
    
    console.log('AR clicked - activating...');
    
    // Directly activate AR - model-viewer handles everything
    const viewer = modelViewerRef.current;
    if (viewer && typeof viewer.activateAR === 'function') {
      viewer.activateAR();
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

  return (
    <>
      {/* AR Button - Click to activate */}
      <div className={className} onClick={handleARClick}>
        {children}
      </div>

      {/* Model Viewer - Hidden but ready for AR */}
      {isClient && (
        <model-viewer
          ref={modelViewerRef}
          src={modelSrc}
          ios-src={iosSrc}
          ar
          ar-modes="webxr scene-viewer quick-look"
          ar-placement="floor"
          ar-scale="fixed"
          bounds="tight"
          loading="eager"
          reveal="interaction"
          style={{ 
            display: 'none',
            position: 'fixed',
            top: '-9999px',
            left: '-9999px',
            width: '1px',
            height: '1px'
          }}
        >
          {/* Square slot for defining exact square shape */}
          <div slot="ar-slot">
            <div style={{
              width: '1m',
              height: '1m',
              transform: 'translate(-50%, -50%)'
            }} />
          </div>
        </model-viewer>
      )}
    </>
  );
}
