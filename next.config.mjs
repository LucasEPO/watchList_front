/** @type {import('next').NextConfig} */
const nextConfig = {
    redirects: async () => [
        {
          source: '/login',
          destination: '/pages/login',
          permanent: true,
        },
    ],
};

export default nextConfig;
