/** @type {import('next').NextConfig} */
const nextConfig = {
    redirects: async () => [
        {
          source: '/',
          destination: '/login',
          permanent: true,
        },
        {
          source: '/login',
          destination: '/pages/login',
          permanent: true,
        },
        {
          source: '/dashboard',
          destination: '/pages/dashboard',
          permanent: true,
        },
    ],
};

export default nextConfig;
