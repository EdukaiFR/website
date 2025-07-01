/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        // Warning: This disables ESLint during production builds
        // Only use temporarily to resolve critical issues
        ignoreDuringBuilds: process.env.SKIP_LINT === "true",
    },
};

export default nextConfig;
