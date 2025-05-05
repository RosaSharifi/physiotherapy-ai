/**
 * App component that wraps all pages
 * Provides global layout and state management
 */

import { useState, useEffect } from 'react';
import Head from 'next/head';
import '../styles/globals.css';
import styles from '../styles/App.module.css';

function PhysiotherapyApp({ Component, pageProps }) {
    const [isMounted, setIsMounted] = useState(false);

    // Handle mounting on client-side to avoid hydration issues
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Check if camera and motion apis are supported
    const [browserSupport, setBrowserSupport] = useState({
        camera: true,
        motionApi: true,
        loading: true
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const hasCamera = !!navigator.mediaDevices && !!navigator.mediaDevices.getUserMedia;

            setBrowserSupport({
                camera: hasCamera,
                motionApi: true, // Assuming support for now, can add more precise detection
                loading: false
            });
        }
    }, []);

    // Show an unsupported browser message if needed
    if (isMounted && !browserSupport.loading && (!browserSupport.camera || !browserSupport.motionApi)) {
        return (
            <div className={styles.unsupportedBrowser}>
                <div className={styles.unsupportedContent}>
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="#f44336"/>
                    </svg>
                    <h1>Browser Not Supported</h1>
                    <p>
                        This application requires access to your camera and motion sensors to provide AI-powered exercise feedback.
                    </p>
                    <ul className={styles.requirementList}>
                        {!browserSupport.camera && (
                            <li>Camera access is not available in your browser</li>
                        )}
                        {!browserSupport.motionApi && (
                            <li>Motion detection APIs are not supported in your browser</li>
                        )}
                    </ul>
                    <p>
                        Please try using a modern browser like Chrome, Firefox, or Edge on a desktop or mobile device.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>AI Physiotherapy Motion Tracking</title>
                <meta name="description" content="AI-powered motion tracking for physiotherapy exercises" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className={styles.appContainer}>
                <nav className={styles.mainNav}>
                    <div className={styles.navContent}>
                        <a href="/" className={styles.logoLink}>
                            <div className={styles.logo}>
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm4 5.28c-1.23-.37-2.22-1.17-2.8-2.18l-1-1.6c-.41-.65-1.11-1-1.84-1-.78 0-1.59.5-1.78 1.44L7 23h2.1l1.8-8 2.1 2v6h2v-7.5l-2.1-2 .6-3c1 1.15 2.41 2.01 4 2.34V23H19V9h-1.5v1.78zM7.43 13.13l-2.12-.41c-.54-.11-.9-.63-.79-1.17l.76-3.93c.21-1.08 1.26-1.79 2.34-1.58l1.16.23-1.35 6.86z" fill="#2196F3"/>
                                </svg>
                                <span>PhysioTracker AI</span>
                            </div>
                        </a>

                        <div className={styles.navLinks}>
                            <a href="/exercises" className={styles.navLink}>Exercises</a>
                            <a href="#" className={styles.navLink}>About</a>
                        </div>
                    </div>
                </nav>

                <main className={styles.mainContent}>
                    {/* Render the actual page component */}
                    <Component {...pageProps} />
                </main>

                <footer className={styles.mainFooter}>
                    <div className={styles.footerContent}>
                        <p className={styles.copyright}>
                            © {new Date().getFullYear()} PhysioTracker AI - AI-Powered Motion Tracking
                        </p>
                        <div className={styles.footerLinks}>
                            <a href="#" className={styles.footerLink}>Privacy Policy</a>
                            <a href="#" className={styles.footerLink}>Terms of Use</a>
                            <a href="#" className={styles.footerLink}>Contact</a>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}

export default PhysiotherapyApp;
