/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false, // Disable Strict Mode to prevent double rendering
    eslint: {
        // Warning: This disables ESLint during production builds
        // Only use temporarily to resolve critical issues
        ignoreDuringBuilds: process.env.SKIP_LINT === "true",
    },
    images: {
        remotePatterns: [
            // GitHub avatars
            {
                protocol: "https",
                hostname: "avatars.githubusercontent.com",
                port: "",
                pathname: "/u/**",
            },
            // GitHub user content (for other GitHub images)
            {
                protocol: "https",
                hostname: "raw.githubusercontent.com",
                port: "",
                pathname: "/**",
            },
            // Common image providers
            {
                protocol: "https",
                hostname: "images.unsplash.com",
                port: "",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "cdn.pixabay.com",
                port: "",
                pathname: "/**",
            },
            // Add more providers as needed
            {
                protocol: "https",
                hostname: "via.placeholder.com",
                port: "",
                pathname: "/**",
            },
        ],
    },
};

export default nextConfig;
