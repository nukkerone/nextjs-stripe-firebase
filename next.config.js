module.exports = {
  reactStrictMode: true,
  experimental: { appDir: true },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/plan',
        permanent: false
      },
    ]
  },
};
