/**
 * Exercises index page
 * Shows all available exercises that users can select from
 */

import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import ExerciseList from '../../components/exercises/ExerciseList';
import exercises from '../../data/exercises';
import styles from '../../styles/pages/exercises/ExercisesIndex.module.css';

export default function ExercisesIndex() {
    const [isLoading, setIsLoading] = useState(true);

    // Simulate data loading
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            <Head>
                <title>Exercise Library | AI Physiotherapy</title>
                <meta name="description" content="Browse our library of physiotherapy exercises with AI motion tracking." />
            </Head>

            <div className={styles.exercisesPage}>
                <header className={styles.pageHeader}>
                    <div className={styles.headerContent}>
                        <Link href="/" passHref legacyBehavior>
                            <a className={styles.backLink}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" fill="currentColor"/>
                                </svg>
                                Home
                            </a>
                        </Link>
                        <h1 className={styles.pageTitle}>Exercise Library</h1>
                    </div>

                    <div className={styles.headerBanner}>
                        <div className={styles.bannerText}>
                            <h2 className={styles.bannerTitle}>Find the perfect exercise</h2>
                            <p className={styles.bannerDescription}>
                                Choose from our collection of expert-designed exercises with real-time AI feedback
                            </p>
                        </div>
                    </div>
                </header>

                <main className={styles.pageContent}>
                    {isLoading ? (
                        <div className={styles.loadingContainer}>
                            <div className={styles.loadingSpinner}></div>
                            <p>Loading exercises...</p>
                        </div>
                    ) : (
                        <ExerciseList exercises={exercises} title="All Exercises" />
                    )}
                </main>

                <section className={styles.helpSection}>
                    <div className={styles.helpCard}>
                        <div className={styles.helpIcon}>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z" fill="#2196F3"/>
                            </svg>
                        </div>
                        <div className={styles.helpContent}>
                            <h3 className={styles.helpTitle}>How to use this application</h3>
                            <ol className={styles.helpSteps}>
                                <li>Select an exercise that targets your specific needs</li>
                                <li>Read the instructions and prepare your space</li>
                                <li>Position your device so your body is visible in the camera</li>
                                <li>Follow the on-screen guidance and receive real-time feedback</li>
                                <li>Complete the recommended repetitions for best results</li>
                            </ol>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}
