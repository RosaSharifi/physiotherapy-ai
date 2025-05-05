/**
 * ProgressHistory component for displaying exercise history and trends
 */

import React, { useState, useEffect } from 'react';
import {
    calculateExerciseProgress,
    getBestPerformance,
    getExerciseHistory
} from '../../utils/storageService';
import { formatTime } from '../../utils/metricUtils';
import styles from '../../styles/components/ProgressHistory.module.css';

const ProgressHistory = ({ exerciseId, exerciseName }) => {
    const [progress, setProgress] = useState(null);
    const [bestPerformance, setBestPerformance] = useState(null);
    const [recentSessions, setRecentSessions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Load progress data when component mounts
    useEffect(() => {
        if (exerciseId) {
            // Get progress statistics
            const progressData = calculateExerciseProgress(exerciseId);
            setProgress(progressData);

            // Get best performance
            const bestSession = getBestPerformance(exerciseId);
            setBestPerformance(bestSession);

            // Get recent sessions (last 5)
            const history = getExerciseHistory(exerciseId);
            const sortedHistory = [...history]
                .sort((a, b) => b.timestamp - a.timestamp)
                .slice(0, 5);
            setRecentSessions(sortedHistory);

            setIsLoading(false);
        }
    }, [exerciseId]);

    // Format date for display
    const formatDate = (timestamp) => {
        return new Date(timestamp).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (isLoading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.loadingSpinner}></div>
                <p>Loading progress data...</p>
            </div>
        );
    }

    // If no history exists yet
    if (!progress || progress.sessionsCompleted === 0) {
        return (
            <div className={styles.noHistoryContainer}>
                <h3 className={styles.noHistoryTitle}>No Progress History</h3>
                <p className={styles.noHistoryMessage}>
                    Complete this exercise to start tracking your progress.
                </p>
            </div>
        );
    }

    return (
        <div className={styles.progressHistoryContainer}>
            <h2 className={styles.progressTitle}>Your Progress</h2>

            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statValue}>{progress.sessionsCompleted}</div>
                    <div className={styles.statLabel}>Sessions</div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statValue}>{progress.totalReps}</div>
                    <div className={styles.statLabel}>Total Reps</div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statValue}>{Math.round(progress.averageFormScore)}%</div>
                    <div className={styles.statLabel}>Avg. Form Score</div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statValue}>
                        <TrendIndicator trend={progress.recentTrend} />
                    </div>
                    <div className={styles.statLabel}>Recent Trend</div>
                </div>
            </div>

            {bestPerformance && (
                <div className={styles.bestPerformance}>
                    <h3 className={styles.sectionTitle}>Your Best Performance</h3>
                    <div className={styles.bestPerformanceCard}>
                        <div className={styles.bestHeader}>
                            <div className={styles.bestDate}>
                                {formatDate(bestPerformance.timestamp)}
                            </div>
                            <div className={styles.bestScore}>
                                {Math.round(bestPerformance.formScore)}%
                            </div>
                        </div>
                        <div className={styles.bestMetrics}>
                            <div className={styles.bestMetric}>
                                <span className={styles.metricLabel}>Reps:</span>
                                <span className={styles.metricValue}>{bestPerformance.repCount}</span>
                            </div>
                            <div className={styles.bestMetric}>
                                <span className={styles.metricLabel}>Duration:</span>
                                <span className={styles.metricValue}>
                  {formatTime(bestPerformance.duration / 1000)}
                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {recentSessions.length > 0 && (
                <div className={styles.recentSessions}>
                    <h3 className={styles.sectionTitle}>Recent Sessions</h3>
                    <div className={styles.sessionsList}>
                        {recentSessions.map((session) => (
                            <div key={session.id} className={styles.sessionCard}>
                                <div className={styles.sessionHeader}>
                                    <div className={styles.sessionDate}>
                                        {formatDate(session.timestamp)}
                                    </div>
                                    <div
                                        className={styles.sessionScore}
                                        style={{
                                            color: getScoreColor(session.formScore)
                                        }}
                                    >
                                        {Math.round(session.formScore)}%
                                    </div>
                                </div>
                                <div className={styles.sessionDetails}>
                                    <div className={styles.sessionDetail}>
                                        <span className={styles.detailLabel}>Reps:</span>
                                        <span className={styles.detailValue}>{session.repCount}</span>
                                    </div>
                                    <div className={styles.sessionDetail}>
                                        <span className={styles.detailLabel}>Duration:</span>
                                        <span className={styles.detailValue}>
                      {formatTime(session.duration / 1000)}
                    </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {progress.formScoreProgress.length >= 2 && (
                <div className={styles.progressChart}>
                    <h3 className={styles.sectionTitle}>Form Score Trend</h3>
                    <div className={styles.chartContainer}>
                        <SimpleLineChart data={progress.formScoreProgress} />
                    </div>
                </div>
            )}
        </div>
    );
};

// Helper component for trend indicator
const TrendIndicator = ({ trend }) => {
    switch (trend) {
        case 'improving':
            return (
                <div className={`${styles.trend} ${styles.improving}`}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 14l5-5 5 5H7z" fill="currentColor" />
                    </svg>
                    Improving
                </div>
            );
        case 'declining':
            return (
                <div className={`${styles.trend} ${styles.declining}`}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 10l5 5 5-5H7z" fill="currentColor" />
                    </svg>
                    Declining
                </div>
            );
        case 'stable':
            return (
                <div className={`${styles.trend} ${styles.stable}`}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 12H6" stroke="currentColor" strokeWidth="2" />
                    </svg>
                    Stable
                </div>
            );
        default:
            return (
                <div className={styles.trend}>
                    Not enough data
                </div>
            );
    }
};

// Helper component for a simple line chart
const SimpleLineChart = ({ data }) => {
    // Find min and max values for scaling
    const scores = data.map(point => point.score);
    const maxScore = Math.max(...scores, 100);
    const minScore = Math.max(0, Math.min(...scores) - 10);

    // Calculate normalized points for SVG path
    const calculatePoints = () => {
        if (data.length < 2) return '';

        const width = 100; // Percentage width
        const height = 100; // Percentage height

        // Create points string for SVG polyline
        return data.map((point, index) => {
            const x = (index / (data.length - 1)) * width;
            const y = height - ((point.score - minScore) / (maxScore - minScore)) * height;
            return `${x},${y}`;
        }).join(' ');
    };

    return (
        <div className={styles.chart}>
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className={styles.chartSvg}>
                {/* Grid lines */}
                <line x1="0" y1="0" x2="100" y2="0" className={styles.gridLine} />
                <line x1="0" y1="25" x2="100" y2="25" className={styles.gridLine} />
                <line x1="0" y1="50" x2="100" y2="50" className={styles.gridLine} />
                <line x1="0" y1="75" x2="100" y2="75" className={styles.gridLine} />
                <line x1="0" y1="100" x2="100" y2="100" className={styles.gridLine} />

                {/* Line chart */}
                <polyline
                    points={calculatePoints()}
                    fill="none"
                    stroke="#2196F3"
                    strokeWidth="2"
                    className={styles.chartLine}
                />

                {/* Data points */}
                {data.map((point, index) => {
                    const x = (index / (data.length - 1)) * 100;
                    const y = 100 - ((point.score - minScore) / (maxScore - minScore)) * 100;
                    return (
                        <circle
                            key={index}
                            cx={x}
                            cy={y}
                            r="2"
                            className={styles.dataPoint}
                        />
                    );
                })}
            </svg>

            {/* Y-axis labels */}
            <div className={styles.yAxisLabels}>
                <div className={styles.axisLabel}>{maxScore}%</div>
                <div className={styles.axisLabel}>{Math.round((maxScore + minScore) / 2)}%</div>
                <div className={styles.axisLabel}>{minScore}%</div>
            </div>

            {/* X-axis labels (first and last date) */}
            <div className={styles.xAxisLabels}>
                <div className={styles.axisLabel}>
                    {new Date(data[0].timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </div>
                <div className={styles.axisLabel}>
                    {new Date(data[data.length - 1].timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
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

export default ProgressHistory;
