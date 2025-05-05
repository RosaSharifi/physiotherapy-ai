/**
 * Custom hook for analyzing exercise form and providing feedback
 * Uses the pose data from usePoseDetection and exercise-specific analyzers
 */

import { useState, useEffect, useRef } from 'react';
import {
    getExerciseAnalyzer,
    getPhaseDetector,
    getRepCompletionChecker
} from '../utils/exerciseUtils';

const useExerciseAnalysis = (exerciseId) => {
    // Analysis state
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResults, setAnalysisResults] = useState(null);
    const [exercisePhase, setExercisePhase] = useState('not_started');
    const [repCount, setRepCount] = useState(0);
    const [errors, setErrors] = useState([]);
    const [feedback, setFeedback] = useState(null);

    // History tracking
    const [phaseHistory, setPhaseHistory] = useState([]);
    const [metricsHistory, setMetricsHistory] = useState([]);

    // Performance metrics
    const [currentMetrics, setCurrentMetrics] = useState({});

    // Time tracking
    const lastAnalysisTimeRef = useRef(0);
    const exerciseStartTimeRef = useRef(0);
    const exerciseDurationRef = useRef(0);

    // References for previous data
    const prevPoseRef = useRef(null);
    const prevMetricsRef = useRef(null);

    // Get analyzer functions for the specific exercise
    const analyzerFunction = getExerciseAnalyzer(exerciseId);
    const phaseDetector = getPhaseDetector(exerciseId);
    const repCompletionChecker = getRepCompletionChecker(exerciseId);

    /**
     * Start exercise analysis
     */
    const startAnalysis = () => {
        setIsAnalyzing(true);
        setRepCount(0);
        setErrors([]);
        setFeedback(null);
        setPhaseHistory(['not_started']);
        setMetricsHistory([]);
        setExercisePhase('starting');
        exerciseStartTimeRef.current = Date.now();
        exerciseDurationRef.current = 0;
    };

    /**
     * Stop exercise analysis
     */
    const stopAnalysis = () => {
        setIsAnalyzing(false);
        exerciseDurationRef.current = Date.now() - exerciseStartTimeRef.current;
    };

    /**
     * Reset exercise analysis
     */
    const resetAnalysis = () => {
        stopAnalysis();
        setRepCount(0);
        setErrors([]);
        setFeedback(null);
        setPhaseHistory(['not_started']);
        setMetricsHistory([]);
        setExercisePhase('not_started');
        setAnalysisResults(null);
        prevPoseRef.current = null;
        prevMetricsRef.current = null;
    };

    /**
     * Analyze pose for exercise form
     */
    const analyzePose = (currentPose, initialPose, rawResults) => {
        if (!isAnalyzing || !analyzerFunction || !currentPose || !initialPose) {
            return;
        }

        try {
            const now = Date.now();
            const timeDelta = now - lastAnalysisTimeRef.current;
            lastAnalysisTimeRef.current = now;

            // Only analyze every 100ms to avoid overwhelming updates
            if (timeDelta < 100) {
                return;
            }

            // Perform analysis with current and previous data
            const results = analyzerFunction(
                currentPose,
                initialPose,
                prevPoseRef.current,
                timeDelta
            );

            // Store current pose as previous for next analysis
            prevPoseRef.current = currentPose;

            // Update analysis results
            setAnalysisResults(results);

            // Update current metrics
            if (results.metrics) {
                setCurrentMetrics(results.metrics);
                prevMetricsRef.current = results.metrics;

                // Add to metrics history (keep last 10)
                setMetricsHistory(prev => {
                    const updated = [...prev, results.metrics];
                    return updated.slice(-10);
                });
            }

            // Update errors state with any detected form issues
            if (results.errors && results.errors.length > 0) {
                setErrors(results.errors);

                // Set feedback for the most severe error
                const sortedErrors = [...results.errors].sort((a, b) => {
                    const severityRank = { high: 3, medium: 2, low: 1 };
                    return severityRank[b.severity] - severityRank[a.severity];
                });

                setFeedback(sortedErrors[0]);
            } else {
                setErrors([]);
                setFeedback(null);
            }

            // Detect exercise phase if phase detector available
            if (phaseDetector && results.metrics) {
                const phase = phaseDetector(results.metrics, prevMetricsRef.current);

                // Only update phase if it's changed
                if (phase !== exercisePhase) {
                    setExercisePhase(phase);

                    // Add to phase history (keep last 20)
                    setPhaseHistory(prev => {
                        const updated = [...prev, phase];
                        return updated.slice(-20);
                    });
                }
            }

            // Check if a rep has been completed
            if (repCompletionChecker && exercisePhase) {
                const isRepComplete = repCompletionChecker(exercisePhase, phaseHistory);

                if (isRepComplete) {
                    setRepCount(prev => prev + 1);

                    // Clear errors on successful rep
                    setErrors([]);
                    setFeedback({
                        type: 'success',
                        message: 'Good job! Rep completed correctly.',
                        severity: 'low'
                    });
                }
            }
        } catch (err) {
            console.error('Exercise analysis error:', err);
        }
    };

    /**
     * Get summary of exercise performance
     */
    const getExerciseSummary = () => {
        const duration = exerciseDurationRef.current;

        return {
            exerciseId,
            repCount,
            duration,
            averageTimePerRep: repCount > 0 ? duration / repCount : 0,
            errorCounts: errors.reduce((counts, error) => {
                counts[error.type] = (counts[error.type] || 0) + 1;
                return counts;
            }, {}),
            completed: repCount > 0
        };
    };

    return {
        isAnalyzing,
        exercisePhase,
        repCount,
        errors,
        feedback,
        currentMetrics,
        phaseHistory,
        metricsHistory,
        startAnalysis,
        stopAnalysis,
        resetAnalysis,
        analyzePose,
        getExerciseSummary
    };
};

export default useExerciseAnalysis;
