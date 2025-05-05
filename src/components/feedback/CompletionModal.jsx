/**
 * CompletionModal component for displaying exercise completion summary
 * Shows a modal with performance stats, feedback, and next steps
 */

import React, { useEffect } from 'react';
import { generatePerformanceSummary, formatTime } from '../../utils/metricUtils';
import { saveExerciseSession } from '../../utils/storageService';
import styles from '../../styles/components/CompletionModal.module.css';

const CompletionModal = ({
                             show,
                             onClose,
                             analysisData,
                             exerciseId,
                             exerciseName,
                             onTryAgain,
                             onViewProgress
                         }) => {
    // Generate summary from analysis data
    const summary = analysisData ? generatePerformanceSummary(analysisData) : null;

    // Save exercise session to storage
    useEffect(() => {
        if (show && summary && exerciseId) {
            saveExerciseSession({
                exerciseId,
                exerciseName,
                timestamp: Date.now(),
                repCount: summary.repCount,
                duration: summary.duration,
                formScore: summary.formScore,
                performanceLevel: summary.performanceLevel,
                errorFrequency: summary.errorFrequency
            });
        }
    }, [show, summary, exerciseId, exerciseName]);

    // Handle click outside to close
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    // Prevent scrolling when modal is open
    useEffect(() => {
        if (show) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [show]);

    if (!show || !summary) return null;

    // Get emoji based on performance level
    const getEmoji = (level) => {
        switch (level) {
            case 'Excellent': return '🏆';
            case 'Good': return '👍';
            case 'Average': return '👌';
            case 'Needs Improvement': return '💪';
            case 'Poor': return '📝';
            default: return '👏';
        }
    };

    return (
        <div className={styles.modalBackdrop} onClick={handleBackdropClick}>
            <div className={styles.modalContent}>
                <button className={styles.closeButton} onClick={onClose}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor"/>
                    </svg>
                </button>

                <div className={styles.completionHeader}>
                    <div className={styles.emoji}>{getEmoji(summary.performanceLevel)}</div>
                    <h2 className={styles.completionTitle}>Exercise Complete!</h2>
                    <p className={styles.exerciseName}>{exerciseName}</p>
                </div>

                <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                        <div className={styles.statValue}>{summary.repCount}</div>
                        <div className={styles.statLabel}>Repetitions</div>
                    </div>

                    <div className={styles.statCard}>
                        <div className={styles.statValue}>
                            {formatTime(summary.duration / 1000)}
                        </div>
                        <div className={styles.statLabel}>Duration</div>
                    </div>

                    <div className={styles.statCard}>
                        <div
                            className={styles.statValue}
                            style={{ color: getScoreColor(summary.formScore) }}
                        >
                            {Math.round(summary.formScore)}%
                        </div>
                        <div className={styles.statLabel}>Form Score</div>
                    </div>

                    <div className={styles.statCard}>
                        <div
                            className={styles.statValue}
                            style={{ color: getScoreColor(summary.formScore) }}
                        >
                            {summary.performanceLevel}
                        </div>
                        <div className={styles.statLabel}>Performance</div>
                    </div>
                </div>

                {summary.improvementSuggestions.length > 0 && (
                    <div className={styles.suggestionsSection}>
                        <h3 className={styles.sectionTitle}>For Next Time</h3>
                        <ul className={styles.suggestionsList}>
                            {summary.improvementSuggestions.map((suggestion, index) => (
                                <li key={index} className={styles.suggestionItem}>
                                    {suggestion}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className={styles.actionButtons}>
                    <button
                        className={styles.tryAgainButton}
                        onClick={onTryAgain}
                    >
                        Try Again
                    </button>
                    <button
                        className={styles.viewProgressButton}
                        onClick={onViewProgress}
                    >
                        View Progress
                    </button>
                </div>
            </div>
        </div>
    );
};

// Helper function to get color based on score
const getScoreColor = (score) => {
    if (score >= 90) return '#4CAF50'; // Green
    if (score >= 75) return '#8BC34A'; // Light Green
    if (score >= 60) return '#FFC107'; // Amber
    if (score >= 40) return '#FF9800'; // Orange
    return '#F44336'; // Red
};

export default CompletionModal;
