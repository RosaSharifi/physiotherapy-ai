/**
 * PoseDetection component integrates camera access and pose detection
 * Manages the video feed and MediaPipe Pose detection
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';
import useCamera from '../../hooks/useCamera';
import usePoseDetection from '../../hooks/usePoseDetection';
import Camera from './Camera';
import styles from '../../styles/components/motionTracking/PoseDetection.module.css';

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
    const handlePoseResults = useCallback((results) => {
        if (results) {
            setRawResults(results);
        }
    }, []);

    // Set up camera when component mounts
    useEffect(() => {
        const setupCamera = async () => {
            if (videoRef.current && !isCameraInitialized) {
                await initializeCamera(videoRef.current);
            }
        };

        setupCamera();

        // Clean up when component unmounts
        return () => {
            stopCamera();
            stopPoseDetection();
        };
    }, [initializeCamera, isCameraInitialized, stopCamera, stopPoseDetection]);

    // Set up pose detection when camera is ready
    useEffect(() => {
        const setupPoseDetection = async () => {
            if (videoRef.current && isCameraReady && !isPoseInitialized) {
                await initPoseDetection(videoRef.current, {
                    modelComplexity,
                    minDetectionConfidence,
                    minTrackingConfidence
                });
            }
        };

        setupPoseDetection();
    }, [
        isCameraReady,
        isPoseInitialized,
        initPoseDetection,
        modelComplexity,
        minDetectionConfidence,
        minTrackingConfidence
    ]);

    // Set up pose update callback when pose detection is initialized
    useEffect(() => {
        if (isPoseInitialized && onPoseDetected) {
            setOnPoseUpdate((currentPose, initialPose, results) => {
                onPoseDetected(currentPose, initialPose, results);
                handlePoseResults(results);
            });
        }
    }, [isPoseInitialized, onPoseDetected, setOnPoseUpdate, handlePoseResults]);

    // Handle camera switch
    const handleSwitchCamera = async () => {
        await switchCamera();
        // Reset initial pose after switching camera
        if (isPoseInitialized) {
            resetInitialPose();
        }
    };

    // Force reset of initial pose
    const resetPose = () => {
        if (isPoseInitialized) {
            resetInitialPose();
        }
    };

    return (
        <div className={styles.poseDetectionContainer}>
            <Camera
                videoRef={videoRef}
                poseResults={rawResults}
                showPoseDetection={showPoseDetection}
                showControls={showControls}
                facingMode={facingMode}
                onSwitchCamera={handleSwitchCamera}
                error={error}
            />

            {children && (
                <div className={styles.childrenContainer}>
                    {React.Children.map(children, child => {
                        // Pass pose data to children
                        return React.cloneElement(child, {
                            pose,
                            initialPose,
                            resetPose
                        });
                    })}
                </div>
            )}

            {!isCameraReady && !error && (
                <div className={styles.loadingContainer}>
                    <div className={styles.loadingSpinner}></div>
                    <p>Starting camera...</p>
                </div>
            )}

            {isCameraReady && !isPoseInitialized && !error && (
                <div className={styles.loadingContainer}>
                    <div className={styles.loadingSpinner}></div>
                    <p>Initializing pose detection...</p>
                </div>
            )}
        </div>
    );
};

export default PoseDetection;
