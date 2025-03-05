module.exports = {
  apps: [
    {
      name: 'saykotoba-backend',
      script: 'dist/main.js',
      instances: '1',
      exec_mode: 'cluster',
      watch: false,
      env: {
        NODE_ENV: 'production',
        PORT: 8080,
      },
      env_development: {
        NODE_ENV: 'development',
        PORT: 8080,
      },
    },
  ],
};
