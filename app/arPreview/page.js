'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

/**
 * ARPreviewButton integrates the <model-viewer> web component and handles camera permission flow.
 * - On click we pre-flight camera permission to honour the UX requirements.
 * - If permission is granted we trigger activateAR() which opens the native/web AR experience.
 * - If permission is denied we show a dialog and return focus to the AR button.
 */
export default function ARPreviewButton({
  children,
  modelSrc,
  iosSrc,
  posterSrc,
  arModes = 'scene-viewer quick-look webxr',
  arPlacement = 'floor',
  className = '',
  onPermissionDenied,
  onPermissionGranted,
}) {
  const modelViewerRef = useRef(null);
  const buttonRef = useRef(null);
  const [isClient, setIsClient] = useState(false);
  const [isActivating, setIsActivating] = useState(false);
  const [dialogState, setDialogState] = useState({ open: false, message: '' });

  const ensureModelViewer = useCallback(async () => {
    if (typeof window === 'undefined') return;
    if (window.customElements?.get('model-viewer')) return;
    try {
      await import('@google/model-viewer');
    } catch (error) {
      console.warn('Failed to load @google/model-viewer', error);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setIsClient(true);
    ensureModelViewer();
  }, [ensureModelViewer]);

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

      setDialogState({ open: true, message });

      if (typeof onPermissionDenied === 'function') {
        onPermissionDenied(error);
      }
    },
    [onPermissionDenied],
  );

  const activateAR = useCallback(async () => {
    if (!modelViewerRef.current || typeof modelViewerRef.current.activateAR !== 'function') {
      throw new Error('unsupported');
    }
    await modelViewerRef.current.activateAR();
  }, []);

  const handleClick = useCallback(async () => {
    if (!isClient || isActivating) {
      return;
    }

    setIsActivating(true);
    try {
      await requestCameraPermission();
      if (typeof onPermissionGranted === 'function') {
        onPermissionGranted();
      }
      await activateAR();
    } catch (error) {
      handlePermissionDenied(error);
    } finally {
      setIsActivating(false);
    }
  }, [activateAR, handlePermissionDenied, isActivating, isClient, onPermissionGranted, requestCameraPermission]);

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

  return (
    <>
      {dialogState.open && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-xs rounded-lg bg-white p-6 text-center shadow-xl">
            <h2 className="mb-2 text-lg font-semibold text-gray-900">
              Camera Permission Needed
            </h2>
            <p className="mb-6 text-sm text-gray-700">
              {dialogState.message}
            </p>
            <button
              type="button"
              className="w-full rounded-md bg-[#623183] px-4 py-2 text-sm font-semibold text-white shadow hover:bg-[#4e2667] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4e2667]/70"
              onClick={() => {
                setDialogState({ open: false, message: '' });
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

      <button
        type="button"
        onClick={handleClick}
        className={className}
        disabled={!isClient || isActivating}
        ref={buttonRef}
      >
        {children}
      </button>

      {/* Render the model-viewer element only on the client to avoid SSR mismatch. */}
      {isClient && (
        <model-viewer
          ref={modelViewerRef}
          style={{ display: 'none' }}
          {...sharedAttributes}
        />
      )}
    </>
  );
}


