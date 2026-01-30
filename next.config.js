/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        unoptimized: true, // Equivalent to what typical Vite setups might do if not using a specific image loader
    },
};

export default nextConfig;
