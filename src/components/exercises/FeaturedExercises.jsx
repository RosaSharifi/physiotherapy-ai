/**
 * FeaturedExercises component for showcasing selected exercises in a highlighted format
 * Used on the home page to feature specific exercises
 */

import React from 'react';
import { useRouter } from 'next/router';
import styles from '../../styles/components/FeaturedExercises.module.css';

const FeaturedExercises = ({
                               exercises,
                               title = 'Featured Exercises',
                               description,
                               limit = 3,
                               showViewAll = true
                           }) => {
    const router = useRouter();

    // Limit number of exercises displayed
    const limitedExercises = exercises.slice(0, limit);

    // Handle exercise selection
    const handleSelectExercise = (exerciseId) => {
        router.push(`/exercises/${exerciseId}`);
    };

    // Get category badge color
    const getCategoryColor = (category) => {
        const categoryColors = {
            'Neck Pain': '#2196F3',       // Blue
            'Back Pain': '#F44336',       // Red
            'Shoulder Pain': '#9C27B0',   // Purple
            'Knee Pain': '#FF9800',       // Orange
            'Hip Pain': '#4CAF50',        // Green
            'Ankle Pain': '#795548',      // Brown
            'Posture': '#607D8B',         // Blue Gray
            'Strength': '#FFC107'         // Amber
        };

        return categoryColors[category] || '#9E9E9E'; // Default gray
    };

    return (
        <div className={styles.featuredContainer}>
            <div className={styles.featuredHeader}>
                <div className={styles.headerText}>
                    <h2 className={styles.featuredTitle}>{title}</h2>
                    {description && (
                        <p className={styles.featuredDescription}>{description}</p>
                    )}
                </div>

                {showViewAll && (
                    <button
                        className={styles.viewAllButton}
                        onClick={() => router.push('/exercises')}
                    >
                        View All
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" fill="currentColor"/>
                        </svg>
                    </button>
                )}
            </div>

            <div className={styles.featuredGrid}>
                {limitedExercises.map(exercise => (
                    <div
                        key={exercise.id}
                        className={styles.exerciseCard}
                        onClick={() => handleSelectExercise(exercise.id)}
                    >
                        <div className={styles.imageContainer}>
                            <img
                                src={exercise.image || '/assets/exercises/placeholder.jpg'}
                                alt={exercise.name}
                                className={styles.exerciseImage}
                            />
                            <div
                                className={styles.categoryTag}
                                style={{ backgroundColor: getCategoryColor(exercise.category) }}
                            >
                                {exercise.category}
                            </div>
                        </div>

                        <div className={styles.exerciseInfo}>
                            <h3 className={styles.exerciseName}>{exercise.name}</h3>
                            <p className={styles.exerciseDescription}>
                                {exercise.description}
                            </p>

                            <div className={styles.exerciseMeta}>
                                <div className={styles.difficultyTag}>
                                    {exercise.difficulty.charAt(0).toUpperCase() + exercise.difficulty.slice(1)}
                                </div>
                                {exercise.duration && (
                                    <div className={styles.durationTag}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" fill="currentColor"/>
                                            <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z" fill="currentColor"/>
                                        </svg>
                                        {exercise.duration}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FeaturedExercises;
