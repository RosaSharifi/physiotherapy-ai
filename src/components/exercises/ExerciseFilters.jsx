/**
 * ExerciseFilters component for filtering exercises by category, difficulty, etc.
 * Reusable component that can be used on various pages
 */

import React, { useState, useEffect } from 'react';
import styles from '../../styles/components/ExerciseFilters.module.css';

const ExerciseFilters = ({
                             exercises,
                             onFilterChange,
                             showSearch = true,
                             showCategoryFilter = true,
                             showDifficultyFilter = true,
                             compact = false
                         }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedDifficulty, setSelectedDifficulty] = useState('all');

    // Extract unique categories and difficulties
    const categories = ['all', ...new Set(exercises.map(ex => ex.category))];
    const difficulties = ['all', ...new Set(exercises.map(ex => ex.difficulty))];

    // Apply filters when they change
    useEffect(() => {
        if (onFilterChange) {
            onFilterChange({
                searchQuery,
                category: selectedCategory,
                difficulty: selectedDifficulty
            });
        }
    }, [searchQuery, selectedCategory, selectedDifficulty, onFilterChange]);

    // Format filter label
    const formatLabel = (label) => {
        if (label === 'all') return 'All';

        return label
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    // Clear all filters
    const clearFilters = () => {
        setSearchQuery('');
        setSelectedCategory('all');
        setSelectedDifficulty('all');
    };

    return (
        <div className={`${styles.filtersContainer} ${compact ? styles.compactFilters : ''}`}>
            {showSearch && (
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

                    {searchQuery && (
                        <button
                            className={styles.clearSearchButton}
                            onClick={() => setSearchQuery('')}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor"/>
                            </svg>
                        </button>
                    )}
                </div>
            )}

            <div className={styles.filterControls}>
                {showCategoryFilter && (
                    <div className={styles.filterGroup}>
                        <label className={styles.filterLabel}>Category:</label>
                        <div className={styles.filterOptions}>
                            {categories.map(category => (
                                <button
                                    key={category}
                                    className={`${styles.filterButton} ${selectedCategory === category ? styles.activeFilter : ''}`}
                                    onClick={() => setSelectedCategory(category)}
                                >
                                    {formatLabel(category)}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {showDifficultyFilter && (
                    <div className={styles.filterGroup}>
                        <label className={styles.filterLabel}>Difficulty:</label>
                        <div className={styles.filterOptions}>
                            {difficulties.map(difficulty => (
                                <button
                                    key={difficulty}
                                    className={`${styles.filterButton} ${selectedDifficulty === difficulty ? styles.activeFilter : ''}`}
                                    onClick={() => setSelectedDifficulty(difficulty)}
                                >
                                    {formatLabel(difficulty)}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {(selectedCategory !== 'all' || selectedDifficulty !== 'all' || searchQuery) && (
                    <button
                        className={styles.clearFiltersButton}
                        onClick={clearFilters}
                    >
                        Clear Filters
                    </button>
                )}
            </div>
        </div>
    );
};

export default ExerciseFilters;
