/**
 * ExerciseList component for displaying a grid of available exercises
 * Used on the home/exercises page
 */

import React, { useState, useEffect } from 'react';
import ExerciseCard from './ExerciseCard';
import styles from '../../styles/components/exercises/ExerciseList.module.css';

const ExerciseList = ({
                          exercises,
                          title = 'Available Exercises',
                          showFilters = true
                      }) => {
    const [filteredExercises, setFilteredExercises] = useState(exercises);
    const [activeCategory, setActiveCategory] = useState('all');
    const [activeDifficulty, setActiveDifficulty] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Extract unique categories and difficulties from exercises
    const categories = ['all', ...new Set(exercises.map(ex => ex.category))];
    const difficulties = ['all', ...new Set(exercises.map(ex => ex.difficulty))];

    // Apply filters when they change
    useEffect(() => {
        let filtered = [...exercises];

        // Apply category filter
        if (activeCategory !== 'all') {
            filtered = filtered.filter(ex => ex.category === activeCategory);
        }

        // Apply difficulty filter
        if (activeDifficulty !== 'all') {
            filtered = filtered.filter(ex => ex.difficulty === activeDifficulty);
        }

        // Apply search filter
        if (searchQuery.trim() !== '') {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(ex =>
                ex.name.toLowerCase().includes(query) ||
                ex.description.toLowerCase().includes(query)
            );
        }

        setFilteredExercises(filtered);
    }, [exercises, activeCategory, activeDifficulty, searchQuery]);

    // Format filter label for display
    const formatLabel = (label) => {
        if (label === 'all') return 'All';

        return label
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    return (
        <div className={styles.exerciseListContainer}>
            <h2 className={styles.listTitle}>{title}</h2>

            {showFilters && (
                <div className={styles.filtersContainer}>
                    <div className={styles.searchContainer}>
                        <input
                            type="text"
                            placeholder="Search exercises..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={styles.searchInput}
                        />
                        <svg
                            className={styles.searchIcon}
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
                                fill="currentColor"
                            />
                        </svg>
                    </div>

                    <div className={styles.filterTabs}>
                        <div className={styles.filterGroup}>
                            <span className={styles.filterLabel}>Category:</span>
                            <div className={styles.filterOptions}>
                                {categories.map(category => (
                                    <button
                                        key={category}
                                        className={`${styles.filterButton} ${activeCategory === category ? styles.activeFilter : ''}`}
                                        onClick={() => setActiveCategory(category)}
                                    >
                                        {formatLabel(category)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className={styles.filterGroup}>
                            <span className={styles.filterLabel}>Difficulty:</span>
                            <div className={styles.filterOptions}>
                                {difficulties.map(difficulty => (
                                    <button
                                        key={difficulty}
                                        className={`${styles.filterButton} ${activeDifficulty === difficulty ? styles.activeFilter : ''}`}
                                        onClick={() => setActiveDifficulty(difficulty)}
                                    >
                                        {formatLabel(difficulty)}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {filteredExercises.length === 0 ? (
                <div className={styles.noResults}>
                    <svg
                        width="64"
                        height="64"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
                            fill="currentColor"
                        />
                    </svg>
                    <p>No exercises found matching your filters.</p>
                    <button
                        onClick={() => {
                            setActiveCategory('all');
                            setActiveDifficulty('all');
                            setSearchQuery('');
                        }}
                        className={styles.resetButton}
                    >
                        Reset Filters
                    </button>
                </div>
            ) : (
                <div className={styles.exerciseGrid}>
                    {filteredExercises.map(exercise => (
                        <div key={exercise.id} className={styles.exerciseCardWrapper}>
                            <ExerciseCard exercise={exercise} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ExerciseList;
