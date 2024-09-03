/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ["@marraph/daisy"],
    reactStrictMode: true,
    swcMinify: true,

    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.resolve.fallback = {
                fs: false,
                perf_hooks: false,
                net: false,
                tls: false
            };
        }

        return config;
    },
};

module.exports = nextConfig;