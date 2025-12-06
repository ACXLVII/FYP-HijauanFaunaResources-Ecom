'use client';

import React, { useEffect, useState } from 'react';

/**
 * Simple AR Preview Button - Clean Rebuild
 * iOS: Direct Quick Look link (no model-viewer needed)
 * Android: model-viewer with Scene Viewer
 */
export default function ARPreviewButton({
  children,
  modelSrc,
  iosSrc,
  arPlacement = 'floor',
  className = '',
}) {
  const [isClient, setIsClient] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    setIsClient(true);
    setIsIOS(/iPhone|iPad|iPod/i.test(navigator.userAgent));
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 1024 || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Load model-viewer only for Android
    if (!/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      const script = document.createElement('script');
      script.type = 'module';
      script.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/3.3.0/model-viewer.min.js';
      document.head.appendChild(script);
    }

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleClick = () => {
    if (!isClient || !isMobile) return;
    
    // Show instructions first
    setShowInstructions(true);
  };

  const handleStartAR = () => {
    setShowInstructions(false);

    console.log('AR Click - iOS:', isIOS, 'iosSrc:', iosSrc);

    // iOS: Use direct anchor link to USDZ
    if (isIOS && iosSrc) {
      console.log('iOS path: Creating direct Quick Look link');
      const anchor = document.createElement('a');
      anchor.rel = 'ar';
      anchor.href = iosSrc;
      document.body.appendChild(anchor);
      anchor.click();
      setTimeout(() => document.body.removeChild(anchor), 100);
      return;
    }

    console.log('Android path: Creating model-viewer');
    // Android: Use model-viewer (will be added dynamically)
    const existingViewer = document.querySelector('#temp-ar-viewer');
    if (existingViewer) {
      console.log('Removing existing viewer');
      existingViewer.remove();
    }

    const viewer = document.createElement('model-viewer');
    viewer.id = 'temp-ar-viewer';
    viewer.setAttribute('src', modelSrc);
    viewer.setAttribute('ar', '');
    viewer.setAttribute('ar-modes', 'scene-viewer');
    viewer.setAttribute('ar-placement', arPlacement);
    viewer.style.cssText = 'position: fixed; width: 1px; height: 1px; top: -9999px; left: -9999px; opacity: 0; pointer-events: none;';
    
    document.body.appendChild(viewer);

    // Wait for model-viewer to load, then activate AR
    setTimeout(() => {
      if (viewer.activateAR) {
        viewer.activateAR().catch(() => {
          viewer.remove();
        });
      }
      
      // Cleanup after AR session ends
      const cleanup = () => {
        setTimeout(() => viewer.remove(), 1000);
      };
      
      viewer.addEventListener('ar-status', (event) => {
        if (event.detail.status === 'not-presenting') cleanup();
      });
      
      document.addEventListener('visibilitychange', () => {
        if (!document.hidden) cleanup();
      }, { once: true });
    }, 1000);
  };

  if (!isClient || !isMobile) {
    return null;
  }

  return (
    <>
      <button
        onClick={handleClick}
        className={`flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 ${className}`}
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
        {children}
      </button>

      {/* Instructions Modal */}
      {showInstructions && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              AR Preview Instructions
            </h3>
            <div className="space-y-3 text-gray-700 mb-6">
              <p className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">1.</span>
                <span>Allow camera access when prompted</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">2.</span>
                <span>Point your camera at a flat surface (floor/ground)</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">3.</span>
                <span>Move your device slowly to help detect the surface</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">4.</span>
                <span>Tap to place and drag to move the grass model</span>
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowInstructions(false)}
                className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleStartAR}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-semibold rounded-lg transition-all"
              >
                Start AR
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
