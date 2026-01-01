'use client';

import React, { useEffect, useState, useRef } from 'react';

/**
 * Enhanced AR Preview with Multi-Placement
 * - iOS: Simple Quick Look AR (single placement) using USDZ files
 * - Android: Tap screen to add multiple grass instances using WebXR with Three.js
 * - Works on both iOS and Android devices
 */
export default function ARPreviewMultiPlacement({
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
  const [webXRSupported, setWebXRSupported] = useState(false);
  const arContainerRef = useRef(null);

  // STEP 1: Initialize client-side detection
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    setIsClient(true);
    
    // STEP 2: Detect iOS devices
    const userAgentCheck = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    const iPadOSCheck = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
    const vendorCheck = /iPad|iPhone|iPod/.test(navigator.vendor);
    const isIOSDevice = userAgentCheck || iPadOSCheck || vendorCheck;
    setIsIOS(isIOSDevice);
    
    // STEP 3: Detect mobile devices
    const checkMobile = () => {
      const isMobileDevice = window.innerWidth <= 1024 || 
                             /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      setIsMobile(isMobileDevice);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // STEP 4: Check WebXR support (only for non-iOS devices)
    if (!isIOSDevice && navigator.xr) {
      navigator.xr.isSessionSupported('immersive-ar').then((supported) => {
        setWebXRSupported(supported);
      }).catch(() => {
        setWebXRSupported(false);
      });
    } else {
      setWebXRSupported(false);
    }

    // STEP 5: Load Three.js and model-viewer (only for non-iOS devices)
    if (!isIOSDevice) {
      // Load Three.js for WebXR multi-placement
      if (!window.THREE) {
        const threeScript = document.createElement('script');
        threeScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
        document.head.appendChild(threeScript);
        
        // Load GLTFLoader
        const gltfScript = document.createElement('script');
        gltfScript.src = 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js';
        gltfScript.onload = () => {
          // GLTFLoader is now available
        };
        document.head.appendChild(gltfScript);
      }
      
      // Load model-viewer as fallback
      const script = document.createElement('script');
      script.type = 'module';
      script.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/3.3.0/model-viewer.min.js';
      document.head.appendChild(script);
    }

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleClick = () => {
    if (!isClient || !isMobile) return;
    setShowInstructions(true);
  };

  const handleStartAR = async () => {
    setShowInstructions(false);

    // STEP 1: Handle iOS AR with Quick Look (simple single placement)
    if (isIOS && iosSrc) {
      // Create anchor element for Quick Look
      const arAnchor = document.createElement('a');
      arAnchor.rel = 'ar';
      arAnchor.href = iosSrc;
      
      // Append to body
      document.body.appendChild(arAnchor);
      
      // Trigger click to open Quick Look
      arAnchor.click();
      
      // Cleanup after a short delay
      setTimeout(() => {
        if (document.body.contains(arAnchor)) {
          document.body.removeChild(arAnchor);
        }
      }, 100);
      
      return;
    }

    // STEP 2: Handle Android/Web AR with WebXR multi-placement
    if (webXRSupported && window.THREE) {
      await startWebXRAR();
    } else {
      // Fallback to model-viewer (single placement only)
      startModelViewerAR();
    }
  };

  const startWebXRAR = async () => {
    // Custom Three.js + WebXR implementation for true multi-placement
    try {
      // Wait for Three.js to load if needed
      if (!window.THREE) {
        await new Promise((resolve) => {
          const checkThree = setInterval(() => {
            if (window.THREE) {
              clearInterval(checkThree);
              resolve();
            }
          }, 100);
          setTimeout(() => {
            clearInterval(checkThree);
            if (!window.THREE) {
              startModelViewerAR();
              return;
            }
            resolve();
          }, 5000);
        });
      }

      if (!window.THREE) {
        startModelViewerAR();
        return;
      }

      const THREE = window.THREE;
      
      // Create AR container
      const container = document.createElement('div');
      container.id = 'ar-webxr-container';
      container.style.cssText = 'position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 9999; background: transparent;';
      document.body.appendChild(container);
      arContainerRef.current = container;

      // Create scene
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);
      const renderer = new THREE.WebGLRenderer({ 
        alpha: true, 
        antialias: true,
        xr: true 
      });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.xr.enabled = true;
      container.appendChild(renderer.domElement);

      // Store grass instances
      const grassInstances = [];
      let grassModel = null;

      // Load grass model
      const loader = new THREE.GLTFLoader();
      loader.load(
        modelSrc,
        (gltf) => {
          grassModel = gltf.scene;
          
          // Function to add grass at hit point
          const addGrassAtPoint = (point) => {
            if (!grassModel) return;
            const instance = grassModel.clone();
            instance.position.set(point.x, point.y || 0, point.z);
            scene.add(instance);
            grassInstances.push(instance);
          };

          // Request AR session
          navigator.xr.requestSession('immersive-ar', {
            requiredFeatures: ['local-floor'],
            optionalFeatures: ['bounded-floor', 'hit-test']
          }).then(async (session) => {
            renderer.xr.setSession(session);

            // Get reference space first
            const viewerSpace = await session.requestReferenceSpace('local-floor');
            let hitTestSource = null;
            
            try {
              // Create hit test source for floor detection
              const hitTestSourceInit = { space: viewerSpace };
              hitTestSource = await session.requestHitTestSource(hitTestSourceInit);
            } catch (e) {
              console.warn('Hit test not available, using fallback');
            }
            
            // Store last tap position for hit testing
            let pendingTap = null;
            
            // Handle taps/clicks to add grass
            const onSelect = () => {
              pendingTap = true;
            };

            // Add controller for selection
            const controller = renderer.xr.getController(0);
            controller.addEventListener('select', onSelect);
            scene.add(controller);

            // Handle screen taps for mobile
            container.addEventListener('touchstart', (event) => {
              event.preventDefault();
              pendingTap = true;
            });

            // Animation loop with hit testing
            renderer.setAnimationLoop((time, frame) => {
              if (frame && hitTestSource && pendingTap) {
                try {
                  const hitTestResults = frame.getHitTestResults(hitTestSource);
                  if (hitTestResults.length > 0) {
                    const hit = hitTestResults[0];
                    const pose = hit.getPose(viewerSpace);
                    if (pose) {
                      const position = pose.transform.position;
                      addGrassAtPoint({ x: position.x, y: position.y, z: position.z });
                    }
                  } else {
                    // Fallback: add at center if no hit test
                    addGrassAtPoint({ x: 0, y: 0, z: 0 });
                  }
                  pendingTap = false;
                } catch (e) {
                  // Hit test failed, use fallback
                  if (pendingTap) {
                    addGrassAtPoint({ x: 0, y: 0, z: 0 });
                    pendingTap = false;
                  }
                }
              }
              renderer.render(scene, camera);
            });

            session.addEventListener('end', () => {
              renderer.setAnimationLoop(null);
              if (container.parentNode) {
                container.parentNode.removeChild(container);
              }
              grassInstances.forEach(instance => scene.remove(instance));
              grassInstances.length = 0;
            });
          }).catch((error) => {
            console.error('WebXR session failed:', error);
            container.remove();
            startModelViewerAR();
          });
        },
        undefined,
        (error) => {
          console.error('Error loading model:', error);
          container.remove();
          startModelViewerAR();
        }
      );
    } catch (error) {
      console.error('WebXR AR setup failed:', error);
      startModelViewerAR();
    }
  };

  const startModelViewerAR = () => {
    // Use model-viewer with WebXR priority for better AR experience
    const existingViewer = document.querySelector('#temp-ar-viewer');
    if (existingViewer) {
      existingViewer.remove();
    }

    const viewer = document.createElement('model-viewer');
    viewer.id = 'temp-ar-viewer';
    viewer.setAttribute('src', modelSrc);
    viewer.setAttribute('ar', '');
    // Prioritize WebXR for better multi-placement potential, fallback to scene-viewer
    viewer.setAttribute('ar-modes', 'webxr scene-viewer');
    viewer.setAttribute('ar-placement', arPlacement);
    viewer.setAttribute('ar-scale', 'auto');
    
    viewer.style.cssText = 'position: fixed; width: 1px; height: 1px; top: -9999px; left: -9999px; opacity: 0; pointer-events: none;';
    
    document.body.appendChild(viewer);

    setTimeout(() => {
      if (viewer.activateAR) {
        viewer.activateAR().catch(() => {
          viewer.remove();
        });
      }
      
      setTimeout(() => {
        if (document.body.contains(viewer)) {
          viewer.remove();
        }
      }, 30000);
    }, 500);
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
      <div 
        className={className}
        onClick={handleClick}
      >
        {children}
      </div>

      {/* Instructions Modal */}
      {showInstructions && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          style={{ backdropFilter: 'blur(4px)' }}
        >
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            
            {/* Icon */}
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-center mb-3 text-gray-800">
              {isIOS ? 'AR Preview' : 'AR Multi-Placement'}
            </h2>

            {/* Instructions */}
            <div className="space-y-3 mb-6">
              {isIOS ? (
                <>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                    <p className="text-gray-700 text-sm pt-0.5">
                      Point your camera at a flat surface (floor)
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                    <p className="text-gray-700 text-sm pt-0.5">
                      Tap to place the grass model
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                    <p className="text-gray-700 text-sm pt-0.5">
                      Move your device to view from different angles
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                    <p className="text-gray-700 text-sm pt-0.5">
                      Point your camera at a flat surface (floor)
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                    <p className="text-gray-700 text-sm pt-0.5">
                      Tap to place your first grass patch
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                    <p className="text-gray-700 text-sm pt-0.5">
                      <strong>Keep tapping to add more grass patches!</strong>
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                    <p className="text-gray-700 text-sm pt-0.5">
                      Each tap adds a new grass instance at that location
                    </p>
                  </div>
                  {!webXRSupported && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-4">
                      <p className="text-xs text-yellow-800">
                        <strong>Note:</strong> WebXR not detected. Using fallback mode (may have limited multi-placement).
                      </p>
                    </div>
                  )}
                  {webXRSupported && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-4">
                      <p className="text-xs text-green-800">
                        <strong>WebXR Enabled:</strong> Full multi-placement support! Tap anywhere to add more grass.
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowInstructions(false)}
                className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleStartAR}
                className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition shadow-lg"
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





