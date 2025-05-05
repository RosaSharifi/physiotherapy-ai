/**
 * Type definitions for the application
 */

// Exercise data type
export interface Exercise {
    id: string;
    name: string;
    category: string;
    description: string;
    instructions: string[];
    startingPosition: string;
    keyPoints: string[];
    trackingPoints: string[];
    errorChecks: ErrorCheck[];
    image: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    duration: string;
}

// Error check type
export interface ErrorCheck {
    name: string;
    description: string;
    severity: 'low' | 'medium' | 'high';
}

// Pose landmarks
export interface PoseLandmark {
    x: number;
    y: number;
    z: number;
    visibility?: number;
}

// Processed pose data
export interface ProcessedPose {
    [key: string]: PoseLandmark;
}

// Analysis result
export interface AnalysisResult {
    isValid: boolean;
    errors: AnalysisError[];
    metrics: AnalysisMetrics;
}

// Analysis error
export interface AnalysisError {
    type: string;
    message: string;
    severity: 'low' | 'medium' | 'high';
}

// Analysis metrics
export interface AnalysisMetrics {
    [key: string]: any;
}

// Performance summary
export interface PerformanceSummary {
    repCount: number;
    duration: number;
    formScore: number;
    performanceLevel: string;
    averageTimePerRep: number;
    errorFrequency: Record<string, number>;
    improvementSuggestions: string[];
    completed: boolean;
}

// Exercise session data for storage
export interface ExerciseSession {
    id?: string;
    exerciseId: string;
    exerciseName?: string;
    timestamp: number;
    repCount: number;
    duration: number;
    formScore: number;
    performanceLevel: string;
    errorFrequency: Record<string, number>;
}

// Exercise progress data
export interface ExerciseProgress {
    sessionsCompleted: number;
    totalReps: number;
    averageFormScore: number;
    formScoreProgress: Array<{timestamp: number, score: number}>;
    recentTrend: 'improving' | 'declining' | 'stable' | 'none';
}
