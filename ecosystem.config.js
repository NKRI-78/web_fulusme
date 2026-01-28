module.exports = {
  apps: [
    {
      name: "web_fulusme",
      script: "npm",
      args: "run start",
      env: {
        NODE_ENV: "production",
        PORT: 3336,
      },
    },
  ],
};
