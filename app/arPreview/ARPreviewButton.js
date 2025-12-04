'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

/**
 * Mobile-only AR preview launcher built on top of <model-viewer>.
 * - Loads the web component lazily on the client.
 * - Requests camera permissions before attempting AR.
 * - Shows a dialog on denial and restores focus to the trigger button.
 * - Hides itself on non-mobile (desktop) devices.
 */
export default function ARPreviewButton({
  children,
  modelSrc,
  iosSrc,
  posterSrc,
  arModes = 'webxr scene-viewer quick-look',
  arPlacement = 'floor',
  className = '',
  onPermissionDenied,
  onPermissionGranted,
}) {
  const modelViewerRef = useRef(null);
  const buttonRef = useRef(null);
  const [isClient, setIsClient] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isActivating, setIsActivating] = useState(false);
  const [dialogState, setDialogState] = useState({ open: false, message: '', title: 'Camera Permission Needed' });
  const [showInstructions, setShowInstructions] = useState(false);

  const ensureModelViewer = useCallback(async () => {
    if (typeof window === 'undefined') return;
    if (window.customElements?.get('model-viewer')) {
      // Wait for custom element to be defined if it exists
      await window.customElements.whenDefined('model-viewer');
      return;
    }
    try {
      await import('@google/model-viewer');
      // Wait for custom element to be defined
      await window.customElements.whenDefined('model-viewer');
    } catch (error) {
      console.warn('Failed to load @google/model-viewer', error);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    setIsClient(true);
    ensureModelViewer().then(() => {
      // Preload the model when component mounts so it's ready when user clicks AR
      if (modelViewerRef.current && modelSrc) {
        // Ensure model-viewer has the src set and starts loading
        const modelViewer = modelViewerRef.current;
        if (!modelViewer.src && modelSrc) {
          modelViewer.src = modelSrc;
        }
      }
    });

    const mediaQuery = window.matchMedia('(max-width: 1024px)');
    const updateIsMobile = (eventOrMQ) => {
      const matches = typeof eventOrMQ.matches === 'boolean' ? eventOrMQ.matches : false;
      setIsMobile(matches);
    };

    updateIsMobile(mediaQuery);
    mediaQuery.addEventListener('change', updateIsMobile);

    return () => {
      mediaQuery.removeEventListener('change', updateIsMobile);
    };
  }, [ensureModelViewer, modelSrc]);

  const stopStreamTracks = useCallback((stream) => {
    if (!stream) return;
    stream.getTracks().forEach((track) => {
      try {
        track.stop();
      } catch (error) {
        console.warn('Failed to stop media track', error);
      }
    });
  }, []);

  const requestCameraPermission = useCallback(async () => {
    if (!navigator?.mediaDevices?.getUserMedia) {
      throw new Error('unsupported');
    }

    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stopStreamTracks(stream);
    } catch (error) {
      stopStreamTracks(stream);
      throw error;
    }
  }, [stopStreamTracks]);

  const handlePermissionDenied = useCallback(
    (error) => {
      let message = 'Camera access is required to use AR. Please enable it in your browser settings.';
      if (error?.name === 'NotAllowedError' || error?.name === 'NotFoundError') {
        message = 'Must enable camera access to launch AR. Please allow camera permission and try again.';
      } else if (error?.message === 'unsupported') {
        message = 'AR preview is not supported on this device or browser.';
      }

      setDialogState({ open: true, message, title: 'Camera Permission Needed' });

      if (typeof onPermissionDenied === 'function') {
        onPermissionDenied(error);
      }
    },
    [onPermissionDenied],
  );

  const handleARActivationError = useCallback(
    (error) => {
      let message = 'Unable to start AR preview. Please try again.';
      if (error?.message?.includes('Model-viewer not ready')) {
        message = 'AR is still loading. Please wait a moment and try again.';
      } else if (error?.message?.includes('Model loading timeout')) {
        message = 'The 3D model is taking too long to load. Please check your connection and try again.';
      } else if (error?.message?.includes('AR activation failed')) {
        message = 'AR preview could not be started. Your device or browser may not support AR, or the model file may be missing.';
      } else if (error?.message === 'unsupported' || error?.message?.includes('not supported')) {
        message = 'AR preview is not supported on this device or browser.';
      }

      setDialogState({ open: true, message, title: 'AR Preview Error' });

      if (typeof onPermissionDenied === 'function') {
        onPermissionDenied(error);
      }
    },
    [onPermissionDenied],
  );

  const activateAR = useCallback(async () => {
    if (!modelViewerRef.current) {
      throw new Error('Model viewer not available');
    }

    // Wait for model-viewer to be fully loaded
    const modelViewer = modelViewerRef.current;
    
    // Ensure model-viewer web component is defined
    await ensureModelViewer();
    
    // Small delay to ensure element is ready
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Check if model-viewer is ready
    if (typeof modelViewer.activateAR !== 'function') {
      // Wait for the model-viewer to be defined (with timeout)
      await new Promise((resolve, reject) => {
        let attempts = 0;
        const maxAttempts = 50; // 5 seconds max
        const checkReady = () => {
          attempts++;
          if (modelViewer.activateAR && typeof modelViewer.activateAR === 'function') {
            resolve();
          } else if (attempts >= maxAttempts) {
            reject(new Error('Model-viewer not ready'));
          } else {
            setTimeout(checkReady, 100);
          }
        };
        checkReady();
      });
    }

    // Ensure model source is set
    if (!modelViewer.src && !modelViewer.getAttribute('src')) {
      throw new Error('Model source not set');
    }

    // Make model-viewer visible and fullscreen for WebXR AR activation
    // WebXR requires the element to be visible and in the viewport
    const originalStyle = modelViewer.style.cssText;
    // Make it fullscreen and visible for WebXR to work properly
    modelViewer.style.cssText = 'position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 9999; background: #000;';

    // Wait for the model to load if it hasn't already
    // Check if model is already loaded
    const isModelLoaded = modelViewer.loaded === true || 
                          (modelViewer.hasAttribute && modelViewer.hasAttribute('loaded')) ||
                          (modelViewer.shadowRoot && modelViewer.shadowRoot.querySelector('canvas'));
    
    if (!isModelLoaded) {
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          modelViewer.removeEventListener('load', onLoad);
          modelViewer.removeEventListener('model-loaded', onLoad);
          modelViewer.style.cssText = originalStyle;
          reject(new Error('Model loading timeout'));
        }, 15000); // 15 second timeout

        const onLoad = () => {
          clearTimeout(timeout);
          modelViewer.removeEventListener('load', onLoad);
          modelViewer.removeEventListener('model-loaded', onLoad);
          resolve();
        };

        // Listen for both 'load' and 'model-loaded' events
        modelViewer.addEventListener('load', onLoad);
        modelViewer.addEventListener('model-loaded', onLoad);
        
        // Check again if it loaded while we were setting up listeners
        if (modelViewer.loaded === true) {
          clearTimeout(timeout);
          modelViewer.removeEventListener('load', onLoad);
          modelViewer.removeEventListener('model-loaded', onLoad);
          resolve();
        }
      });
    }

    // Small delay before activating AR to ensure everything is ready
    await new Promise(resolve => setTimeout(resolve, 300));

    // Now activate AR - WebXR should open the camera/AR view directly in browser
    try {
      // Set up event listener to restore style when AR session ends
      const restoreOnExit = () => {
        modelViewer.style.cssText = originalStyle;
        modelViewer.removeEventListener('ar-status', restoreOnExit);
      };
      modelViewer.addEventListener('ar-status', (e) => {
        if (e.detail.status === 'not-presenting') {
          restoreOnExit();
        }
      });

      // For WebXR, the model-viewer needs to be visible and fullscreen
      // It will handle the fullscreen AR experience and show the camera
      await modelViewer.activateAR();
      
      // If WebXR is active, the model-viewer will show the camera view
      // The style will be restored when AR session ends via the event listener
    } catch (error) {
      // Restore original style on error
      modelViewer.style.cssText = originalStyle;
      console.error('AR activation error:', error);
      
      // Check if it's a WebXR-specific error
      if (error.message && error.message.includes('webxr')) {
        throw new Error(`WebXR AR is not supported on this device. Please try a different browser or device.`);
      }
      
      // Re-throw with a more specific error
      throw new Error(`AR activation failed: ${error.message || 'Unknown error'}`);
    }
  }, [ensureModelViewer]);

  const handleClick = useCallback(async () => {
    if (!isClient || !isMobile || isActivating) {
      return;
    }

    setIsActivating(true);
    try {
      await requestCameraPermission();
      if (typeof onPermissionGranted === 'function') {
        onPermissionGranted();
      }
      // Show instructions before activating AR
      setShowInstructions(true);
    } catch (error) {
      handlePermissionDenied(error);
      setIsActivating(false);
    }
  }, [handlePermissionDenied, isActivating, isClient, isMobile, onPermissionGranted, requestCameraPermission]);

  const handleStartAR = useCallback(async () => {
    setShowInstructions(false);
    // Don't set isActivating to false immediately - let AR open
    // If it fails, we'll handle it in the catch block
    try {
      await activateAR();
      // If AR activation succeeds, the AR view should be open now
      // Don't reset isActivating here as AR might have navigated away
    } catch (error) {
      console.error('Failed to start AR:', error);
      // Use different error handler for AR activation errors
      handleARActivationError(error);
      setIsActivating(false);
    }
  }, [activateAR, handleARActivationError]);

  const sharedAttributes = useMemo(
    () => ({
      src: modelSrc,
      'ios-src': iosSrc,
      ...(posterSrc ? { poster: posterSrc } : {}),
      ar: true,
      'ar-modes': arModes,
      'ar-placement': arPlacement,
      'camera-controls': true,
      'auto-rotate': true,
    }),
    [arModes, arPlacement, iosSrc, modelSrc, posterSrc],
  );

  if (!isClient || !isMobile) {
    return null;
  }

  return (
    <>
      {dialogState.open && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-xs rounded-lg bg-white p-6 text-center shadow-xl">
            <h2 className="mb-2 text-lg font-semibold text-gray-900">
              {dialogState.title || 'Camera Permission Needed'}
            </h2>
            <p className="mb-6 text-sm text-gray-700">
              {dialogState.message}
            </p>
            <button
              type="button"
              className="w-full rounded-md bg-[#623183] px-4 py-2 text-sm font-semibold text-white shadow hover:bg-[#4e2667] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4e2667]/70"
              onClick={() => {
                setDialogState({ open: false, message: '', title: 'Camera Permission Needed' });
                if (buttonRef.current) {
                  buttonRef.current.focus({ preventScroll: true });
                  buttonRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
              }}
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {showInstructions && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-sm rounded-lg bg-white p-6 text-center shadow-xl">
            <h2 className="mb-3 text-lg font-semibold text-gray-900">
              AR Preview Instructions
            </h2>
            <div className="mb-6 space-y-2 text-left text-sm text-gray-700">
              <p className="flex items-start gap-2">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#623183] text-xs font-semibold text-white">
                  1
                </span>
                <span>Point your camera at the dirt or bare soil area where you want to see the grass.</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#623183] text-xs font-semibold text-white">
                  2
                </span>
                <span>Wait for the surface detection to complete (you'll see tracking indicators).</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#623183] text-xs font-semibold text-white">
                  3
                </span>
                <span><strong>Tap on the dirt area</strong> to place the grass model there.</span>
              </p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 shadow hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400/70"
                onClick={() => {
                  setShowInstructions(false);
                  setIsActivating(false);
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="flex-1 rounded-md bg-[#623183] px-4 py-2 text-sm font-semibold text-white shadow hover:bg-[#4e2667] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4e2667]/70"
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
        disabled={!isClient || !isMobile || isActivating}
        ref={buttonRef}
      >
        {children}
      </button>

      {/* Render the model-viewer element only on the client to avoid SSR mismatch. */}
      {/* Initially hidden, will be made visible when AR is activated for WebXR */}
      <model-viewer
        ref={modelViewerRef}
        style={{ display: 'none', width: '100vw', height: '100vh' }}
        {...sharedAttributes}
      />
    </>
  );
}


