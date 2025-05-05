import React from 'react';
import Link from 'next/link';
import styles from '../../styles/pages/Error.module.css';

export default function Custom404() {
    return (
        <div className={styles.errorContainer}>
            <div className={styles.errorContent}>
                <h1 className={styles.errorCode}>404</h1>
                <h2 className={styles.errorTitle}>Page Not Found</h2>
                <p className={styles.errorMessage}>
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <div className={styles.errorActions}>
                    <Link href="/" className={styles.homeButton}>
                        Return to Home
                    </Link>
                    <Link href="/exercises" className={styles.exercisesButton}>
                        Browse Exercises
                    </Link>
                </div>
            </div>
        </div>
    );
}
