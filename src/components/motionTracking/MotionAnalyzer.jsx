/**
 * MotionAnalyzer component for analyzing exercise form and providing feedback
 */

import React, { useEffect, useState, useCallback, useRef } from 'react';
import useExerciseAnalysis from '../../hooks/useExerciseAnalysis';
import FeedbackDisplay from './FeedbackDisplay';
import styles from '../../styles/components/motionTracking/MotionAnalyzer.module.css';

const MotionAnalyzer = ({
                            exerciseId,
                            pose,
                            initialPose,
                            onAnalysisUpdate,
                            autoStart = true,
                            showFeedback = true,
                            forceInitPoseDetection,
                            children
                        }) => {
    const [exerciseActive, setExerciseActive] = useState(autoStart);

    // Use refs for tracking state without triggering re-renders
    const autoStartAppliedRef = useRef(false);
    const updateScheduledRef = useRef(false);
    const updateTimerRef = useRef(null);
    const lastAnalysisDataRef = useRef(null);

    // Use refs to prevent excessive updates
    const poseRef = useRef(pose);
    const initialPoseRef = useRef(initialPose);
    const updateCallbackRef = useRef(onAnalysisUpdate);

    // Update refs when props change, without causing re-renders
    useEffect(() => {
        poseRef.current = pose;
        initialPoseRef.current = initialPose;
        updateCallbackRef.current = onAnalysisUpdate;
    }, [pose, initialPose, onAnalysisUpdate]);

    // Initialize exercise analysis hook
    const {
        isAnalyzing,
        exercisePhase,
        repCount,
        errors,
        feedback,
        currentMetrics,
        startAnalysis,
        stopAnalysis,
        resetAnalysis,
        analyzePose,
        getExerciseSummary
    } = useExerciseAnalysis(exerciseId);

    // Safely notify parent of analysis updates with debouncing
    const notifyParentOfUpdate = useCallback(() => {
        if (updateScheduledRef.current || !updateCallbackRef.current) return;

        updateScheduledRef.current = true;

        // Clear any existing timer
        if (updateTimerRef.current) {
            clearTimeout(updateTimerRef.current);
        }

        // Schedule update with debounce
        updateTimerRef.current = setTimeout(() => {
            const analysisData = {
                exercisePhase,
                repCount,
                errors,
                feedback,
                currentMetrics,
                isAnalyzing,
                summary: getExerciseSummary()
            };

            // Only update if data has changed
            if (JSON.stringify(analysisData) !== JSON.stringify(lastAnalysisDataRef.current)) {
                lastAnalysisDataRef.current = analysisData;
                updateCallbackRef.current(analysisData);
            }

            updateScheduledRef.current = false;
        }, 250); // Debounce for 250ms
    }, [exercisePhase, repCount, errors, feedback, currentMetrics, isAnalyzing, getExerciseSummary]);

    // Apply auto-start ONCE when component mounts
    useEffect(() => {
        // Only run this once
        if (autoStart && !autoStartAppliedRef.current && !isAnalyzing) {
            console.log("Auto-starting exercise analysis (once)");
            autoStartAppliedRef.current = true;

            // Delay to avoid render loop
            const timer = setTimeout(() => {
                startAnalysis();
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, [autoStart, isAnalyzing, startAnalysis]);

    // Analyze pose when pose changes and we're analyzing
    useEffect(() => {
        // Need a separate effect for pose analysis to prevent loops
        let analyzeInterval = null;

        if (isAnalyzing) {
            // Instead of directly responding to pose changes, use an interval
            // This prevents excessive updates while still keeping analysis responsive
            analyzeInterval = setInterval(() => {
                if (poseRef.current && initialPoseRef.current) {
                    analyzePose(poseRef.current, initialPoseRef.current);
                }
            }, 100); // 10 fps is plenty for exercise analysis
        }

        return () => {
            if (analyzeInterval) {
                clearInterval(analyzeInterval);
            }
        };
    }, [isAnalyzing, analyzePose]);

    // Notify parent of updates in a separate effect
    useEffect(() => {
        // This runs after data changes, but debounced through the notifyParentOfUpdate function
        if (isAnalyzing) {
            notifyParentOfUpdate();
        }
    }, [exercisePhase, repCount, errors, feedback, currentMetrics, isAnalyzing, notifyParentOfUpdate]);

    // Toggle exercise analysis
    const toggleExercise = useCallback(() => {
        console.log("Toggle exercise, current state:", isAnalyzing);

        // Try to force pose detection initialization first if needed
        if (forceInitPoseDetection && !poseRef.current) {
            console.log("Attempting to force init pose detection before starting exercise");
            forceInitPoseDetection();
            // Delay starting analysis to give pose detection time to initialize
            setTimeout(() => {
                if (!isAnalyzing) {
                    console.log("Starting analysis after forced initialization");
                    resetAnalysis();
                    startAnalysis();
                    setExerciseActive(true);
                }
            }, 1500); // Give it 1.5 seconds to initialize
            return;
        }

        if (isAnalyzing) {
            stopAnalysis();
            setExerciseActive(false);
        } else {
            // Ensure we're not triggering multiple starts
            resetAnalysis();
            // Slight delay to prevent state collision
            setTimeout(() => {
                startAnalysis();
                setExerciseActive(true);
            }, 50);
        }
    }, [isAnalyzing, stopAnalysis, resetAnalysis, startAnalysis, forceInitPoseDetection]);

    // Reset exercise
    const handleReset = useCallback(() => {
        resetAnalysis();
        // Add delay before starting again
        if (exerciseActive) {
            setTimeout(() => {
                startAnalysis();
            }, 300);
        }
    }, [exerciseActive, resetAnalysis, startAnalysis]);

    return (
        <div className={styles.motionAnalyzerContainer}>
            {children && (
                <div className={styles.childrenContainer}>
                    {React.Children.map(children, child => {
                        // Pass analysis data to children if they're valid elements
                        if (React.isValidElement(child)) {
                            return React.cloneElement(child, {
                                exercisePhase,
                                repCount,
                                errors,
                                feedback,
                                currentMetrics,
                                isAnalyzing
                            });
                        }
                        return child;
                    })}
                </div>
            )}

            {showFeedback && (
                <FeedbackDisplay
                    exercisePhase={exercisePhase}
                    repCount={repCount}
                    feedback={feedback}
                    currentMetrics={currentMetrics}
                />
            )}

            <div className={styles.controlsContainer}>
                <button
                    className={`${styles.controlButton} ${isAnalyzing ? styles.stopButton : styles.startButton}`}
                    onClick={toggleExercise}
                >
                    {isAnalyzing ? (
                        <>
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="6" y="6" width="12" height="12" rx="1" fill="currentColor" />
                            </svg>
                            <span>Stop Exercise</span>
                        </>
                    ) : (
                        <>
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8 5V19L19 12L8 5Z" fill="currentColor" />
                            </svg>
                            <span>Start Exercise</span>
                        </>
                    )}
                </button>

                <button
                    className={styles.resetButton}
                    onClick={handleReset}
                >
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.65 6.35C16.2 4.9 14.2 4 12 4C7.58 4 4 7.58 4 12C4 16.42 7.58 20 12 20C15.73 20 18.84 17.45 19.73 14H17.65C16.83 16.33 14.61 18 12 18C8.69 18 6 15.31 6 12C6 8.69 8.69 6 12 6C13.66 6 15.14 6.69 16.22 7.78L13 11H20V4L17.65 6.35Z" fill="currentColor" />
                    </svg>
                    <span>Reset</span>
                </button>
            </div>
        </div>
    );
};

export default MotionAnalyzer;
