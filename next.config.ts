import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // `npm run build` turns the whole site into plain HTML/CSS/JS files in the
  // `out` folder, which is what GitHub Pages hosts. `npm run dev` is unchanged.
  output: "export",
  // GitHub Pages can't resize images on the fly, so they're served as they are
  images: { unoptimized: true },
};

export default nextConfig;
