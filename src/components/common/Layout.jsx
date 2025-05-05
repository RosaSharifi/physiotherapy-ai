/**
 * Layout component that wraps page content with consistent structure
 * Can be used for specific page layouts while maintaining global app layout
 */

import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../../styles/components/common/Layout.module.css';

const Layout = ({
                    children,
                    title,
                    description,
                    showBackButton = false,
                    backUrl = '/',
                    backText = 'Back',
                    fullWidth = false,
                    hideFooter = false
                }) => {
    const pageTitle = title ? `${title} | PhysioTracker AI` : 'PhysioTracker AI';

    return (
        <>
            <Head>
                <title>{pageTitle}</title>
                {description && <meta name="description" content={description} />}
            </Head>

            <div className={styles.pageLayout}>
                {(title || showBackButton) && (
                    <header className={styles.pageHeader}>
                        <div className={`${styles.headerContent} ${fullWidth ? styles.fullWidth : ''}`}>
                            {showBackButton && (
                                <Link href={backUrl} passHref legacyBehavior>
                                    <a className={styles.backButton}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" fill="currentColor"/>
                                        </svg>
                                        {backText}
                                    </a>
                                </Link>
                            )}

                            {title && <h1 className={styles.pageTitle}>{title}</h1>}
                        </div>
                    </header>
                )}

                <main className={`${styles.pageContent} ${fullWidth ? styles.fullWidth : ''}`}>
                    {children}
                </main>

                {!hideFooter && (
                    <footer className={styles.pageFooter}>
                        <div className={`${styles.footerContent} ${fullWidth ? styles.fullWidth : ''}`}>
                            <div className={styles.footerWidgets}>
                                <div className={styles.footerWidget}>
                                    <h3 className={styles.widgetTitle}>PhysioTracker AI</h3>
                                    <p className={styles.widgetText}>
                                        AI-powered motion tracking for accurate physiotherapy exercises from the comfort of your home.
                                    </p>
                                </div>

                                <div className={styles.footerWidget}>
                                    <h3 className={styles.widgetTitle}>Quick Links</h3>
                                    <ul className={styles.widgetLinks}>
                                        <li><Link href="/">Home</Link></li>
                                        <li><Link href="/exercises">Exercise Library</Link></li>
                                        <li><Link href="#">About</Link></li>
                                        <li><Link href="#">Contact</Link></li>
                                    </ul>
                                </div>

                                <div className={styles.footerWidget}>
                                    <h3 className={styles.widgetTitle}>Resources</h3>
                                    <ul className={styles.widgetLinks}>
                                        <li><Link href="#">Help Center</Link></li>
                                        <li><Link href="#">Privacy Policy</Link></li>
                                        <li><Link href="#">Terms of Service</Link></li>
                                    </ul>
                                </div>
                            </div>

                            <div className={styles.copyrightBar}>
                                <p className={styles.copyright}>
                                    © {new Date().getFullYear()} PhysioTracker AI. All rights reserved.
                                </p>
                            </div>
                        </div>
                    </footer>
                )}
            </div>
        </>
    );
};

export default Layout;
