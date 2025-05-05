/**
 * Custom hook for MediaPipe Pose detection and landmark processing
 */

import { useState, useEffect, useRef } from 'react';
import * as poseDetection from '@mediapipe/pose';
import { Camera } from '@mediapipe/camera_utils';
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

    /**
     * Initialize MediaPipe Pose detection
     */
    const initPoseDetection = async (videoElement, options = {}) => {
        try {
            setError(null);
            setIsProcessing(true);

            // Create pose detector instance
            const detector = new poseDetection.Pose({
                locateFile: (file) => {
                    return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
                }
            });

            // Configure pose detection
            await detector.setOptions({
                modelComplexity: options.modelComplexity || 1, // 0: Lite, 1: Full, 2: Heavy
                smoothLandmarks: options.smoothLandmarks !== false, // Apply smoothing
                enableSegmentation: options.enableSegmentation || false, // Person segmentation
                smoothSegmentation: options.smoothSegmentation || false, // Segmentation smoothing
                minDetectionConfidence: options.minDetectionConfidence || 0.5,
                minTrackingConfidence: options.minTrackingConfidence || 0.5
            });

            // Set up result handler
            detector.onResults(handlePoseResults);
            setPoseDetector(detector);

            // Initialize camera if video element provided
            if (videoElement) {
                const cameraInstance = new Camera(videoElement, {
                    onFrame: async () => {
                        // Limit processing to reasonable frame rate (avoid overloading)
                        const now = Date.now();
                        const elapsed = now - lastProcessTimeRef.current;
                        const frameInterval = 1000 / (options.maxFps || 30); // Default to 30fps max

                        if (elapsed >= frameInterval) {
                            lastProcessTimeRef.current = now;
                            if (poseDetector && videoElement.readyState === 4) {
                                await detector.send({ image: videoElement });
                            }
                        }
                    },
                    width: options.width || 640,
                    height: options.height || 480
                });

                // Start camera processing
                cameraInstance.start();
                setCamera(cameraInstance);
            }

            setIsInitialized(true);
            setIsProcessing(false);
        } catch (err) {
            setError(`Pose detection initialization error: ${err.message}`);
            setIsInitialized(false);
            setIsProcessing(false);
        }
    };

    /**
     * Handle pose detection results
     */
    const handlePoseResults = (results) => {
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
            setError(`Pose processing error: ${err.message}`);
        }
    };

    /**
     * Reset the initial pose (useful when starting a new exercise)
     */
    const resetInitialPose = () => {
        setInitialPose(lastPoseRef.current);
    };

    /**
     * Set callback for pose updates
     */
    const setOnPoseUpdate = (callback) => {
        onPoseUpdateRef.current = callback;
    };

    /**
     * Stop pose detection and clean up
     */
    const stopPoseDetection = () => {
        if (camera) {
            camera.stop();
            setCamera(null);
        }

        if (poseDetector) {
            poseDetector.close();
            setPoseDetector(null);
        }

        setIsInitialized(false);
    };

    /**
     * Clean up on unmount
     */
    useEffect(() => {
        return () => {
            stopPoseDetection();
        };
    }, []);

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
