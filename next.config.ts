import type { NextConfig } from "next";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const root = dirname(fileURLToPath(import.meta.url));
const nextConfig: NextConfig = { reactStrictMode: true, outputFileTracingRoot: root };
export default nextConfig;
