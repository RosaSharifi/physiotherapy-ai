/**
 * ProgressDisplay component for showing exercise performance summary and progress
 */

import React from 'react';
import {
    generatePerformanceSummary,
    formatTime,
    generateSummaryMessage
} from '../../utils/metricUtils';
import styles from '../../styles/components/ProgressDisplay.module.css';

const ProgressDisplay = ({ analysisData }) => {
    if (!analysisData) {
        return (
            <div className={styles.noDataContainer}>
                <p>No exercise data available</p>
            </div>
        );
    }

    // Generate comprehensive summary from raw analysis data
    const summary = generatePerformanceSummary(analysisData);
    const summaryMessage = generateSummaryMessage(summary);

    // Determine performance level color
    const getPerformanceColor = (level) => {
        switch (level) {
            case 'Excellent': return '#4CAF50'; // Green
            case 'Good': return '#8BC34A'; // Light Green
            case 'Average': return '#FFC107'; // Amber
            case 'Needs Improvement': return '#FF9800'; // Orange
            case 'Poor': return '#F44336'; // Red
            default: return '#9E9E9E'; // Grey
        }
    };

    const performanceColor = getPerformanceColor(summary.performanceLevel);

    return (
        <div className={styles.progressContainer}>
            <div className={styles.progressHeader}>
                <h2 className={styles.progressTitle}>Exercise Summary</h2>

                <div
                    className={styles.performanceBadge}
                    style={{ backgroundColor: performanceColor }}
                >
                    {summary.performanceLevel}
                </div>
            </div>

            <p className={styles.summaryMessage}>{summaryMessage}</p>

            <div className={styles.metricsGrid}>
                <div className={styles.metricCard}>
                    <div className={styles.metricValue}>{summary.repCount}</div>
                    <div className={styles.metricLabel}>Repetitions</div>
                </div>

                <div className={styles.metricCard}>
                    <div className={styles.metricValue}>
                        {formatTime(summary.duration / 1000)}
                    </div>
                    <div className={styles.metricLabel}>Duration</div>
                </div>

                <div className={styles.metricCard}>
                    <div className={styles.metricValue}>
                        {Math.round(summary.formScore)}%
                    </div>
                    <div className={styles.metricLabel}>Form Score</div>
                </div>

                <div className={styles.metricCard}>
                    <div className={styles.metricValue}>
                        {summary.averageTimePerRep > 0
                            ? `${summary.averageTimePerRep.toFixed(1)}s`
                            : 'N/A'}
                    </div>
                    <div className={styles.metricLabel}>Avg. Time per Rep</div>
                </div>
            </div>

            {Object.keys(summary.errorFrequency).length > 0 && (
                <div className={styles.errorSection}>
                    <h3 className={styles.sectionTitle}>Form Errors</h3>
                    <div className={styles.errorChart}>
                        {Object.entries(summary.errorFrequency).map(([errorType, percentage]) => (
                            <div key={errorType} className={styles.errorBar}>
                                <div className={styles.errorLabel}>
                                    {formatErrorLabel(errorType)}
                                </div>
                                <div className={styles.barContainer}>
                                    <div
                                        className={styles.barFill}
                                        style={{ width: `${percentage}%` }}
                                    ></div>
                                    <span className={styles.barValue}>{percentage}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {summary.improvementSuggestions.length > 0 && (
                <div className={styles.suggestionsSection}>
                    <h3 className={styles.sectionTitle}>Improvement Suggestions</h3>
                    <ul className={styles.suggestionsList}>
                        {summary.improvementSuggestions.map((suggestion, index) => (
                            <li key={index} className={styles.suggestionItem}>
                                {suggestion}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

// Helper function to format error labels for display
const formatErrorLabel = (errorType) => {
    const errorLabels = {
        'shoulder_elevation': 'Shoulder Elevation',
        'head_tilt': 'Head Tilt',
        'speed_too_fast': 'Moving Too Fast',
        // Add more error types as needed
    };

    // Return mapped label or fallback to formatted error type
    return errorLabels[errorType] ||
        errorType.split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
};

export default ProgressDisplay;
