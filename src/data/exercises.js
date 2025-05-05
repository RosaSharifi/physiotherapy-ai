/**
 * Exercise data with detailed information for each exercise
 * Each exercise includes:
 * - id: unique identifier
 * - name: display name
 * - category: pain area or exercise type
 * - description: brief overview
 * - instructions: detailed steps
 * - startingPosition: how to position before starting
 * - keyPoints: important form elements to maintain
 * - trackingPoints: specific body landmarks to monitor
 * - errorChecks: rules to detect incorrect form
 * - image: reference image path
 * - difficulty: exercise difficulty level
 * - duration: recommended time/repetitions
 */

const exercises = [
    {
        id: "neck-rotation",
        name: "Neck Rotation",
        category: "Neck Pain",
        description: "Gentle rotation of the neck to improve mobility and reduce stiffness.",
        instructions: [
            "Start by sitting upright with your head facing forward",
            "Slowly turn your head to look over your right shoulder",
            "Hold the position for 2-3 seconds",
            "Return to the center position",
            "Slowly turn your head to look over your left shoulder",
            "Hold the position for 2-3 seconds",
            "Return to the center position",
            "Repeat 5-10 times on each side"
        ],
        startingPosition: "Sitting with head facing forward, shoulders relaxed and back straight",
        keyPoints: [
            "Keep shoulders relaxed and stationary",
            "Movement should be smooth and controlled",
            "Don't force the rotation beyond comfortable range",
            "Maintain proper posture throughout the exercise"
        ],
        trackingPoints: [
            "nose", "left_eye", "right_eye", "left_ear", "right_ear",
            "left_shoulder", "right_shoulder"
        ],
        errorChecks: [
            {
                name: "shoulder_elevation",
                description: "Shoulders should remain relaxed and not lift during rotation",
                severity: "medium"
            },
            {
                name: "head_tilt",
                description: "Head should rotate horizontally without tilting",
                severity: "high"
            },
            {
                name: "speed_too_fast",
                description: "Movement should be slow and controlled",
                severity: "medium"
            }
        ],
        image: "/assets/exercises/neck-rotation.jpg",
        difficulty: "beginner",
        duration: "3 sets of 10 repetitions"
    }
];

export default exercises;

/**
 * Helper function to get exercise by ID
 */
export const getExerciseById = (id) => {
    return exercises.find(exercise => exercise.id === id) || null;
};

/**
 * Helper function to get exercises by category
 */
export const getExercisesByCategory = (category) => {
    return exercises.filter(exercise => exercise.category === category);
};
