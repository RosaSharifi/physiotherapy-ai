/**
 * Custom hook for managing camera access and video streaming
 */

import {useState, useEffect, useRef, useCallback} from 'react';

const useCamera = () => {
    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const [isInitialized, setIsInitialized] = useState(false);
    const [error, setError] = useState(null);
    const [isCameraReady, setIsCameraReady] = useState(false);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [facingMode, setFacingMode] = useState('user'); // 'user' for front camera, 'environment' for back camera

    /**
     * Initialize camera with requested settings
     */
    const initializeCamera = async (videoElement, options = {}) => {
        try {
            // Clear any previous error
            setError(null);

            // Default constraints
            const constraints = {
                video: {
                    facingMode: options.facingMode || facingMode,
                    width: { ideal: options.width || 640 },
                    height: { ideal: options.height || 480 },
                    frameRate: { ideal: options.frameRate || 30 }
                },
                audio: false
            };

            // Stop any existing stream
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }

            // Request camera access
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            streamRef.current = stream;

            // Connect the stream to the video element
            if (videoElement) {
                videoRef.current = videoElement;
                videoElement.srcObject = stream;

                // Set up event handlers for video element
                videoElement.onloadedmetadata = () => {
                    setDimensions({
                        width: videoElement.videoWidth,
                        height: videoElement.videoHeight
                    });

                    // Play video once metadata is loaded
                    videoElement.play()
                        .then(() => {
                            setIsCameraReady(true);
                            setIsInitialized(true);
                        })
                        .catch(err => {
                            setError(`Failed to play video: ${err.message}`);
                        });
                };
            }
        } catch (err) {
            setError(`Camera access error: ${err.message}`);
            setIsInitialized(false);
            setIsCameraReady(false);
        }
    };

    /**
     * Stop camera streaming and clean up resources
     */
    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }

        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }

        setIsCameraReady(false);
        setIsInitialized(false);
    };

    /**
     * Switch between front and back cameras (mobile devices)
     */
    const switchCamera = useCallback(async () => {
        // Toggle facing mode
        const newFacingMode = facingMode === 'user' ? 'environment' : 'user';
        console.log(`Switching camera from ${facingMode} to ${newFacingMode}`);
        setFacingMode(newFacingMode);

        // Reinitialize camera with new facing mode
        if (videoRef.current) {
            await initializeCamera(videoRef.current, { facingMode: newFacingMode });
        }
    }, [facingMode, initializeCamera]);

    /**
     * Take a screenshot of the current camera view
     */
    const takeSnapshot = () => {
        if (!videoRef.current || !isCameraReady) {
            return null;
        }

        // Create a canvas element to draw the video frame
        const canvas = document.createElement('canvas');
        canvas.width = dimensions.width;
        canvas.height = dimensions.height;

        // Draw the current video frame to the canvas
        const ctx = canvas.getContext('2d');
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

        // Convert canvas to data URL
        return canvas.toDataURL('image/jpeg');
    };

    /**
     * Clean up resources when component unmounts
     */
    useEffect(() => {
        return () => {
            stopCamera();
        };
    }, []);

    return {
        videoRef,
        isInitialized,
        isCameraReady,
        error,
        dimensions,
        facingMode,
        initializeCamera,
        stopCamera,
        switchCamera,
        takeSnapshot
    };
};

export default useCamera;
