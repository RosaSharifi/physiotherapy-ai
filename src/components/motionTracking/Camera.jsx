/**
 * Camera component for displaying video feed and pose detection overlay
 */

import React, { useRef, useEffect, useState } from 'react';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import { POSE_CONNECTIONS } from '@mediapipe/pose';
import styles from '../../styles/components/motionTracking/Camera.module.css';

const Camera = ({
                    videoRef,
                    poseResults,
                    showPoseDetection = true,
                    showControls = true,
                    facingMode,
                    onSwitchCamera,
                    error
                }) => {
    const canvasRef = useRef(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const containerRef = useRef(null);

    // Handle drawing pose landmarks on canvas
    useEffect(() => {
        if (!canvasRef.current || !videoRef.current || !poseResults || !showPoseDetection) {
            return;
        }

        const videoElement = videoRef.current;
        const canvasElement = canvasRef.current;
        const canvasCtx = canvasElement.getContext('2d');

        // Set canvas dimensions to match video
        canvasElement.width = videoElement.videoWidth;
        canvasElement.height = videoElement.videoHeight;

        // Clear canvas
        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

        // Draw pose landmarks and connections
        if (poseResults.poseLandmarks) {
            // Draw pose connections
            drawConnectors(
                canvasCtx,
                poseResults.poseLandmarks,
                POSE_CONNECTIONS,
                { color: '#00FF00', lineWidth: 2 }
            );

            // Draw pose landmarks
            drawLandmarks(
                canvasCtx,
                poseResults.poseLandmarks,
                { color: '#FF0000', lineWidth: 1, radius: 3 }
            );
        }
    }, [poseResults, showPoseDetection, videoRef]);

    // Toggle fullscreen mode
    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            if (containerRef.current.requestFullscreen) {
                containerRef.current.requestFullscreen()
                    .then(() => setIsFullscreen(true))
                    .catch(err => console.error('Error attempting to enable fullscreen', err));
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen()
                    .then(() => setIsFullscreen(false))
                    .catch(err => console.error('Error attempting to exit fullscreen', err));
            }
        }
    };

    // Update fullscreen state when it changes
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);

        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, []);

    return (
        <div className={styles.cameraContainer} ref={containerRef}>
            {error && (
                <div className={styles.errorMessage}>
                    <p>{error}</p>
                </div>
            )}

            <div className={styles.videoWrapper}>
                <video
                    ref={videoRef}
                    className={styles.videoElement}
                    playsInline
                    muted
                />

                {showPoseDetection && (
                    <canvas
                        ref={canvasRef}
                        className={styles.canvasOverlay}
                    />
                )}
            </div>

            {showControls && (
                <div className={styles.controlsContainer}>
                    {onSwitchCamera && (
                        <button
                            onClick={onSwitchCamera}
                            className={styles.cameraButton}
                            aria-label="Switch camera"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20 4h-3.17L15 2H9L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-5 11.5V13H9v2.5L5.5 12 9 8.5V11h6V8.5l3.5 3.5-3.5 3.5z" fill="currentColor"/>
                            </svg>
                            <span>{facingMode === 'user' ? 'Back Camera' : 'Front Camera'}</span>
                        </button>
                    )}

                    <button
                        onClick={toggleFullscreen}
                        className={styles.fullscreenButton}
                        aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            {isFullscreen ? (
                                <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" fill="currentColor"/>
                            ) : (
                                <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" fill="currentColor"/>
                            )}
                        </svg>
                        <span>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default Camera;
