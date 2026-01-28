module.exports = {
  apps: [
    {
      name: "web-fulusme",
      script: "npm",
      args: "run start",
      env: {
        NODE_ENV: "production",
        PORT: 3336,
      },
    },
    {
      name: "web-fulusme-staging",
      script: "npm",
      args: "run start",
      env: {
        NODE_ENV: "development",
        PORT: 3336,
      },
    },
  ],
};
