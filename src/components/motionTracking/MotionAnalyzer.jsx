/**
 * MotionAnalyzer component for analyzing exercise form and providing feedback
 * Uses the useExerciseAnalysis hook to analyze pose data for a specific exercise
 */

import React, {useEffect, useState} from 'react';
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
                            children
                        }) => {
    const [exerciseActive, setExerciseActive] = useState(autoStart);

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

    // Start analysis when component mounts if autoStart is true
    useEffect(() => {
        if (autoStart && !isAnalyzing) {
            startAnalysis();
        }

        return () => {
            if (isAnalyzing) {
                stopAnalysis();
            }
        };
    }, [autoStart, isAnalyzing, startAnalysis, stopAnalysis]);

    // Analyze pose when it changes
    useEffect(() => {
        if (isAnalyzing && pose && initialPose) {
            analyzePose(pose, initialPose);
        }
    }, [isAnalyzing, pose, initialPose, analyzePose]);

    // Notify parent component of analysis updates
    useEffect(() => {
        if (onAnalysisUpdate) {
            onAnalysisUpdate({
                exercisePhase,
                repCount,
                errors,
                feedback,
                currentMetrics,
                isAnalyzing,
                summary: getExerciseSummary()
            });
        }
    }, [
        exercisePhase,
        repCount,
        errors,
        feedback,
        currentMetrics,
        isAnalyzing,
        onAnalysisUpdate,
        getExerciseSummary
    ]);

    // Toggle exercise analysis
    const toggleExercise = () => {
        if (isAnalyzing) {
            stopAnalysis();
            setExerciseActive(false);
        } else {
            resetAnalysis();
            startAnalysis();
            setExerciseActive(true);
        }
    };

    // Reset exercise
    const handleReset = () => {
        resetAnalysis();
        if (exerciseActive) {
            startAnalysis();
        }
    };

    return (
        <div className={styles.motionAnalyzerContainer}>
            {children && (
                <div className={styles.childrenContainer}>
                    {React.Children.map(children, child => {
                        // Pass analysis data to children
                        return React.cloneElement(child, {
                            exercisePhase,
                            repCount,
                            errors,
                            feedback,
                            currentMetrics,
                            isAnalyzing
                        });
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
                                <rect x="6" y="6" width="12" height="12" rx="1" fill="currentColor"/>
                            </svg>
                            <span>Stop Exercise</span>
                        </>
                    ) : (
                        <>
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8 5V19L19 12L8 5Z" fill="currentColor"/>
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
                        <path
                            d="M17.65 6.35C16.2 4.9 14.2 4 12 4C7.58 4 4 7.58 4 12C4 16.42 7.58 20 12 20C15.73 20 18.84 17.45 19.73 14H17.65C16.83 16.33 14.61 18 12 18C8.69 18 6 15.31 6 12C6 8.69 8.69 6 12 6C13.66 6 15.14 6.69 16.22 7.78L13 11H20V4L17.65 6.35Z"
                            fill="currentColor"/>
                    </svg>
                    <span>Reset</span>
                </button>
            </div>
        </div>
    );
};

export default MotionAnalyzer;
