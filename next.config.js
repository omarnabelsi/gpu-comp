import fs from "fs";
import path from "path";

const cwd = process.cwd();
const turbopackRoot = fs.existsSync(path.join(cwd, "app")) ? cwd : path.join(cwd, "gpu-tech");

const nextConfig = {
    turbopack: {
        root: turbopackRoot,
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "images.unsplash.com",
            },
            {
                protocol: "https",
                hostname: "i.pinimg.com",
            },
        ],
    },
    // Vercel optimizations
    swcMinify: true,
    reactStrictMode: true,
    poweredByHeader: false,
    compress: true,
    // Redirect to HTTPS on Vercel
    ...(process.env.VERCEL_ENV === 'production' && {
        redirects: async () => [
            {
                source: '/:path*',
                has: [
                    {
                        type: 'header',
                        key: 'x-forwarded-proto',
                        value: 'http',
                    },
                ],
                destination: 'https://:host/:path*',
                permanent: true,
            },
        ],
    }),
};

export default nextConfig;
