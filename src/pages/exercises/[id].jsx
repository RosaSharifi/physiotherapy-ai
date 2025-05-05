/**
 * Exercise detail page
 * Displays exercise information and allows starting the tracking session
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { getExerciseById } from '../../data/exercises';
import ExerciseInstructions from '../../components/exercises/ExerciseInstructions';
import styles from '../../styles/pages/exercises/ExerciseDetail.module.css';

export default function ExerciseDetail() {
    const router = useRouter();
    const { id } = router.query;
    const [exercise, setExercise] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Only fetch once we have the ID from the router
        if (id) {
            // Add a small delay to simulate loading
            const timer = setTimeout(() => {
                const exerciseData = getExerciseById(id);

                if (exerciseData) {
                    setExercise(exerciseData);
                    setLoading(false);
                } else {
                    setError('Exercise not found');
                    setLoading(false);
                }
            }, 500);

            return () => clearTimeout(timer);
        }
    }, [id]);

    const handleStartExercise = () => {
        if (exercise) {
            router.push(`/tracker/${exercise.id}`);
        }
    };

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.loadingSpinner}></div>
                <p>Loading exercise details...</p>
            </div>
        );
    }

    if (error || !exercise) {
        return (
            <div className={styles.errorContainer}>
                <h2 className={styles.errorTitle}>Exercise Not Found</h2>
                <p className={styles.errorMessage}>
                    {error || 'The exercise you requested could not be found.'}
                </p>
                <Link href="/exercises" passHref legacyBehavior>
                    <a className={styles.backButton}>
                        Return to Exercise List
                    </a>
                </Link>
            </div>
        );
    }

    return (
        <>
            <Head>
                <title>{exercise.name} | AI Physiotherapy</title>
                <meta name="description" content={exercise.description} />
            </Head>

            <div className={styles.exercisePage}>
                <header className={styles.pageHeader}>
                    <div className={styles.headerContent}>
                        <Link href="/exercises" passHref legacyBehavior>
                            <a className={styles.backLink}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" fill="currentColor"/>
                                </svg>
                                Back to Exercises
                            </a>
                        </Link>
                    </div>
                </header>

                <main className={styles.pageContent}>
                    <ExerciseInstructions
                        exercise={exercise}
                        onStartExercise={handleStartExercise}
                    />
                </main>

                <section className={styles.recommendedSection}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>Before You Begin</h2>
                    </div>

                    <div className={styles.recommendedContent}>
                        <div className={styles.recommendationCard}>
                            <div className={styles.recommendationIcon}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V7H1v10h22v-6c0-2.21-1.79-4-4-4z" fill="#F44336"/>
                                </svg>
                            </div>
                            <div className={styles.recommendationText}>
                                <h3>Ensure Proper Space</h3>
                                <p>Clear the area around you to have enough room to move safely.</p>
                            </div>
                        </div>

                        <div className={styles.recommendationCard}>
                            <div className={styles.recommendationIcon}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" fill="#FFC107"/>
                                </svg>
                            </div>
                            <div className={styles.recommendationText}>
                                <h3>Start Slow</h3>
                                <p>Begin with gentle movements and gradually increase intensity.</p>
                            </div>
                        </div>

                        <div className={styles.recommendationCard}>
                            <div className={styles.recommendationIcon}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" fill="#4CAF50"/>
                                </svg>
                            </div>
                            <div className={styles.recommendationText}>
                                <h3>Position Your Device</h3>
                                <p>Place your device so that your full body is visible in the frame.</p>
                            </div>
                        </div>

                        <div className={styles.recommendationCard}>
                            <div className={styles.recommendationIcon}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="#2196F3"/>
                                </svg>
                            </div>
                            <div className={styles.recommendationText}>
                                <h3>Wear Appropriate Clothing</h3>
                                <p>Wear fitted clothing so the AI can track your movements accurately.</p>
                            </div>
                        </div>
                    </div>

                    <div className={styles.startButtonContainer}>
                        <button
                            className={styles.startButton}
                            onClick={handleStartExercise}
                        >
                            Start Exercise
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8 5v14l11-7z" fill="currentColor"/>
                            </svg>
                        </button>
                    </div>
                </section>
            </div>
        </>
    );
}
