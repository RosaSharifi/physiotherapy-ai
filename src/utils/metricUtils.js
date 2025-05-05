/**
 * Utilities for calculating exercise metrics and generating performance summaries
 * Helps analyze exercise performance and provide meaningful feedback
 */

/**
 * Calculate the average time per repetition
 * @param {number} totalDuration - Total exercise duration in milliseconds
 * @param {number} repCount - Number of repetitions completed
 * @returns {number} - Average time per rep in seconds
 */
export const calculateAverageTimePerRep = (totalDuration, repCount) => {
    if (!repCount || repCount === 0) return 0;
    return (totalDuration / 1000) / repCount; // Convert ms to seconds
};

/**
 * Calculate overall form score based on error frequency
 * @param {Object} errorCounts - Count of different error types
 * @param {number} repCount - Number of repetitions completed
 * @returns {number} - Score from 0-100
 */
export const calculateFormScore = (errorCounts, repCount) => {
    if (!errorCounts || !repCount || repCount === 0) return 100;

    // Calculate total errors
    const totalErrors = Object.values(errorCounts).reduce((sum, count) => sum + count, 0);

    // Weight by severity if available
    let weightedErrors = 0;
    let errorTypes = 0;

    for (const [errorType, count] of Object.entries(errorCounts)) {
        errorTypes++;

        // Apply severity weights if severity info is available
        // Default to medium severity (weight 1.0)
        const severityWeight = getSeverityWeight(errorType);
        weightedErrors += count * severityWeight;
    }

    // Calculate base score (100 is perfect)
    // Each error reduces score based on severity and frequency relative to rep count
    const maxPossibleScore = 100;
    const errorPenaltyPerRep = weightedErrors / repCount;

    // Cap penalty at 100 to avoid negative scores
    const totalPenalty = Math.min(100, errorPenaltyPerRep * 10);

    return Math.round(maxPossibleScore - totalPenalty);
};

/**
 * Get weight for error severity
 * @param {string} errorType - Type of error
 * @returns {number} - Weight factor based on severity
 */
const getSeverityWeight = (errorType) => {
    const severityMap = {
        // Neck rotation specific errors
        'shoulder_elevation': 1.2,
        'head_tilt': 1.5,
        'speed_too_fast': 0.8,

        // Default for unknown errors
        'default': 1.0
    };

    return severityMap[errorType] || severityMap.default;
};

/**
 * Get performance level based on form score
 * @param {number} formScore - Form score (0-100)
 * @returns {string} - Performance level description
 */
export const getPerformanceLevel = (formScore) => {
    if (formScore >= 90) return 'Excellent';
    if (formScore >= 75) return 'Good';
    if (formScore >= 60) return 'Average';
    if (formScore >= 40) return 'Needs Improvement';
    return 'Poor';
};

/**
 * Generate improvement suggestions based on error types
 * @param {Object} errorCounts - Count of different error types
 * @returns {Array} - Array of improvement suggestions
 */
export const generateImprovementSuggestions = (errorCounts) => {
    if (!errorCounts) return [];

    const suggestions = [];

    // Suggestion map for different error types
    const suggestionMap = {
        // Neck rotation specific errors
        'shoulder_elevation': 'Focus on keeping your shoulders relaxed and down throughout the exercise.',
        'head_tilt': 'Keep your head level during the rotation - imagine a book balanced on top of your head.',
        'speed_too_fast': 'Slow down your movements. Aim for a smooth, controlled pace rather than quick jerky motions.'
    };

    // Add suggestions for each error type encountered
    for (const errorType of Object.keys(errorCounts)) {
        if (suggestionMap[errorType]) {
            suggestions.push(suggestionMap[errorType]);
        }
    }

    // Add generic suggestions if few specific ones
    if (suggestions.length < 2) {
        suggestions.push('Practice in front of a mirror to better visualize your form.');
    }

    return suggestions;
};

/**
 * Generate a comprehensive exercise performance summary
 * @param {Object} analysisData - Data from exercise analysis
 * @returns {Object} - Formatted performance summary
 */
export const generatePerformanceSummary = (analysisData) => {
    if (!analysisData || !analysisData.summary) {
        return {
            repCount: 0,
            duration: 0,
            formScore: 100,
            performanceLevel: 'Not Available',
            averageTimePerRep: 0,
            errorFrequency: {},
            improvementSuggestions: ['No exercise data available'],
            completed: false
        };
    }

    const { repCount, duration, errorCounts, completed } = analysisData.summary;

    // Calculate derived metrics
    const formScore = calculateFormScore(errorCounts, repCount);
    const performanceLevel = getPerformanceLevel(formScore);
    const averageTimePerRep = calculateAverageTimePerRep(duration, repCount);

    // Get improvement suggestions
    const improvementSuggestions = generateImprovementSuggestions(errorCounts);

    // Calculate error frequency (percentage of reps with each error type)
    const errorFrequency = {};
    if (repCount > 0) {
        for (const [errorType, count] of Object.entries(errorCounts)) {
            errorFrequency[errorType] = Math.round((count / repCount) * 100);
        }
    }

    return {
        repCount,
        duration,
        formScore,
        performanceLevel,
        averageTimePerRep,
        errorFrequency,
        improvementSuggestions,
        completed
    };
};

/**
 * Format seconds into a readable time string (MM:SS)
 * @param {number} seconds - Time in seconds
 * @returns {string} - Formatted time string
 */
export const formatTime = (seconds) => {
    if (!seconds) return '00:00';

    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);

    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Generate a summary message based on performance
 * @param {Object} summary - Performance summary object
 * @returns {string} - Summary message
 */
export const generateSummaryMessage = (summary) => {
    if (!summary || !summary.completed) {
        return 'Exercise session incomplete. Try completing at least one repetition.';
    }

    const { performanceLevel, repCount, formScore } = summary;

    if (performanceLevel === 'Excellent') {
        return `Great job! You completed ${repCount} repetitions with excellent form (${formScore}%).`;
    } else if (performanceLevel === 'Good') {
        return `Good work! You completed ${repCount} repetitions with good form (${formScore}%).`;
    } else if (performanceLevel === 'Average') {
        return `You completed ${repCount} repetitions with average form (${formScore}%). There's room for improvement.`;
    } else {
        return `You completed ${repCount} repetitions, but your form needs improvement (${formScore}%). Focus on the suggestions below.`;
    }
};
