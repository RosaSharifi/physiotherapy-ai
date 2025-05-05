/**
 * Storage service for managing exercise progress data
 * Handles saving, loading, and managing user exercise history
 */

// Prefix for all storage keys to avoid conflicts
const STORAGE_PREFIX = 'physio_tracker_';

// Key for the exercise history
const EXERCISE_HISTORY_KEY = `${STORAGE_PREFIX}exercise_history`;

/**
 * Save exercise session data to local storage
 * @param {Object} sessionData - Exercise session data to save
 * @returns {boolean} - Success status
 */
export const saveExerciseSession = (sessionData) => {
    try {
        if (!sessionData || !sessionData.exerciseId) {
            console.error('Invalid session data provided');
            return false;
        }

        // Ensure sessionData has required fields
        const validatedData = {
            ...sessionData,
            timestamp: sessionData.timestamp || Date.now(),
            id: generateSessionId(),
        };

        // Load existing history
        const history = loadExerciseHistory();

        // Add new session
        history.push(validatedData);

        // Save updated history
        localStorage.setItem(EXERCISE_HISTORY_KEY, JSON.stringify(history));

        return true;
    } catch (error) {
        console.error('Failed to save exercise session:', error);
        return false;
    }
};

/**
 * Load all exercise session history
 * @returns {Array} - Array of exercise sessions
 */
export const loadExerciseHistory = () => {
    try {
        const historyJson = localStorage.getItem(EXERCISE_HISTORY_KEY);
        return historyJson ? JSON.parse(historyJson) : [];
    } catch (error) {
        console.error('Failed to load exercise history:', error);
        return [];
    }
};

/**
 * Get history for a specific exercise
 * @param {string} exerciseId - ID of the exercise
 * @returns {Array} - Array of exercise sessions for the specified exercise
 */
export const getExerciseHistory = (exerciseId) => {
    const history = loadExerciseHistory();
    return history.filter(session => session.exerciseId === exerciseId);
};

/**
 * Clear all exercise history
 * @returns {boolean} - Success status
 */
export const clearExerciseHistory = () => {
    try {
        localStorage.removeItem(EXERCISE_HISTORY_KEY);
        return true;
    } catch (error) {
        console.error('Failed to clear exercise history:', error);
        return false;
    }
};

/**
 * Delete a specific exercise session
 * @param {string} sessionId - ID of the session to delete
 * @returns {boolean} - Success status
 */
export const deleteExerciseSession = (sessionId) => {
    try {
        const history = loadExerciseHistory();
        const updatedHistory = history.filter(session => session.id !== sessionId);

        // Check if any session was removed
        if (history.length === updatedHistory.length) {
            return false; // No session found with this ID
        }

        // Save updated history
        localStorage.setItem(EXERCISE_HISTORY_KEY, JSON.stringify(updatedHistory));
        return true;
    } catch (error) {
        console.error('Failed to delete exercise session:', error);
        return false;
    }
};

/**
 * Generate a unique session ID
 * @returns {string} - Unique session ID
 */
const generateSessionId = () => {
    return `session_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
};

/**
 * Get user's best performance for a specific exercise
 * @param {string} exerciseId - ID of the exercise
 * @returns {Object|null} - Best session data or null if no sessions exist
 */
export const getBestPerformance = (exerciseId) => {
    const history = getExerciseHistory(exerciseId);

    if (history.length === 0) {
        return null;
    }

    // Sort by form score (descending)
    return [...history].sort((a, b) =>
        (b.formScore || 0) - (a.formScore || 0)
    )[0];
};

/**
 * Calculate overall progress for an exercise
 * @param {string} exerciseId - ID of the exercise
 * @returns {Object} - Progress statistics
 */
export const calculateExerciseProgress = (exerciseId) => {
    const history = getExerciseHistory(exerciseId);

    if (history.length === 0) {
        return {
            sessionsCompleted: 0,
            totalReps: 0,
            averageFormScore: 0,
            formScoreProgress: [],
            recentTrend: 'none'
        };
    }

    // Sort history by timestamp
    const sortedHistory = [...history].sort((a, b) => a.timestamp - b.timestamp);

    // Calculate statistics
    const totalReps = sortedHistory.reduce((sum, session) => sum + (session.repCount || 0), 0);

    const formScores = sortedHistory.map(session => session.formScore || 0);
    const averageFormScore = formScores.reduce((sum, score) => sum + score, 0) / formScores.length;

    // Get form score progress over time
    const formScoreProgress = sortedHistory.map(session => ({
        timestamp: session.timestamp,
        score: session.formScore || 0
    }));

    // Determine recent trend (improving, stable, declining)
    let recentTrend = 'none';
    if (formScores.length >= 3) {
        const recentScores = formScores.slice(-3);
        if (recentScores[2] > recentScores[0]) {
            recentTrend = 'improving';
        } else if (recentScores[2] < recentScores[0]) {
            recentTrend = 'declining';
        } else {
            recentTrend = 'stable';
        }
    }

    return {
        sessionsCompleted: history.length,
        totalReps,
        averageFormScore,
        formScoreProgress,
        recentTrend
    };
};

/**
 * Check if storage is available
 * @returns {boolean} - True if storage is available
 */
export const isStorageAvailable = () => {
    try {
        const testKey = `${STORAGE_PREFIX}test`;
        localStorage.setItem(testKey, 'test');
        localStorage.removeItem(testKey);
        return true;
    } catch (e) {
        return false;
    }
};
