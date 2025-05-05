/**
 * FeedbackAlert component for displaying immediate form feedback alerts
 * Shows actionable alerts when form issues are detected during exercise
 */

import React, { useState, useEffect } from 'react';
import styles from '../../styles/components/feedback/FeedbackAlert.module.css';

const FeedbackAlert = ({
                           feedback,
                           autoHide = true,
                           hideDelay = 5000,
                           position = 'top'
                       }) => {
    const [visible, setVisible] = useState(true);
    const [exiting, setExiting] = useState(false);

    // Handle auto-hiding feedback after delay
    useEffect(() => {
        if (!feedback) {
            setVisible(false);
            return;
        }

        // Reset states when feedback changes
        setVisible(true);
        setExiting(false);

        let hideTimer;
        let exitTimer;

        if (autoHide) {
            // Set timer to start exit animation
            exitTimer = setTimeout(() => {
                setExiting(true);
            }, hideDelay - 300); // Start exit animation 300ms before hiding

            // Set timer to hide feedback
            hideTimer = setTimeout(() => {
                setVisible(false);
            }, hideDelay);
        }

        // Clean up timers
        return () => {
            clearTimeout(hideTimer);
            clearTimeout(exitTimer);
        };
    }, [feedback, autoHide, hideDelay]);

    // Don't render anything when no feedback or not visible
    if (!feedback || !visible) return null;

    // Get appropriate icon based on feedback severity
    const renderIcon = () => {
        if (feedback.severity === 'high') {
            return (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" fill="currentColor" />
                </svg>
            );
        } else if (feedback.severity === 'medium') {
            return (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="currentColor" />
                </svg>
            );
        } else if (feedback.type === 'success') {
            return (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor" />
                </svg>
            );
        } else {
            return (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" fill="currentColor" />
                </svg>
            );
        }
    };

    // Determine alert class based on severity
    const getAlertClass = () => {
        if (feedback.type === 'success') return styles.successAlert;

        switch (feedback.severity) {
            case 'high': return styles.highAlert;
            case 'medium': return styles.mediumAlert;
            case 'low': return styles.lowAlert;
            default: return styles.infoAlert;
        }
    };

    return (
        <div className={`
      ${styles.alertContainer} 
      ${styles[`position${position.charAt(0).toUpperCase() + position.slice(1)}`]}
      ${exiting ? styles.exiting : styles.entering}
    `}>
            <div className={`${styles.alert} ${getAlertClass()}`}>
                <div className={styles.alertIcon}>
                    {renderIcon()}
                </div>
                <div className={styles.alertContent}>
                    <p className={styles.alertMessage}>{feedback.message}</p>
                </div>
            </div>
        </div>
    );
};

export default FeedbackAlert;
