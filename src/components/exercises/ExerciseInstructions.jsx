/**
 * ExerciseInstructions component for displaying detailed exercise information
 * Used on the exercise detail page before starting the tracking
 */

import React, { useState } from 'react';
import Link from 'next/link';
import styles from '../../styles/components/exercises/ExerciseInstructions.module.css';

const ExerciseInstructions = ({
                                  exercise,
                                  onStartExercise
                              }) => {
    const [activeTab, setActiveTab] = useState('instructions');

    if (!exercise) {
        return (
            <div className={styles.errorContainer}>
                <h2>Exercise not found</h2>
                <p>The requested exercise could not be found.</p>
                <Link href="/exercises" passHref legacyBehavior>
                    <a className={styles.backLink}>Return to exercise list</a>
                </Link>
            </div>
        );
    }

    const {
        name,
        category,
        description,
        instructions,
        startingPosition,
        keyPoints,
        image,
        difficulty,
        duration
    } = exercise;

    // Map difficulty to label and style
    const difficultyMap = {
        beginner: { label: 'Beginner', className: styles.beginnerDifficulty },
        intermediate: { label: 'Intermediate', className: styles.intermediateDifficulty },
        advanced: { label: 'Advanced', className: styles.advancedDifficulty }
    };

    const difficultyInfo = difficultyMap[difficulty] || { label: 'Beginner', className: styles.beginnerDifficulty };

    return (
        <div className={styles.instructionsContainer}>
            <div className={styles.exerciseHeader}>
                <div className={styles.exerciseInfo}>
                    <h1 className={styles.exerciseName}>{name}</h1>

                    <div className={styles.exerciseMeta}>
                        <span className={styles.categoryBadge}>{category}</span>
                        <span className={`${styles.difficultyBadge} ${difficultyInfo.className}`}>
              {difficultyInfo.label}
            </span>
                        {duration && (
                            <span className={styles.durationBadge}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" fill="currentColor"/>
                  <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z" fill="currentColor"/>
                </svg>
                                {duration}
              </span>
                        )}
                    </div>

                    <p className={styles.exerciseDescription}>{description}</p>
                </div>

                <div className={styles.imageContainer}>
                    <img
                        src={image || '/assets/exercises/placeholder.jpg'}
                        alt={name}
                        className={styles.exerciseImage}
                    />
                </div>
            </div>

            <div className={styles.tabsContainer}>
                <div className={styles.tabButtons}>
                    <button
                        className={`${styles.tabButton} ${activeTab === 'instructions' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('instructions')}
                    >
                        Instructions
                    </button>
                    <button
                        className={`${styles.tabButton} ${activeTab === 'keyPoints' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('keyPoints')}
                    >
                        Key Points
                    </button>
                    <button
                        className={`${styles.tabButton} ${activeTab === 'setup' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('setup')}
                    >
                        Setup
                    </button>
                </div>

                <div className={styles.tabContent}>
                    {activeTab === 'instructions' && (
                        <div className={styles.instructionsTab}>
                            <h3>Exercise Instructions</h3>
                            <ol className={styles.instructionsList}>
                                {instructions.map((instruction, index) => (
                                    <li key={index} className={styles.instructionItem}>
                                        {instruction}
                                    </li>
                                ))}
                            </ol>
                        </div>
                    )}

                    {activeTab === 'keyPoints' && (
                        <div className={styles.keyPointsTab}>
                            <h3>Key Points to Remember</h3>
                            <ul className={styles.keyPointsList}>
                                {keyPoints.map((point, index) => (
                                    <li key={index} className={styles.keyPointItem}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="#4CAF50"/>
                                        </svg>
                                        {point}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {activeTab === 'setup' && (
                        <div className={styles.setupTab}>
                            <h3>Setup and Starting Position</h3>
                            <div className={styles.startingPosition}>
                                <div className={styles.positionIcon}>
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" fill="#2196F3"/>
                                    </svg>
                                </div>
                                <p>{startingPosition}</p>
                            </div>

                            <h3 className={styles.setupRequirements}>Requirements</h3>
                            <div className={styles.requirementsList}>
                                <div className={styles.requirementItem}>
                                    <div className={styles.requirementIcon}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4zM14 13h-3v3H9v-3H6v-2h3V8h2v3h3v2z" fill="#FF5722"/>
                                        </svg>
                                    </div>
                                    <div className={styles.requirementText}>
                                        <h4>Camera Access</h4>
                                        <p>The app needs camera access to track your movements.</p>
                                    </div>
                                </div>

                                <div className={styles.requirementItem}>
                                    <div className={styles.requirementIcon}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12 7C6.48 7 2 9.24 2 12c0 2.24 2.94 4.13 7 4.77V20l4-4-4-4v2.73c-3.15-.56-5-1.9-5-2.73 0-1.06 3.04-3 8-3s8 1.94 8 3c0 .73-1.46 1.89-4 2.53v2.05c3.53-.77 6-2.53 6-4.58 0-2.76-4.48-5-10-5z" fill="#9C27B0"/>
                                        </svg>
                                    </div>
                                    <div className={styles.requirementText}>
                                        <h4>Clear Space</h4>
                                        <p>Ensure you have enough space to perform the exercise safely.</p>
                                    </div>
                                </div>

                                <div className={styles.requirementItem}>
                                    <div className={styles.requirementIcon}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" fill="#FFC107"/>
                                        </svg>
                                    </div>
                                    <div className={styles.requirementText}>
                                        <h4>Device Positioning</h4>
                                        <p>Position your device so your whole body is visible in the frame.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className={styles.actionButtons}>
                <Link href="/exercises" passHref legacyBehavior>
                    <a className={styles.backButton}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" fill="currentColor"/>
                        </svg>
                        Back to Exercises
                    </a>
                </Link>

                <button
                    className={styles.startButton}
                    onClick={onStartExercise}
                >
                    Start Exercise
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 5v14l11-7z" fill="currentColor"/>
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default ExerciseInstructions;
