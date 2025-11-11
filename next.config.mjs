/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: '**', // For Dev purpose, allow all hostnames
            },
        ],
    },
};

export default nextConfig;
