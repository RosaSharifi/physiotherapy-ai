/**
 * Utility functions for pose detection and analysis
 * These functions help with calculating angles, distances, and movement patterns
 * between body landmarks detected by MediaPipe
 */

/**
 * Calculate the angle between three points
 * @param {Object} a - First point {x, y}
 * @param {Object} b - Middle point (vertex) {x, y}
 * @param {Object} c - Third point {x, y}
 * @returns {number} - Angle in degrees
 */
export const calculateAngle = (a, b, c) => {
    if (!a || !b || !c) return 0;

    // Calculate vectors
    const vectorAB = { x: b.x - a.x, y: b.y - a.y };
    const vectorBC = { x: c.x - b.x, y: c.y - b.y };

    // Calculate dot product
    const dotProduct = vectorAB.x * vectorBC.x + vectorAB.y * vectorBC.y;

    // Calculate magnitudes
    const magnitudeAB = Math.sqrt(vectorAB.x * vectorAB.x + vectorAB.y * vectorAB.y);
    const magnitudeBC = Math.sqrt(vectorBC.x * vectorBC.x + vectorBC.y * vectorBC.y);

    // Calculate angle in radians and convert to degrees
    const angle = Math.acos(dotProduct / (magnitudeAB * magnitudeBC)) * (180 / Math.PI);

    return angle;
};

/**
 * Calculate distance between two points
 * @param {Object} a - First point {x, y}
 * @param {Object} b - Second point {x, y}
 * @returns {number} - Distance between points
 */
export const calculateDistance = (a, b) => {
    if (!a || !b) return 0;
    return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
};

/**
 * Check if a body part has moved significantly from its starting position
 * @param {Object} current - Current position {x, y}
 * @param {Object} initial - Initial position {x, y}
 * @param {number} threshold - Movement threshold
 * @returns {boolean} - True if significant movement detected
 */
export const hasMovedSignificantly = (current, initial, threshold = 0.05) => {
    if (!current || !initial) return false;
    const distance = calculateDistance(current, initial);
    return distance > threshold;
};

/**
 * Calculate rotation angle of the head (for neck rotation exercise)
 * @param {Object} nose - Nose landmark {x, y}
 * @param {Object} leftEar - Left ear landmark {x, y}
 * @param {Object} rightEar - Right ear landmark {x, y}
 * @returns {number} - Rotation angle in degrees (positive for right, negative for left)
 */
export const calculateHeadRotation = (nose, leftEar, rightEar) => {
    if (!nose || !leftEar || !rightEar) return 0;

    // Calculate distances from nose to each ear
    const noseToLeftEar = calculateDistance(nose, leftEar);
    const noseToRightEar = calculateDistance(nose, rightEar);

    // Calculate ear-to-ear distance for normalization
    const earToEar = calculateDistance(leftEar, rightEar);

    // Calculate normalized ratio difference
    const normalizedDifference = (noseToLeftEar - noseToRightEar) / earToEar;

    // Convert to approximate degrees (calibration factor determined experimentally)
    const rotationAngle = normalizedDifference * 90;

    return rotationAngle;
};

/**
 * Detect if shoulders are elevated (for neck exercises)
 * @param {Object} leftShoulder - Left shoulder landmark {x, y}
 * @param {Object} rightShoulder - Right shoulder landmark {x, y}
 * @param {Object} leftEar - Left ear landmark {x, y}
 * @param {Object} rightEar - Right ear landmark {x, y}
 * @param {Object} initialPositions - Initial landmark positions
 * @returns {boolean} - True if shoulders are elevated
 */
export const areShoulderElevated = (leftShoulder, rightShoulder, leftEar, rightEar, initialPositions) => {
    if (!leftShoulder || !rightShoulder || !leftEar || !rightEar || !initialPositions) return false;

    // Calculate current ear-to-shoulder distances
    const leftEarToShoulder = calculateDistance(leftEar, leftShoulder);
    const rightEarToShoulder = calculateDistance(rightEar, rightShoulder);

    // Calculate initial ear-to-shoulder distances
    const initialLeftEarToShoulder = calculateDistance(
        initialPositions.leftEar,
        initialPositions.leftShoulder
    );
    const initialRightEarToShoulder = calculateDistance(
        initialPositions.rightEar,
        initialPositions.rightShoulder
    );

    // Calculate elevation percentage
    const leftElevationRatio = leftEarToShoulder / initialLeftEarToShoulder;
    const rightElevationRatio = rightEarToShoulder / initialRightEarToShoulder;

    // If either shoulder is more than 15% closer to ear, consider it elevated
    return leftElevationRatio < 0.85 || rightElevationRatio < 0.85;
};

/**
 * Detect if head is tilted (for neck rotation exercise)
 * @param {Object} leftEar - Left ear landmark {x, y}
 * @param {Object} rightEar - Right ear landmark {x, y}
 * @param {Object} leftShoulder - Left shoulder landmark {x, y}
 * @param {Object} rightShoulder - Right shoulder landmark {x, y}
 * @returns {boolean} - True if head is tilted
 */
export const isHeadTilted = (leftEar, rightEar, leftShoulder, rightShoulder) => {
    if (!leftEar || !rightEar || !leftShoulder || !rightShoulder) return false;

    // Calculate ear line angle relative to horizontal
    const earLineAngle = Math.atan2(rightEar.y - leftEar.y, rightEar.x - leftEar.x) * (180 / Math.PI);

    // Calculate shoulder line angle relative to horizontal
    const shoulderLineAngle = Math.atan2(rightShoulder.y - leftShoulder.y, rightShoulder.x - leftShoulder.x) * (180 / Math.PI);

    // Calculate the difference between the two angles
    const angleDifference = Math.abs(earLineAngle - shoulderLineAngle);

    // If difference is greater than 10 degrees, consider head tilted
    return angleDifference > 10;
};

/**
 * Calculate movement speed between frames
 * @param {Object} current - Current position {x, y}
 * @param {Object} previous - Previous position {x, y}
 * @param {number} timeDelta - Time between frames in ms
 * @returns {number} - Speed in units per second
 */
export const calculateMovementSpeed = (current, previous, timeDelta) => {
    if (!current || !previous || !timeDelta) return 0;
    const distance = calculateDistance(current, previous);
    return distance / (timeDelta / 1000); // Convert to units per second
};

/**
 * Transform MediaPipe pose landmarks into simplified point structure
 * @param {Array} landmarks - MediaPipe pose landmarks array
 * @returns {Object} - Object with named point coordinates
 */
export const extractPosePoints = (landmarks) => {
    if (!landmarks || !landmarks.length) return null;

    return {
        nose: landmarks[0],
        leftEye: landmarks[1],
        rightEye: landmarks[2],
        leftEar: landmarks[3],
        rightEar: landmarks[4],
        leftShoulder: landmarks[11],
        rightShoulder: landmarks[12],
        leftElbow: landmarks[13],
        rightElbow: landmarks[14],
        leftWrist: landmarks[15],
        rightWrist: landmarks[16],
        leftHip: landmarks[23],
        rightHip: landmarks[24],
        leftKnee: landmarks[25],
        rightKnee: landmarks[26],
        leftAnkle: landmarks[27],
        rightAnkle: landmarks[28]
    };
};
