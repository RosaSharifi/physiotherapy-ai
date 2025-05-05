/**
 * PoseDetection component integrates camera access and pose detection
 * This is a fresh implementation that prevents initialization loops
 */

import React, { useRef, useEffect, useState } from 'react';
import useCamera from '../../hooks/useCamera';
import usePoseDetection from '../../hooks/usePoseDetection';
import Camera from './Camera';
import styles from '../../styles/components/motionTracking/PoseDetection.module.css';

// Global initialization flag to ensure we only attempt setup once per page load
let hasAttemptedInitialization = false;

const PoseDetection = ({
                           onPoseDetected,
                           showPoseDetection = true,
                           showControls = true,
                           modelComplexity = 1,
                           minDetectionConfidence = 0.5,
                           minTrackingConfidence = 0.5,
                           children
                       }) => {
    const videoRef = useRef(null);
    const [rawResults, setRawResults] = useState(null);
    const [debugInfo, setDebugInfo] = useState('Waiting to start...');
    const [setupComplete, setSetupComplete] = useState(false);
    const [initializeManually, setInitializeManually] = useState(false);

    // Store callback in ref to avoid dependency changes
    const onPoseDetectedRef = useRef(onPoseDetected);
    useEffect(() => {
        onPoseDetectedRef.current = onPoseDetected;
    }, [onPoseDetected]);

    // Initialize camera hook
    const {
        isInitialized: isCameraInitialized,
        isCameraReady,
        error: cameraError,
        facingMode,
        switchCamera,
        initializeCamera,
        stopCamera
    } = useCamera();

    // Initialize pose detection hook
    const {
        isInitialized: isPoseInitialized,
        error: poseError,
        pose,
        initialPose,
        initPoseDetection,
        stopPoseDetection,
        resetInitialPose,
        setOnPoseUpdate
    } = usePoseDetection();

    // Combined error state
    const error = cameraError || poseError;

    // Handle pose detection results
    const handlePoseResults = (results) => {
        if (results) {
            setRawResults(results);
        }
    };

    // Force initialization flag - manually trigger setup
    const startSetup = () => {
        setInitializeManually(true);
        setDebugInfo('Manual initialization triggered...');
        hasAttemptedInitialization = false; // Reset the global flag to allow retrying
    };

    // ONE-TIME initialization effect
    useEffect(() => {
        // Prevent multiple initializations across remounts
        if (hasAttemptedInitialization) {
            setDebugInfo('Setup already attempted - use manual init if needed');
            return;
        }

        if (initializeManually || !hasAttemptedInitialization) {
            hasAttemptedInitialization = true;

            // Clear any previous setup
            const cleanup = () => {
                if (isPoseInitialized) {
                    stopPoseDetection();
                }
                if (isCameraInitialized) {
                    stopCamera();
                }
            };

            // Step 1: Initialize camera
            const setupCamera = async () => {
                try {
                    setDebugInfo('Initializing camera...');
                    if (videoRef.current) {
                        await initializeCamera(videoRef.current);
                        setDebugInfo('Camera initialized, waiting for readiness');
                    }
                } catch (err) {
                    setDebugInfo(`Camera init error: ${err.message}`);
                    cleanup();
                }
            };

            setupCamera();
        }

        // Cleanup on unmount - must stop everything
        return () => {
            if (isPoseInitialized) {
                stopPoseDetection();
            }
            if (isCameraInitialized) {
                stopCamera();
            }
        };
    }, [initializeManually]); // Only dependencies are manual init trigger

    // Watch camera readiness and set up pose detection
    useEffect(() => {
        if (isCameraReady && !isPoseInitialized && !setupComplete) {
            const setupPose = async () => {
                try {
                    setDebugInfo('Camera ready, setting up pose detection');

                    await initPoseDetection(videoRef.current, {
                        modelComplexity,
                        minDetectionConfidence,
                        minTrackingConfidence
                    });

                    // Set up callback once initialization is complete
                    setOnPoseUpdate((currentPose, initialPose, results) => {
                        if (onPoseDetectedRef.current) {
                            onPoseDetectedRef.current(currentPose, initialPose, results);
                        }
                        handlePoseResults(results);
                    });

                    setDebugInfo('Setup complete!');
                    setSetupComplete(true);
                } catch (err) {
                    setDebugInfo(`Pose init error: ${err.message}`);
                }
            };

            const timer = setTimeout(setupPose, 1000);
            return () => clearTimeout(timer);
        }
    }, [isCameraReady, isPoseInitialized, setupComplete, initPoseDetection,
        modelComplexity, minDetectionConfidence, minTrackingConfidence, setOnPoseUpdate]);

    // Handle camera switch with minimal dependencies
    const handleSwitchCamera = async () => {
        if (isCameraInitialized) {
            setDebugInfo('Switching camera...');

            // Stop pose detection first
            if (isPoseInitialized) {
                stopPoseDetection();
            }

            // Switch camera
            await switchCamera();

            // Wait for camera to be ready again
            setTimeout(async () => {
                if (videoRef.current) {
                    try {
                        await initPoseDetection(videoRef.current, {
                            modelComplexity,
                            minDetectionConfidence,
                            minTrackingConfidence
                        });
                        resetInitialPose();
                        setDebugInfo(`Camera switched to ${facingMode === 'user' ? 'front' : 'back'}`);
                    } catch (err) {
                        setDebugInfo(`Error reinitializing after switch: ${err.message}`);
                    }
                }
            }, 1000);
        }
    };

    return (
        <div className={styles.poseDetectionContainer}>
            <Camera
                videoRef={videoRef}
                poseResults={rawResults}
                showPoseDetection={showPoseDetection && isPoseInitialized}
                showControls={showControls}
                facingMode={facingMode}
                onSwitchCamera={handleSwitchCamera}
                error={error}
            />

            {/* Debug info */}
            <div className={styles.debugInfo}>
                <div>Status: {debugInfo}</div>
                <div>Camera: {isCameraInitialized ? 'Initialized' : 'Waiting'}, Ready: {isCameraReady ? 'Yes' : 'No'}</div>
                <div>Pose Detection: {isPoseInitialized ? 'Initialized' : 'Waiting'}</div>
                <div>Setup Complete: {setupComplete ? 'Yes' : 'No'}</div>
                <div>Pose Data: {pose ? 'Available' : 'None'}</div>
            </div>

            {children && (
                <div className={styles.childrenContainer}>
                    {React.Children.map(children, child => {
                        // Pass pose data to children if they're valid React elements
                        if (React.isValidElement(child)) {
                            return React.cloneElement(child, {
                                pose,
                                initialPose,
                                resetPose: resetInitialPose
                            });
                        }
                        return child;
                    })}
                </div>
            )}

            {!setupComplete && !error && (
                <div className={styles.loadingContainer}>
                    <div className={styles.loadingSpinner}></div>
                    <p>Setting up camera and pose detection...</p>
                    {(isCameraReady && !isPoseInitialized) && (
                        <button
                            className={styles.manualInitButton}
                            onClick={startSetup}
                        >
                            Force Initialize
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default PoseDetection;
