/** @type {import('next').NextConfig} */
const withYaml = require('next-plugin-yaml')

const nextConfig = {
  reactStrictMode: true,
  output: 'standalone'
}

module.exports = withYaml(nextConfig)
