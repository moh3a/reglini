/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  i18n: {
    locales: ["en", "fr", "ar"],
    defaultLocale: "fr",
  },
  env: {
    ROOT: __dirname,
  },
};

module.exports = nextConfig;
