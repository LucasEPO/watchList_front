/** @type {import('next').NextConfig} */
import nextTranslate from 'next-translate-plugin';

const nextConfig = {
    reactStrictMode: true,
};

export default nextTranslate(nextConfig);
