/** @type {import('next').NextConfig} */
const nextConfig = {
  // The judge/run executor spawns `bun` subprocesses, so these route
  // handlers must run in a real Node process (next dev / next start),
  // never on serverless. Mark heavy/native-ish deps as external.
  serverExternalPackages: ["@prisma/client", "prisma"],
};

export default nextConfig;
