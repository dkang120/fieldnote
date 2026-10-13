/** Static export so the site runs on GitHub Pages (or any static host).
 *  NEXT_PUBLIC_BASE_PATH is set to "/fieldnote" by the Pages workflow; empty locally. */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export default {
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
};
