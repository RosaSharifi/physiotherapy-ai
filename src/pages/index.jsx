/**
 * Home page component
 * Serves as the landing page for the application
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import exercises from '../data/exercises';
import ExerciseList from '../components/exercises/ExerciseList';
import styles from '../styles/pages/Home.module.css';

export default function Home() {
    const router = useRouter();
    const [featuredExercises, setFeaturedExercises] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Simulate loading resources
    useEffect(() => {
        const timer = setTimeout(() => {
            // Get first 3 exercises as featured
            setFeaturedExercises(exercises.slice(0, 3));
            setIsLoading(false);
        }, 800);

        return () => clearTimeout(timer);
    }, []);

    const handleStartSession = () => {
        router.push('/exercises');
    };

    if (isLoading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.loadingSpinner}></div>
                <p>Loading application...</p>
            </div>
        );
    }

    return (
        <main className={styles.homeContainer}>
            <section className={styles.heroSection}>
                <div className={styles.heroContent}>
                    <h1 className={styles.heroTitle}>AI-Powered Physiotherapy</h1>
                    <p className={styles.heroSubtitle}>
                        Improve your form and recover faster with real-time motion tracking and personalized feedback
                    </p>
                    <button
                        className={styles.ctaButton}
                        onClick={handleStartSession}
                    >
                        Start Exercise Session
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8 5v14l11-7z" fill="currentColor"/>
                        </svg>
                    </button>
                </div>
                <div className={styles.heroImageContainer}>
                    <img
                        src="/assets/hero-image.png"
                        alt="AI Physiotherapy"
                        className={styles.heroImage}
                    />
                </div>
            </section>

            <section className={styles.featuresSection}>
                <h2 className={styles.sectionTitle}>How It Works</h2>
                <div className={styles.featuresGrid}>
                    <div className={styles.featureCard}>
                        <div className={styles.featureIcon}>
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8 5v14l11-7z" fill="#2196F3"/>
                            </svg>
                        </div>
                        <h3 className={styles.featureTitle}>Choose Exercise</h3>
                        <p className={styles.featureDescription}>
                            Select from a variety of exercises designed for different body areas and rehabilitation needs.
                        </p>
                    </div>

                    <div className={styles.featureCard}>
                        <div className={styles.featureIcon}>
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" fill="#4CAF50"/>
                            </svg>
                        </div>
                        <h3 className={styles.featureTitle}>Motion Tracking</h3>
                        <p className={styles.featureDescription}>
                            Our AI-powered camera tracks your movements in real-time to analyze your exercise form.
                        </p>
                    </div>

                    <div className={styles.featureCard}>
                        <div className={styles.featureIcon}>
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="#FF9800"/>
                            </svg>
                        </div>
                        <h3 className={styles.featureTitle}>Get Feedback</h3>
                        <p className={styles.featureDescription}>
                            Receive instant feedback and corrections to improve your technique and prevent injury.
                        </p>
                    </div>
                </div>
            </section>

            <section className={styles.exercisesSection}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Featured Exercises</h2>
                    <Link href="/exercises" passHref legacyBehavior>
                        <a className={styles.viewAllLink}>
                            View All Exercises
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" fill="currentColor"/>
                            </svg>
                        </a>
                    </Link>
                </div>

                <ExerciseList
                    exercises={featuredExercises}
                    title=""
                    showFilters={false}
                />
            </section>

            <section className={styles.benefitsSection}>
                <h2 className={styles.sectionTitle}>Benefits</h2>
                <div className={styles.benefitsGrid}>
                    <div className={styles.benefitCard}>
                        <h3 className={styles.benefitTitle}>Accurate Form</h3>
                        <p className={styles.benefitDescription}>
                            Ensure you're performing exercises correctly to maximize effectiveness and prevent injury.
                        </p>
                    </div>

                    <div className={styles.benefitCard}>
                        <h3 className={styles.benefitTitle}>Convenience</h3>
                        <p className={styles.benefitDescription}>
                            Complete your physiotherapy exercises from the comfort of your bu on your schedule.
                        </p>
                    </div>

                    <div className={styles.benefitCard}>
                        <h3 className={styles.benefitTitle}>Progress Tracking</h3>
                        <p className={styles.benefitDescription}>
                            Monitor your improvement over time with detailed performance metrics.
                        </p>
                    </div>

                    <div className={styles.benefitCard}>
                        <h3 className={styles.benefitTitle}>Expert Guidance</h3>
                        <p className={styles.benefitDescription}>
                            Follow exercises designed by professional physiotherapists for optimal recovery.
                        </p>
                    </div>
                </div>
            </section>

            <section className={styles.ctaSection}>
                <h2 className={styles.ctaTitle}>Ready to improve your exercise form?</h2>
                <p className={styles.ctaDescription}>
                    Start your personalized physiotherapy session with AI-powered guidance.
                </p>
                <button
                    className={styles.ctaButton}
                    onClick={handleStartSession}
                >
                    Browse Exercises
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" fill="currentColor"/>
                    </svg>
                </button>
            </section>
        </main>
    );
}
