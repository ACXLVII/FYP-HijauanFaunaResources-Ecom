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
  const [isIOS, setIsIOS] = useState(false);
  const [isActivating, setIsActivating] = useState(false);
  const [dialogState, setDialogState] = useState({ open: false, message: '', title: 'Camera Permission Needed' });
  const [showInstructions, setShowInstructions] = useState(false);
  const [showARViewer, setShowARViewer] = useState(false);
  const [debugLogs, setDebugLogs] = useState([]);
  const [showDebugPanel, setShowDebugPanel] = useState(false);
  const [isARLoading, setIsARLoading] = useState(false);

  // Debug logging function
  const addDebugLog = useCallback((message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = { timestamp, message, type };
    setDebugLogs(prev => [...prev.slice(-19), logEntry]); // Keep last 20 logs
    console.log(`[AR Debug ${timestamp}]`, message);
  }, []);

  const ensureModelViewer = useCallback(async () => {
    if (typeof window === 'undefined') return;
    if (window.customElements?.get('model-viewer')) {
      // Wait for custom element to be defined if it exists
      await window.customElements.whenDefined('model-viewer');
      addDebugLog('Model-viewer already loaded', 'success');
      return;
    }
    try {
      await import('@google/model-viewer');
      // Wait for custom element to be defined
      await window.customElements.whenDefined('model-viewer');
      addDebugLog('Model-viewer loaded successfully', 'success');
    } catch (error) {
      addDebugLog(`Failed to load model-viewer: ${error.message}`, 'error');
      console.warn('Failed to load @google/model-viewer', error);
    }
  }, [addDebugLog]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    setIsClient(true);
    
    // Detect iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                       (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    setIsIOS(isIOSDevice);

    ensureModelViewer().then(() => {
      // Preload the model when component mounts so it's ready when user clicks AR
      if (modelViewerRef.current && modelSrc) {
        // Ensure model-viewer has the src set and starts loading
        const modelViewer = modelViewerRef.current;
        if (!modelViewer.src && modelSrc) {
          modelViewer.src = modelSrc;
        }
        // For iOS, also ensure USDZ is set
        if (isIOSDevice && iosSrc && !modelViewer.getAttribute('ios-src')) {
          modelViewer.setAttribute('ios-src', iosSrc);
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
  }, [ensureModelViewer, modelSrc, iosSrc]);

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
    addDebugLog('Starting AR activation...', 'info');
    
    if (!modelViewerRef.current) {
      addDebugLog('ERROR: Model viewer not available', 'error');
      throw new Error('Model viewer not available');
    }

    // Wait for model-viewer to be fully loaded
    const modelViewer = modelViewerRef.current;
    addDebugLog('Model-viewer element found', 'success');
    
    // Ensure model-viewer web component is defined
    await ensureModelViewer();
    
    // Small delay to ensure element is ready
    await new Promise(resolve => setTimeout(resolve, 100));
    addDebugLog('Element ready check complete', 'info');
    
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

    // For iOS, ensure USDZ is set and verify it loads
    if (isIOS && iosSrc) {
      // Make sure the model-viewer is in the DOM before setting attributes
      if (modelViewer.parentNode === null) {
        document.body.appendChild(modelViewer);
      }
      
      // Ensure ios-src is an absolute URL (required for Quick Look)
      // Use API route to serve USDZ with proper headers (fixes "Zero KB" issue)
      let absoluteIosSrc = iosSrc;
      if (!iosSrc.startsWith('http')) {
        // Convert /models/... to /api/models/models/... to use API route with proper headers
        // The API route expects the full path including 'models/'
        if (iosSrc.startsWith('/models/')) {
          absoluteIosSrc = `${window.location.origin}/api/models${iosSrc}`;
        } else {
          absoluteIosSrc = `${window.location.origin}${iosSrc.startsWith('/') ? '' : '/'}${iosSrc}`;
        }
        addDebugLog(`Using API route for USDZ: ${absoluteIosSrc}`, 'info');
      }
      
      addDebugLog(`Setting iOS USDZ source: ${absoluteIosSrc}`, 'info');
      console.log('Setting iOS USDZ source:', absoluteIosSrc);
      
      // Set ios-src attribute - this must be done before activation
      const currentIosSrc = modelViewer.getAttribute('ios-src');
      if (currentIosSrc !== absoluteIosSrc) {
        modelViewer.setAttribute('ios-src', absoluteIosSrc);
      }
      
      // Verify USDZ file exists and is accessible with proper headers
      try {
        // Try GET instead of HEAD to ensure file is fully accessible
        const response = await fetch(absoluteIosSrc, { 
          method: 'GET',
          headers: {
            'Accept': 'model/vnd.usdz+zip, application/octet-stream, */*'
          }
        });
        
        if (!response.ok) {
          const errorMsg = `USDZ file not accessible: ${response.status} ${response.statusText}`;
          addDebugLog(errorMsg, 'error');
          console.error('USDZ file not accessible:', absoluteIosSrc, 'Status:', response.status);
          throw new Error(`USDZ file not accessible: ${response.status}`);
        } else {
          const contentType = response.headers.get('content-type');
          const contentLength = response.headers.get('content-length');
          const fileSize = contentLength ? `${(parseInt(contentLength) / 1024).toFixed(2)} KB` : 'unknown';
          
          // Check if we actually got data
          const blob = await response.blob();
          const actualSize = blob.size;
          const actualSizeKB = `${(actualSize / 1024).toFixed(2)} KB`;
          
          addDebugLog(`USDZ verified: ${actualSizeKB} (${contentType || 'no type'})`, 'success');
          console.log('USDZ file verified:', {
            url: absoluteIosSrc,
            contentType,
            headerSize: fileSize,
            actualSize: actualSizeKB
          });
          
          if (actualSize === 0) {
            const errorMsg = 'USDZ file is empty (0 bytes) - file may not be served correctly';
            addDebugLog(errorMsg, 'error');
            throw new Error(errorMsg);
          }
          
          // Check if content-type is correct for USDZ
          if (contentType && !contentType.includes('usdz') && !contentType.includes('octet-stream') && !contentType.includes('zip')) {
            addDebugLog(`WARNING: Unexpected content-type: ${contentType}. Expected: model/vnd.usdz+zip`, 'error');
            addDebugLog('This may cause Quick Look to show "Zero KB". Please restart your Next.js server after updating next.config.mjs', 'error');
          } else if (contentType && contentType.includes('usdz')) {
            addDebugLog('Content-Type is correct for USDZ', 'success');
          }
          
          // For Quick Look, the file must be accessible via the exact URL
          // Quick Look may cache or have issues, so we log the exact URL being used
          addDebugLog(`Quick Look will use URL: ${absoluteIosSrc}`, 'info');
        }
      } catch (error) {
        addDebugLog(`Could not verify USDZ: ${error.message}`, 'error');
        console.error('Could not verify USDZ file:', error);
        // Don't throw here - let it try anyway, sometimes fetch fails but file is accessible
      }
      
      // Wait for USDZ to be recognized by model-viewer
      // iOS Quick Look needs time to process the USDZ file
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Double-check the attribute was set
      const finalIosSrc = modelViewer.getAttribute('ios-src');
      if (finalIosSrc !== absoluteIosSrc) {
        const errorMsg = `Failed to set ios-src. Expected: ${absoluteIosSrc}, Got: ${finalIosSrc}`;
        addDebugLog(errorMsg, 'error');
        console.error('Failed to set ios-src attribute. Expected:', absoluteIosSrc, 'Got:', finalIosSrc);
        throw new Error('Failed to set iOS USDZ source');
      }
      
      addDebugLog(`iOS USDZ source confirmed: ${finalIosSrc}`, 'success');
      console.log('iOS USDZ source confirmed:', finalIosSrc);
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
      addDebugLog('Waiting for 3D model to load...', 'info');
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          modelViewer.removeEventListener('load', onLoad);
          modelViewer.removeEventListener('model-loaded', onLoad);
          modelViewer.style.cssText = originalStyle;
          addDebugLog('Model loading timeout - model may be too large', 'error');
          reject(new Error('Model loading timeout - the 3D model file may be too large or slow to load'));
        }, 20000); // 20 second timeout (increased for large models)

        const onLoad = () => {
          clearTimeout(timeout);
          modelViewer.removeEventListener('load', onLoad);
          modelViewer.removeEventListener('model-loaded', onLoad);
          addDebugLog('3D model loaded successfully', 'success');
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
          addDebugLog('3D model already loaded', 'success');
          resolve();
        }
      });
    } else {
      addDebugLog('3D model already loaded', 'success');
    }

    // For iOS, Quick Look requires the USDZ to be fully loaded and accessible
    // The "Open this 3D model?" dialog is expected iOS behavior
    // After user clicks Allow, Quick Look should open with the camera
    if (isIOS) {
      // Ensure ios-src is set (already done above, but verify)
      if (iosSrc && modelViewer.getAttribute('ios-src') !== absoluteIosSrc) {
        modelViewer.setAttribute('ios-src', absoluteIosSrc);
        // Wait for iOS to recognize the USDZ file
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      // For iOS, try WebXR first (if supported), then fall back to Quick Look
      // WebXR will show camera directly, Quick Look requires user interaction
      addDebugLog('iOS: Attempting to activate AR...', 'info');
      addDebugLog(`iOS: Using USDZ URL: ${absoluteIosSrc}`, 'info');
      
      // Try WebXR first (works in some iOS versions)
      try {
        addDebugLog('iOS: Trying WebXR AR mode...', 'info');
        await modelViewer.activateAR();
        addDebugLog('iOS: AR activation successful', 'success');
        // If WebXR works, camera should show directly
        return;
      } catch (webxrError) {
        addDebugLog(`iOS: WebXR failed, trying Quick Look: ${webxrError.message}`, 'info');
        
        // If WebXR fails, Quick Look will be tried automatically by model-viewer
        // But if that also fails, show the model-viewer with AR button
        // The user can then manually tap the AR button on the model-viewer
        addDebugLog('iOS: Showing model-viewer - tap AR button to activate', 'info');
        setShowARViewer(true);
        setIsActivating(false);
        return;
      }
    }

    // Small delay before activating AR to ensure everything is ready
    await new Promise(resolve => setTimeout(resolve, 300));

    // Now activate AR - WebXR should open the camera/AR view directly in browser
    try {
      addDebugLog('Attempting to activate WebXR AR...', 'info');
      
      // Set up event listener to restore style when AR session ends
      const restoreOnExit = () => {
        modelViewer.style.cssText = originalStyle;
        setShowARViewer(false);
        addDebugLog('AR session ended', 'info');
        modelViewer.removeEventListener('ar-status', restoreOnExit);
      };
      modelViewer.addEventListener('ar-status', (e) => {
        if (e.detail.status === 'not-presenting') {
          restoreOnExit();
        } else if (e.detail.status === 'presenting') {
          addDebugLog('AR session active - camera should be visible', 'success');
        }
      });

      // For WebXR, the model-viewer needs to be visible and fullscreen
      // It will handle the fullscreen AR experience and show the camera
      await modelViewer.activateAR();
      
      addDebugLog('WebXR AR activated successfully', 'success');
      // If WebXR is active, the model-viewer will show the camera view
      // The style will be restored when AR session ends via the event listener
    } catch (error) {
      // Restore original style on error
      modelViewer.style.cssText = originalStyle;
      setShowARViewer(false);
      const errorMsg = `AR activation error: ${error.message || 'Unknown error'}`;
      addDebugLog(errorMsg, 'error');
      console.error('AR activation error:', error);
      
      // Check if it's a WebXR-specific error
      if (error.message && error.message.includes('webxr')) {
        throw new Error(`WebXR AR is not supported on this device. Please try a different browser or device.`);
      }
      
      // Re-throw with a more specific error
      throw new Error(errorMsg);
    }
  }, [ensureModelViewer, isIOS, iosSrc]);

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
    setIsARLoading(true);
    addDebugLog('Starting AR activation...', 'info');
    
    // Don't set isActivating to false immediately - let AR open
    // If it fails, we'll handle it in the catch block
    try {
      await activateAR();
      addDebugLog('AR activation completed', 'success');
      // If AR activation succeeds, the AR view should be open now
      // Don't reset isActivating here as AR might have navigated away
      setIsARLoading(false);
    } catch (error) {
      console.error('Failed to start AR:', error);
      addDebugLog(`AR activation failed: ${error.message}`, 'error');
      // Use different error handler for AR activation errors
      handleARActivationError(error);
      setIsActivating(false);
      setIsARLoading(false);
    }
  }, [activateAR, handleARActivationError, addDebugLog]);

  const sharedAttributes = useMemo(
    () => {
      // For iOS, prioritize quick-look but also try webxr
      // For others, prioritize webxr
      const modes = isIOS ? 'webxr quick-look' : 'webxr scene-viewer quick-look';
      return {
        src: modelSrc,
        'ios-src': iosSrc,
        ...(posterSrc ? { poster: posterSrc } : {}),
        ar: true,
        'ar-modes': modes,
        'ar-placement': arPlacement,
        'camera-controls': true,
        'auto-rotate': false, // Disable auto-rotate in AR for better performance
        'interaction-policy': 'allow-when-focused',
        'reveal': 'auto', // Auto-reveal when loaded
        'loading': 'eager', // Load model eagerly
        'preload': true, // Preload the model
      };
    },
    [isIOS, arPlacement, iosSrc, modelSrc, posterSrc],
  );

  if (!isClient || !isMobile) {
    return null;
  }

  return (
    <>
      {/* Debug Panel - Tap and hold AR button to show/hide */}
      {showDebugPanel && (
        <div className="fixed bottom-4 left-4 right-4 z-[10001] max-h-[40vh] overflow-y-auto bg-black/90 text-white p-3 rounded-lg text-xs font-mono border border-white/20">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-sm">AR Debug Logs</h3>
            <button
              onClick={() => {
                setShowDebugPanel(false);
                setDebugLogs([]);
              }}
              className="text-white/70 hover:text-white"
            >
              ✕
            </button>
          </div>
          <div className="space-y-1">
            {debugLogs.length === 0 ? (
              <div className="text-white/50">No logs yet. Try AR Preview to see logs.</div>
            ) : (
              debugLogs.map((log, idx) => (
                <div
                  key={idx}
                  className={`p-1 rounded ${
                    log.type === 'error'
                      ? 'bg-red-500/20 text-red-200'
                      : log.type === 'success'
                      ? 'bg-green-500/20 text-green-200'
                      : 'bg-blue-500/20 text-blue-200'
                  }`}
                >
                  <span className="text-white/50">[{log.timestamp}]</span>{' '}
                  <span>{log.message}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Debug Toggle - Long press AR button to show debug panel */}
      {isClient && isMobile && (
        <div
          className="fixed bottom-20 right-4 z-[10000]"
          onTouchStart={(e) => {
            const startTime = Date.now();
            const touchEnd = () => {
              const duration = Date.now() - startTime;
              if (duration > 1000) {
                // Long press detected
                setShowDebugPanel(!showDebugPanel);
              }
              document.removeEventListener('touchend', touchEnd);
            };
            document.addEventListener('touchend', touchEnd, { once: true });
          }}
        >
          <button
            className="bg-purple-600/80 text-white text-xs px-2 py-1 rounded"
            onClick={() => setShowDebugPanel(!showDebugPanel)}
          >
            {showDebugPanel ? 'Hide' : 'Show'} Debug
          </button>
        </div>
      )}

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
      {/* For iOS, show it when AR viewer is activated. For others, keep it hidden until AR activates */}
      {showARViewer ? (
        <div className="fixed inset-0 z-[9999] bg-black">
          {/* Back Button */}
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
              aria-label="Close AR"
            >
              <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="text-sm font-semibold text-gray-900">Back</span>
            </button>
          </div>
          
          {/* Close Button (X) */}
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
              aria-label="Close AR"
            >
              <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Info message for iOS - Instructions to tap AR button */}
          {isIOS && (
            <div className="absolute bottom-20 left-4 right-4 z-[10000] bg-blue-500/90 text-white p-4 rounded-lg shadow-xl">
              <p className="font-semibold mb-2 text-base">📱 Tap the AR button to view in Augmented Reality</p>
              <p className="text-sm opacity-90 mb-2">Look for the cube/AR icon on the 3D model viewer below</p>
              <p className="text-xs opacity-75">If Quick Look showed "Zero KB", the USDZ file may need to be checked. The AR button will try WebXR instead.</p>
            </div>
          )}
          
          <model-viewer
            ref={modelViewerRef}
            style={{ width: '100vw', height: '100vh', display: 'block' }}
            {...sharedAttributes}
          />
        </div>
      ) : (
        <model-viewer
          ref={modelViewerRef}
          style={{ display: 'none', width: '100vw', height: '100vh' }}
          {...sharedAttributes}
        />
      )}
    </>
  );
}


