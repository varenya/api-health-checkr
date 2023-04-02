/** @type {import('next').NextConfig} */
const withYaml = require('next-plugin-yaml')

const nextConfig = {
  reactStrictMode: true,
}

module.exports = withYaml(nextConfig)
