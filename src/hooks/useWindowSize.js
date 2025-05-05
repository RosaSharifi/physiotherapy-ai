/**
 * Custom hook for tracking window dimensions
 * Useful for responsive design and conditional rendering based on screen size
 */

import { useState, useEffect } from 'react';

const useWindowSize = () => {
    // Initialize state with undefined to know when the window object is available
    const [windowSize, setWindowSize] = useState({
        width: undefined,
        height: undefined,
    });

    // Use isMobile flag for easy checking
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        // Only execute on client-side
        if (typeof window === 'undefined') {
            return;
        }

        // Handler to call on window resize
        function handleResize() {
            // Set window dimensions
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });

            // Update mobile flag (using typical mobile breakpoint)
            setIsMobile(window.innerWidth < 768);
        }

        // Add event listener
        window.addEventListener('resize', handleResize);

        // Call handler right away to set initial size
        handleResize();

        // Remove event listener on cleanup
        return () => window.removeEventListener('resize', handleResize);
    }, []); // Empty dependency array means this runs once on mount

    return { ...windowSize, isMobile };
};

export default useWindowSize;
