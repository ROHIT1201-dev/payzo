/** @type {import('next').NextConfig} */
process.env.TSC_COMPILE_ON_ERROR ="true";
module.exports = {
  transpilePackages: ["@repo/ui"],
  eslint: {
    ignoreDuringBuilds: true,

  },
};
