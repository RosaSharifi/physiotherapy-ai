/**
 * FormAnalysis component for displaying detailed analysis of exercise form
 * Shows specific feedback on body positioning and movement
 */

import React, { useState, useEffect, useRef } from 'react';
import styles from '../../styles/components/FormAnalysis.module.css';

const FormAnalysis = ({
                          exerciseId,
                          exerciseName,
                          currentMetrics,
                          errors,
                          exercisePhase,
                          initialPose,
                          currentPose
                      }) => {
    const [formIssues, setFormIssues] = useState([]);
    const [bodyParts, setBodyParts] = useState({});
    const previousErrorsRef = useRef([]);

    // Process errors and form issues
    useEffect(() => {
        if (!errors) return;

        // Only update if errors have changed
        if (JSON.stringify(errors) === JSON.stringify(previousErrorsRef.current)) {
            return;
        }

        previousErrorsRef.current = errors;

        // Map errors to body parts and form issues
        const bodyPartIssues = {};
        const formIssueList = [];

        errors.forEach(error => {
            // Map error types to body parts
            const bodyPart = mapErrorToBodyPart(error.type);

            if (bodyPart) {
                bodyPartIssues[bodyPart] = {
                    message: error.message,
                    severity: error.severity
                };
            }

            // Add to form issues list
            formIssueList.push({
                type: error.type,
                message: error.message,
                severity: error.severity,
                bodyPart
            });
        });

        setBodyParts(bodyPartIssues);
        setFormIssues(formIssueList);
    }, [errors]);

    // Map error type to body part
    const mapErrorToBodyPart = (errorType) => {
        const errorBodyPartMap = {
            'shoulder_elevation': 'shoulders',
            'head_tilt': 'head',
            'speed_too_fast': null, // Not specific to a body part
            'asymmetric_movement': null,
            // Add more mappings as needed for other exercises
        };

        return errorBodyPartMap[errorType] || null;
    };

    // Get severity class for highlighting
    const getSeverityClass = (severity) => {
        const severityClasses = {
            'high': styles.highSeverity,
            'medium': styles.mediumSeverity,
            'low': styles.lowSeverity
        };

        return severityClasses[severity] || '';
    };

    // Format phase name for display
    const formatPhaseName = (phase) => {
        if (!phase) return 'Preparing';

        return phase
            .replace(/_/g, ' ')
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    // Get tips based on current exercise and phase
    const getTipsForPhase = (exercise, phase) => {
        if (!exercise || !phase) return [];

        // Exercise-specific tips
        const exerciseTips = {
            'neck-rotation': {
                'center_position': [
                    'Keep your back straight and shoulders relaxed',
                    'Look straight ahead, chin parallel to the floor'
                ],
                'rotating_right': [
                    'Turn slowly to the right',
                    'Keep shoulders stationary',
                    'Rotate only as far as is comfortable'
                ],
                'right_position': [
                    'Hold this position briefly',
                    'Maintain relaxed shoulders',
                    'Keep your chin level'
                ],
                'returning_from_right': [
                    'Return to center slowly',
                    'Keep the movement smooth and controlled'
                ],
                'rotating_left': [
                    'Turn slowly to the left',
                    'Keep shoulders stationary',
                    'Rotate only as far as is comfortable'
                ],
                'left_position': [
                    'Hold this position briefly',
                    'Maintain relaxed shoulders',
                    'Keep your chin level'
                ],
                'returning_from_left': [
                    'Return to center slowly',
                    'Keep the movement smooth and controlled'
                ]
            }
            // Add more exercises as needed
        };

        // Get tips for this exercise and phase
        const tips = exerciseTips[exercise]?.[phase] || [];

        // Add generic tips if we don't have specific ones
        if (tips.length === 0) {
            return [
                'Move slowly and with control',
                'Focus on proper form rather than speed',
                'Breathe naturally throughout the exercise'
            ];
        }

        return tips;
    };

    return (
        <div className={styles.formAnalysisContainer}>
            <div className={styles.formHeader}>
                <h3 className={styles.formTitle}>Form Analysis</h3>

                <div className={styles.phaseIndicator}>
                    <span className={styles.phaseLabel}>Current phase:</span>
                    <span className={styles.phaseValue}>{formatPhaseName(exercisePhase)}</span>
                </div>
            </div>

            {formIssues.length > 0 ? (
                <div className={styles.issuesContainer}>
                    <h4 className={styles.issuesTitle}>Form Corrections</h4>
                    <ul className={styles.issuesList}>
                        {formIssues.map((issue, index) => (
                            <li
                                key={index}
                                className={`${styles.issueItem} ${getSeverityClass(issue.severity)}`}
                            >
                                <div className={styles.issueIcon}>
                                    {issue.severity === 'high' ? (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" fill="currentColor" />
                                        </svg>
                                    ) : (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="currentColor" />
                                        </svg>
                                    )}
                                </div>
                                <div className={styles.issueContent}>
                                    <div className={styles.issueMessage}>{issue.message}</div>
                                    {issue.bodyPart && (
                                        <div className={styles.bodyPartTag}>
                                            {issue.bodyPart.charAt(0).toUpperCase() + issue.bodyPart.slice(1)}
                                        </div>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <div className={styles.goodFormContainer}>
                    <div className={styles.goodFormIcon}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="#4CAF50" />
                        </svg>
                    </div>
                    <div className={styles.goodFormMessage}>
                        Good form! Keep it up.
                    </div>
                </div>
            )}

            <div className={styles.tipsContainer}>
                <h4 className={styles.tipsTitle}>Tips for {formatPhaseName(exercisePhase)}</h4>
                <ul className={styles.tipsList}>
                    {getTipsForPhase(exerciseId, exercisePhase).map((tip, index) => (
                        <li key={index} className={styles.tipItem}>
                            <div className={styles.tipIcon}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="#2196F3" />
                                </svg>
                            </div>
                            {tip}
                        </li>
                    ))}
                </ul>
            </div>

            {currentMetrics && Object.keys(currentMetrics).length > 0 && (
                <div className={styles.metricsContainer}>
                    <h4 className={styles.metricsTitle}>Current Metrics</h4>
                    <div className={styles.metricsGrid}>
                        {Object.entries(currentMetrics).map(([key, value]) => {
                            // Skip non-display metrics
                            if (['timestamp', 'id'].includes(key)) return null;

                            // Format metric name
                            const metricName = key
                                .replace(/([A-Z])/g, ' $1')
                                .replace(/_/g, ' ')
                                .split(' ')
                                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                .join(' ');

                            // Format metric value
                            let formattedValue = value;
                            if (typeof value === 'number') {
                                if (key.includes('angle') || key.includes('rotation')) {
                                    formattedValue = `${value.toFixed(1)}°`;
                                } else if (key.includes('speed')) {
                                    formattedValue = `${value.toFixed(2)} units/s`;
                                } else if (value > 100) {
                                    formattedValue = Math.round(value);
                                } else if (value !== Math.round(value)) {
                                    formattedValue = value.toFixed(2);
                                }
                            }

                            return (
                                <div key={key} className={styles.metricItem}>
                                    <div className={styles.metricName}>{metricName}</div>
                                    <div className={styles.metricValue}>{formattedValue}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FormAnalysis;
