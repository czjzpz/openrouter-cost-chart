import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // This warning about turbopack root can be ignored—it's a monorepo detection issue
  // that doesn't affect functionality. Remove the extra lockfile at the parent level
  // to silence it, or leave as-is.
};

export default nextConfig;