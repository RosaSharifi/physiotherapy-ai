/**
 * Alert component for displaying notifications and feedback messages
 */

import React, { useState, useEffect } from 'react';
import styles from '../../styles/components/common/Alert.module.css';

const Alert = ({
                   message,
                   type = 'info',
                   icon = true,
                   dismissible = false,
                   duration = 0, // 0 means it doesn't auto-dismiss
                   onDismiss,
                   className = ''
               }) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        // If duration is set, auto-dismiss after that time
        if (duration > 0) {
            const timer = setTimeout(() => {
                setVisible(false);
                if (onDismiss) onDismiss();
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [duration, onDismiss]);

    const handleDismiss = () => {
        setVisible(false);
        if (onDismiss) onDismiss();
    };

    if (!visible) return null;

    // Render different icons based on type
    const renderIcon = () => {
        switch (type) {
            case 'success':
                return (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor" />
                    </svg>
                );
            case 'error':
                return (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="currentColor" />
                    </svg>
                );
            case 'warning':
                return (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" fill="currentColor" />
                    </svg>
                );
            case 'info':
            default:
                return (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" fill="currentColor" />
                    </svg>
                );
        }
    };

    return (
        <div className={`${styles.alert} ${styles[type]} ${className}`}>
            {icon && <div className={styles.alertIcon}>{renderIcon()}</div>}
            <div className={styles.alertMessage}>{message}</div>
            {dismissible && (
                <button className={styles.dismissButton} onClick={handleDismiss} aria-label="Dismiss">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor" />
                    </svg>
                </button>
            )}
        </div>
    );
};

export default Alert;
