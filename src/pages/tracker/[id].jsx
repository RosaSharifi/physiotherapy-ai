/**
 * Exercise Tracker page
 * Handles motion tracking and feedback for a specific exercise
 */

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { getExerciseById } from '../../data/exercises';
import PoseDetection from '../../components/motionTracking/PoseDetection';
import MotionAnalyzer from '../../components/motionTracking/MotionAnalyzer';
import styles from '../../styles/pages/tracker/ExerciseTracker.module.css';

export default function ExerciseTracker() {
    const router = useRouter();
    const { id } = router.query;
    const [exercise, setExercise] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showInstructions, setShowInstructions] = useState(true);
    const [analysisData, setAnalysisData] = useState(null);
    const [exerciseComplete, setExerciseComplete] = useState(false);

    // Fetch exercise data once we have the ID
    useEffect(() => {
        if (id) {
            try {
                const exerciseData = getExerciseById(id);

                if (exerciseData) {
                    setExercise(exerciseData);
                } else {
                    setError('Exercise not found');
                }
            } catch (err) {
                setError('Failed to load exercise');
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
    }, [id]);

    // Handle pose detection updates
    const handlePoseDetected = useCallback((pose, initialPose, results) => {
        // This function passes pose data to the MotionAnalyzer component
    }, []);

    // Handle analysis updates from MotionAnalyzer
    const handleAnalysisUpdate = useCallback((data) => {
        setAnalysisData(data);

        // Check if exercise is complete (basic implementation, could be more sophisticated)
        if (data.repCount >= 10) {
            setExerciseComplete(true);
        }
    }, []);

    // Handle dismissing the initial instructions
    const handleDismissInstructions = () => {
        setShowInstructions(false);
    };

    // Handle completing the exercise session
    const handleFinishExercise = () => {
        // Could save progress, show summary, etc.
        router.push(`/exercises/${id}?completed=true`);
    };

    // Handle trying again
    const handleTryAgain = () => {
        setExerciseComplete(false);
        // Reset any other state as needed
    };

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.loadingSpinner}></div>
                <p>Loading exercise tracker...</p>
            </div>
        );
    }

    if (error || !exercise) {
        return (
            <div className={styles.errorContainer}>
                <h2 className={styles.errorTitle}>Error</h2>
                <p className={styles.errorMessage}>
                    {error || 'Failed to load the exercise. Please try again.'}
                </p>
                <button
                    className={styles.backButton}
                    onClick={() => router.push('/exercises')}
                >
                    Return to Exercises
                </button>
            </div>
        );
    }

    return (
        <>
            <Head>
                <title>{`${exercise.name} Tracker | AI Physiotherapy`}</title>
                <meta name="description" content={`Motion tracking for ${exercise.name}`} />
            </Head>

            <div className={styles.trackerPage}>
                <header className={styles.trackerHeader}>
                    <h1 className={styles.exerciseName}>{exercise.name}</h1>
                    <button
                        className={styles.exitButton}
                        onClick={() => router.push(`/exercises/${id}`)}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor"/>
                        </svg>
                        Exit
                    </button>
                </header>

                <main className={styles.trackerContent}>
                    <div className={styles.poseDetectionContainer}>
                        <PoseDetection
                            onPoseDetected={handlePoseDetected}
                            showPoseDetection={true}
                            showControls={true}
                        >
                            <MotionAnalyzer
                                exerciseId={id}
                                onAnalysisUpdate={handleAnalysisUpdate}
                                autoStart={!showInstructions}
                                showFeedback={!showInstructions}
                            />
                        </PoseDetection>
                    </div>

                    {showInstructions && (
                        <div className={styles.instructionsOverlay}>
                            <div className={styles.instructionsCard}>
                                <h2 className={styles.instructionsTitle}>Get Ready</h2>
                                <div className={styles.instructionsContent}>
                                    <h3>Starting Position:</h3>
                                    <p>{exercise.startingPosition}</p>

                                    <h3>Key Points:</h3>
                                    <ul className={styles.keyPointsList}>
                                        {exercise.keyPoints.slice(0, 3).map((point, index) => (
                                            <li key={index} className={styles.keyPointItem}>{point}</li>
                                        ))}
                                    </ul>
                                </div>
                                <button
                                    className={styles.startButton}
                                    onClick={handleDismissInstructions}
                                >
                                    Start Exercise
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M8 5v14l11-7z" fill="currentColor"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    )}

                    {exerciseComplete && (
                        <div className={styles.completionOverlay}>
                            <div className={styles.completionCard}>
                                <div className={styles.completionIcon}>
                                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="#4CAF50"/>
                                    </svg>
                                </div>
                                <h2 className={styles.completionTitle}>Exercise Complete!</h2>
                                <div className={styles.statsContainer}>
                                    <div className={styles.statItem}>
                                        <span className={styles.statLabel}>Repetitions</span>
                                        <span className={styles.statValue}>{analysisData?.repCount || 0}</span>
                                    </div>
                                    <div className={styles.statItem}>
                                        <span className={styles.statLabel}>Duration</span>
                                        <span className={styles.statValue}>
                      {Math.floor((analysisData?.summary?.duration || 0) / 1000)} seconds
                    </span>
                                    </div>
                                    <div className={styles.statItem}>
                                        <span className={styles.statLabel}>Performance</span>
                                        <span className={styles.statValue}>
                      {/* Simple performance metric - could be more sophisticated */}
                                            {Object.keys(analysisData?.summary?.errorCounts || {}).length === 0 ?
                                                'Excellent' : 'Good'}
                    </span>
                                    </div>
                                </div>
                                <div className={styles.completionButtons}>
                                    <button
                                        className={styles.tryAgainButton}
                                        onClick={handleTryAgain}
                                    >
                                        Try Again
                                    </button>
                                    <button
                                        className={styles.finishButton}
                                        onClick={handleFinishExercise}
                                    >
                                        Finish Session
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </main>

                {!showInstructions && !exerciseComplete && (
                    <div className={styles.exerciseInfo}>
                        <div className={styles.repCounter}>
                            <span className={styles.repLabel}>Repetitions</span>
                            <span className={styles.repValue}>{analysisData?.repCount || 0}</span>
                        </div>

                        <div className={styles.phaseIndicator}>
                            <span className={styles.phaseLabel}>Current Phase</span>
                            <span className={styles.phaseValue}>
                {analysisData?.exercisePhase
                    ? analysisData.exercisePhase.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
                    : 'Preparing'}
              </span>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
