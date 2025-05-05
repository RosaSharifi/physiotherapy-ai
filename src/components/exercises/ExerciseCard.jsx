/**
 * ExerciseCard component for displaying exercise information in a selectable card
 * Used in the exercise selection screen
 */

import React from 'react';
import Link from 'next/link';
import styles from '../../styles/components/exercises/ExerciseCard.module.css';

const ExerciseCard = ({ exercise }) => {
    const {
        id,
        name,
        category,
        description,
        image,
        difficulty
    } = exercise;

    // Map difficulty to label and style
    const difficultyMap = {
        beginner: { label: 'Beginner', className: styles.beginnerDifficulty },
        intermediate: { label: 'Intermediate', className: styles.intermediateDifficulty },
        advanced: { label: 'Advanced', className: styles.advancedDifficulty }
    };

    const difficultyInfo = difficultyMap[difficulty] || { label: 'Beginner', className: styles.beginnerDifficulty };

    return (
        <Link href={`/exercises/${id}`} passHref legacyBehavior>
            <a className={styles.cardLink}>
                <div className={styles.exerciseCard}>
                    <div className={styles.imageContainer}>
                        <img
                            src={image || '/assets/exercises/placeholder.jpg'}
                            alt={name}
                            className={styles.exerciseImage}
                        />
                        <div className={styles.categoryBadge}>
                            {category}
                        </div>
                    </div>

                    <div className={styles.cardContent}>
                        <h3 className={styles.exerciseName}>{name}</h3>

                        <p className={styles.exerciseDescription}>
                            {description}
                        </p>

                        <div className={styles.cardFooter}>
              <span className={`${styles.difficultyBadge} ${difficultyInfo.className}`}>
                {difficultyInfo.label}
              </span>

                            <span className={styles.startButton}>
                Start Exercise
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                      d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"
                      fill="currentColor"
                  />
                </svg>
              </span>
                        </div>
                    </div>
                </div>
            </a>
        </Link>
    );
};

export default ExerciseCard;
