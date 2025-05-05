/**
 * FeedbackDisplay component for showing real-time exercise feedback
 * Displays current phase, rep count, form corrections, and progress
 */

import React from 'react';
import styles from '../../styles/components/motionTracking/FeedbackDisplay.module.css';

const FeedbackDisplay = ({
                             exercisePhase,
                             repCount = 0,
                             feedback,
                             currentMetrics = {}
                         }) => {
    // Format exercise phase for display
    const formatPhase = (phase) => {
        if (!phase) return 'Preparing';

        // Handle different phase formats
        return phase
            .replace(/_/g, ' ')
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    // Get alert class based on feedback severity
    const getAlertClass = () => {
        if (!feedback) return '';

        const severityClasses = {
            high: styles.highAlert,
            medium: styles.mediumAlert,
            low: styles.lowAlert,
            success: styles.successAlert
        };

        return severityClasses[feedback.severity] || '';
    };

    // Format metrics for display based on exercise phase
    const getMetricDisplay = () => {
        if (!currentMetrics) return null;

        // Different exercises will have different metrics
        // For neck rotation, show rotation angle
        if ('rotationAngle' in currentMetrics) {
            const angle = Math.abs(currentMetrics.rotationAngle).toFixed(1);
            const direction = currentMetrics.direction === 'right' ? 'Right' :
                currentMetrics.direction === 'left' ? 'Left' : 'Center';

            return `${direction} ${angle}°`;
        }

        return null;
    };

    // Calculate rotation indicator position based on metrics
    const getRotationIndicatorStyle = () => {
        if (!currentMetrics || !('rotationAngle' in currentMetrics)) {
            return { transform: 'rotate(0deg)' };
        }

        // Clamp rotation angle to reasonable range
        const clampedAngle = Math.max(-60, Math.min(60, currentMetrics.rotationAngle));

        return {
            transform: `rotate(${clampedAngle}deg)`
        };
    };

    return (
        <div className={styles.feedbackContainer}>
            <div className={styles.feedbackHeader}>
                <div className={styles.phaseDisplay}>
                    <span className={styles.phaseLabel}>Phase:</span>
                    <span className={styles.phaseValue}>{formatPhase(exercisePhase)}</span>
                </div>

                <div className={styles.repCounter}>
                    <span className={styles.repLabel}>Reps:</span>
                    <span className={styles.repValue}>{repCount}</span>
                </div>
            </div>

            {feedback && (
                <div className={`${styles.feedbackAlert} ${getAlertClass()}`}>
                    <div className={styles.alertIcon}>
                        {feedback.severity === 'success' ? (
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor" />
                            </svg>
                        ) : (
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="currentColor" />
                            </svg>
                        )}
                    </div>
                    <p className={styles.alertMessage}>{feedback.message}</p>
                </div>
            )}

            {currentMetrics && 'rotationAngle' in currentMetrics && (
                <div className={styles.rotationIndicator}>
                    <div className={styles.rotationGauge}>
                        <div className={styles.rotationTicks}>
                            {/* Left ticks */}
                            <div className={`${styles.rotationTick} ${styles.tickMajor}`} style={{ left: '10%' }}></div>
                            <div className={styles.rotationTick} style={{ left: '20%' }}></div>
                            <div className={styles.rotationTick} style={{ left: '30%' }}></div>
                            <div className={`${styles.rotationTick} ${styles.tickMajor}`} style={{ left: '40%' }}></div>

                            {/* Center tick */}
                            <div className={`${styles.rotationTick} ${styles.tickCenter}`} style={{ left: '50%' }}></div>

                            {/* Right ticks */}
                            <div className={`${styles.rotationTick} ${styles.tickMajor}`} style={{ left: '60%' }}></div>
                            <div className={styles.rotationTick} style={{ left: '70%' }}></div>
                            <div className={styles.rotationTick} style={{ left: '80%' }}></div>
                            <div className={`${styles.rotationTick} ${styles.tickMajor}`} style={{ left: '90%' }}></div>
                        </div>

                        <div className={styles.rotationLabels}>
                            <span>Left</span>
                            <span>Center</span>
                            <span>Right</span>
                        </div>

                        <div
                            className={styles.rotationNeedle}
                            style={getRotationIndicatorStyle()}
                        ></div>
                    </div>

                    <div className={styles.metricValue}>
                        {getMetricDisplay()}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FeedbackDisplay;
