/**
 * Custom hook for MediaPipe Pose detection and landmark processing
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { extractPosePoints } from '../utils/poseUtils';

const usePoseDetection = () => {
    const [poseDetector, setPoseDetector] = useState(null);
    const [camera, setCamera] = useState(null);
    const [isInitialized, setIsInitialized] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);
    const [pose, setPose] = useState(null);
    const [initialPose, setInitialPose] = useState(null);
    const lastPoseRef = useRef(null);
    const lastProcessTimeRef = useRef(0);
    const onPoseUpdateRef = useRef(null);
    const [isInitializing, setIsInitializing] = useState(false);
    const initAttemptRef = useRef(false);

    /**
     * Initialize MediaPipe Pose detection
     */
    const initPoseDetection = useCallback(async (videoElement, options = {}) => {
        try {
            // Prevent multiple initialization attempts
            if (isInitializing || initAttemptRef.current) {
                console.log("Pose detection initialization already in progress, skipping");
                return;
            }

            setIsInitializing(true);
            initAttemptRef.current = true;
            console.log("Starting pose detection initialization...");

            setError(null);
            setIsProcessing(true);

            // Wait for MediaPipe libraries to be loaded
            const checkLibrariesLoaded = () => {
                return new Promise((resolve) => {
                    const check = () => {
                        if (window.Pose && window.Camera) {
                            console.log("MediaPipe libraries found in window");
                            resolve(true);
                        } else {
                            console.log("Waiting for MediaPipe libraries...");
                            setTimeout(check, 200);
                        }
                    };
                    check();
                });
            };

            await checkLibrariesLoaded();

            // Create pose detector using the global constructor
            console.log("Creating Pose instance using global constructor...");
            const detector = new window.Pose({
                locateFile: (file) => {
                    return `https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.5.1635988162/${file}`;
                }
            });

            console.log("Pose detector created, configuring options...");

            // Configure pose detection
            await detector.setOptions({
                modelComplexity: options.modelComplexity || 0, // Use simpler model (0) for better performance
                smoothLandmarks: options.smoothLandmarks !== false, // Apply smoothing
                enableSegmentation: false, // Disable for better performance
                smoothSegmentation: false,
                minDetectionConfidence: options.minDetectionConfidence || 0.5,
                minTrackingConfidence: options.minTrackingConfidence || 0.5
            });

            console.log("Pose options set, setting up result handler...");

            // Set up result handler
            detector.onResults((results) => {
                handlePoseResults(results);
            });

            setPoseDetector(detector);

            // Initialize camera if video element provided
            if (videoElement) {
                console.log("Creating Camera instance for pose detection...");
                try {
                    const cameraInstance = new window.Camera(videoElement, {
                        onFrame: async () => {
                            // Limit processing to reasonable frame rate (avoid overloading)
                            const now = Date.now();
                            const elapsed = now - lastProcessTimeRef.current;
                            const frameInterval = 1000 / (options.maxFps || 30); // Default to 30fps max

                            if (elapsed >= frameInterval) {
                                lastProcessTimeRef.current = now;
                                if (detector && videoElement.readyState === 4) {
                                    try {
                                        await detector.send({ image: videoElement });
                                    } catch (err) {
                                        console.error("Error processing frame:", err);
                                    }
                                }
                            }
                        },
                        width: options.width || 640,
                        height: options.height || 480
                    });

                    // Start camera processing
                    console.log("Starting Camera instance...");
                    await cameraInstance.start();
                    console.log("Camera processing started");
                    setCamera(cameraInstance);
                } catch (err) {
                    console.error("Error starting camera for pose detection:", err);
                    setError(`Failed to start camera processing: ${err.message}`);
                }
            }

            console.log("Pose detection initialization complete");
            setIsInitialized(true);
            setIsProcessing(false);
            setIsInitializing(false);
        } catch (err) {
            console.error("Pose detection initialization error:", err);
            setError(`Pose detection initialization error: ${err.message}`);
            setIsInitialized(false);
            setIsProcessing(false);
            setIsInitializing(false);
        }
    }, [isInitializing]);

    // Rest of your code remains the same (handlePoseResults, resetInitialPose, etc.)

    /**
     * Handle pose detection results
     */
    const handlePoseResults = useCallback((results) => {
        try {
            if (results.poseLandmarks) {
                // Process pose landmarks into more usable format
                const processedPose = extractPosePoints(results.poseLandmarks);

                // Store the current pose
                setPose(processedPose);
                lastPoseRef.current = processedPose;

                // If no initial pose is set yet, save the current pose as initial
                if (!initialPose) {
                    setInitialPose(processedPose);
                }

                // If callback is provided, pass the processed pose
                if (onPoseUpdateRef.current) {
                    onPoseUpdateRef.current(processedPose, initialPose, results);
                }
            }
        } catch (err) {
            console.error("Pose processing error:", err);
            setError(`Pose processing error: ${err.message}`);
        }
    }, [initialPose]);

    /**
     * Reset the initial pose (useful when starting a new exercise)
     */
    const resetInitialPose = useCallback(() => {
        setInitialPose(lastPoseRef.current);
    }, []);

    /**
     * Set callback for pose updates
     */
    const setOnPoseUpdate = useCallback((callback) => {
        onPoseUpdateRef.current = callback;
    }, []);

    /**
     * Stop pose detection and clean up
     */
    const stopPoseDetection = useCallback(() => {
        console.log("Stopping pose detection...");
        if (camera) {
            try {
                camera.stop();
            } catch (err) {
                console.error("Error stopping camera:", err);
            }
            setCamera(null);
        }

        if (poseDetector) {
            try {
                poseDetector.close();
            } catch (err) {
                console.error("Error closing pose detector:", err);
            }
            setPoseDetector(null);
        }

        setIsInitialized(false);
        initAttemptRef.current = false;
    }, [camera, poseDetector]);

    /**
     * Clean up on unmount
     */
    useEffect(() => {
        return () => {
            stopPoseDetection();
        };
    }, [stopPoseDetection]);

    return {
        pose,
        initialPose,
        isInitialized,
        isProcessing,
        error,
        initPoseDetection,
        stopPoseDetection,
        resetInitialPose,
        setOnPoseUpdate
    };
};

export default usePoseDetection;
