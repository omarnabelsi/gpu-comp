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
};
export default nextConfig;
