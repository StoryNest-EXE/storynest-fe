// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // bật StrictMode để cảnh báo bug tiềm ẩn (khuyên dùng)
  swcMinify: true        // dùng SWC để minify (mặc định bật từ Next 13 trở đi)
}

export default nextConfig
