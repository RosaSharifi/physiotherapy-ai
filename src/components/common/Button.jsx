/**
 * Button component for consistent button styling across the application
 */

import React from 'react';
import Link from 'next/link';
import styles from '../../styles/components/common/Button.module.css';

const Button = ({
                    children,
                    onClick,
                    href,
                    variant = 'primary',
                    size = 'medium',
                    icon,
                    iconPosition = 'right',
                    fullWidth = false,
                    disabled = false,
                    className = '',
                    ...props
                }) => {
    const buttonClasses = `
    ${styles.button} 
    ${styles[variant]} 
    ${styles[size]} 
    ${fullWidth ? styles.fullWidth : ''} 
    ${disabled ? styles.disabled : ''}
    ${icon ? styles.withIcon : ''}
    ${icon && iconPosition === 'left' ? styles.iconLeft : ''}
    ${className}
  `;

    // If href is provided, render as a link
    if (href) {
        return (
            <Link href={href} passHref legacyBehavior>
                <a
                    className={buttonClasses}
                    onClick={onClick}
                    {...props}
                >
                    {icon && iconPosition === 'left' && (
                        <span className={styles.icon}>{icon}</span>
                    )}
                    <span className={styles.label}>{children}</span>
                    {icon && iconPosition === 'right' && (
                        <span className={styles.icon}>{icon}</span>
                    )}
                </a>
            </Link>
        );
    }

    // Otherwise, render as a button
    return (
        <button
            className={buttonClasses}
            onClick={onClick}
            disabled={disabled}
            {...props}
        >
            {icon && iconPosition === 'left' && (
                <span className={styles.icon}>{icon}</span>
            )}
            <span className={styles.label}>{children}</span>
            {icon && iconPosition === 'right' && (
                <span className={styles.icon}>{icon}</span>
            )}
        </button>
    );
};

export default Button;
