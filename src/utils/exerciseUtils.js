/**
 * Exercise-specific utility functions for analyzing form and providing feedback
 * These functions build on the pose utilities to implement exercise-specific logic
 */

import {
    calculateHeadRotation,
    areShoulderElevated,
    isHeadTilted,
    calculateMovementSpeed,
    calculateDistance
} from './poseUtils';

/**
 * Analyze neck rotation exercise form
 * @param {Object} currentPose - Current pose points
 * @param {Object} initialPose - Initial/reference pose points
 * @param {Object} prevPose - Previous frame's pose points
 * @param {number} timeDelta - Time between frames in ms
 * @returns {Object} - Analysis results with errors and metrics
 */
export const analyzeNeckRotation = (currentPose, initialPose, prevPose, timeDelta) => {
    if (!currentPose || !initialPose) {
        return {
            isValid: false,
            errors: [],
            metrics: {}
        };
    }

    const errors = [];
    const metrics = {};

    // Extract relevant points
    const { nose, leftEar, rightEar, leftShoulder, rightShoulder } = currentPose;

    // Calculate head rotation angle
    const rotationAngle = calculateHeadRotation(nose, leftEar, rightEar);
    metrics.rotationAngle = rotationAngle;

    // Determine rotation direction
    if (rotationAngle > 5) {
        metrics.direction = 'right';
    } else if (rotationAngle < -5) {
        metrics.direction = 'left';
    } else {
        metrics.direction = 'center';
    }

    // Check if shoulders are elevated
    const shouldersElevated = areShoulderElevated(
        leftShoulder,
        rightShoulder,
        leftEar,
        rightEar,
        initialPose
    );

    if (shouldersElevated) {
        errors.push({
            type: 'shoulder_elevation',
            message: 'Keep your shoulders relaxed and down',
            severity: 'medium'
        });
    }

    // Check if head is tilted
    const headTilted = isHeadTilted(leftEar, rightEar, leftShoulder, rightShoulder);

    if (headTilted) {
        errors.push({
            type: 'head_tilt',
            message: 'Keep your head level, rotate horizontally only',
            severity: 'high'
        });
    }

    // Check movement speed if we have previous pose data
    if (prevPose && timeDelta) {
        const noseSpeed = calculateMovementSpeed(nose, prevPose.nose, timeDelta);
        metrics.movementSpeed = noseSpeed;

        // If movement speed is too high (threshold determined experimentally)
        if (noseSpeed > 0.5) {
            errors.push({
                type: 'speed_too_fast',
                message: 'Slow down, move more gradually',
                severity: 'medium'
            });
        }
    }

    // Calculate progress metrics (how far the rotation has gone)
    if (metrics.direction === 'right') {
        // Map rotation angle to percentage (typical max rotation ~45-60 degrees)
        metrics.rightProgress = Math.min(100, Math.abs(rotationAngle) * 2);
    } else if (metrics.direction === 'left') {
        metrics.leftProgress = Math.min(100, Math.abs(rotationAngle) * 2);
    }

    return {
        isValid: errors.length === 0,
        errors,
        metrics
    };
};

/**
 * Determine the current phase of the neck rotation exercise
 * @param {Object} metrics - Current exercise metrics
 * @param {Object} prevMetrics - Previous exercise metrics
 * @returns {string} - Current exercise phase
 */
export const getNeckRotationPhase = (metrics, prevMetrics) => {
    if (!metrics) return 'unknown';

    // If starting or returning to center
    if (metrics.direction === 'center') {
        return 'center_position';
    }

    // If rotating to the right
    if (metrics.direction === 'right') {
        // Check if we're moving toward or away from right rotation
        if (prevMetrics && prevMetrics.rotationAngle && metrics.rotationAngle > prevMetrics.rotationAngle) {
            return 'rotating_right';
        } else if (prevMetrics && prevMetrics.rotationAngle && metrics.rotationAngle < prevMetrics.rotationAngle) {
            return 'returning_from_right';
        }
        return 'right_position';
    }

    // If rotating to the left
    if (metrics.direction === 'left') {
        // Check if we're moving toward or away from left rotation
        if (prevMetrics && prevMetrics.rotationAngle && metrics.rotationAngle < prevMetrics.rotationAngle) {
            return 'rotating_left';
        } else if (prevMetrics && prevMetrics.rotationAngle && metrics.rotationAngle > prevMetrics.rotationAngle) {
            return 'returning_from_left';
        }
        return 'left_position';
    }

    return 'unknown';
};

/**
 * Check if exercise rep is complete
 * @param {string} currentPhase - Current exercise phase
 * @param {Array} phaseHistory - History of exercise phases
 * @returns {boolean} - True if rep is complete
 */
export const isNeckRotationRepComplete = (currentPhase, phaseHistory) => {
    if (!phaseHistory || phaseHistory.length < 5) return false;

    // A complete rep pattern: center -> right -> center -> left -> center
    const lastPhases = phaseHistory.slice(-5);
    const completePattern = [
        'center_position',
        'rotating_right',
        'right_position',
        'returning_from_right',
        'center_position',
        'rotating_left',
        'left_position',
        'returning_from_left',
        'center_position'
    ];

    // Check if the last phases match any segment of the complete pattern in order
    for (let i = 0; i <= completePattern.length - lastPhases.length; i++) {
        const patternSegment = completePattern.slice(i, i + lastPhases.length);
        if (patternSegment.every((phase, index) => phase === lastPhases[index])) {
            return true;
        }
    }

    return false;
};

/**
 * Get exercise-specific analysis function based on exercise ID
 * @param {string} exerciseId - ID of the exercise
 * @returns {Function} - Analysis function for that exercise
 */
export const getExerciseAnalyzer = (exerciseId) => {
    const analyzers = {
        'neck-rotation': analyzeNeckRotation
        // Add more exercise analyzers as they are implemented
    };

    return analyzers[exerciseId] || null;
};

/**
 * Get phase detection function for a specific exercise
 * @param {string} exerciseId - ID of the exercise
 * @returns {Function} - Phase detection function
 */
export const getPhaseDetector = (exerciseId) => {
    const phaseDetectors = {
        'neck-rotation': getNeckRotationPhase
        // Add more phase detectors as they are implemented
    };

    return phaseDetectors[exerciseId] || null;
};

/**
 * Get rep completion checker function for a specific exercise
 * @param {string} exerciseId - ID of the exercise
 * @returns {Function} - Rep completion checker function
 */
export const getRepCompletionChecker = (exerciseId) => {
    const repCheckers = {
        'neck-rotation': isNeckRotationRepComplete
        // Add more rep checkers as they are implemented
    };

    return repCheckers[exerciseId] || null;
};
