import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    reactStrictMode: true,

    // Configure webpack for MediaPipe compatibility
    webpack: (config, { isServer }) => {
        // This is needed for MediaPipe to work properly
        if (!isServer) {
            config.resolve.fallback = {
                ...config.resolve.fallback,
                fs: false,
                crypto: false,
            };
        }

        return config;
    },

    // Enable image optimization
    images: {
        domains: ['localhost'],
    },

    // Remove the cssModules property as it's not recognized
};

export default nextConfig;
