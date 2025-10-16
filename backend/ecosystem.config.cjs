module.exports = {
  apps: [
    {
      name: "backend-api",
      script: "./src/index.js",
      instances: 1,
      exec_mode: "fork",
      env_production: {
        NODE_ENV: "production",
        REDIS_URL: process.env.REDIS_URL,
      },
      error_file: "./logs/api-error.log",
      out_file: "./logs/api-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      merge_logs: true,
      restart_delay: 5000, // auto-restart after crash
    },
    {
      name: "pr-worker",
      script: "./src/worker/prWorker.js",
      instances: 1,
      exec_mode: "fork",
      env_production: {
        NODE_ENV: "production",
        REDIS_URL: process.env.REDIS_URL,
      },
      error_file: "./logs/prworker-error.log",
      out_file: "./logs/prworker-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      merge_logs: true,
      restart_delay: 5000,
    },
    {
      name: "embedding-worker",
      script: "./src/worker/embeddingWorker.js",
      instances: 1,
      exec_mode: "fork",
      env_production: {
        NODE_ENV: "production",
        REDIS_URL: process.env.REDIS_URL,
      },
      error_file: "./logs/embworker-error.log",
      out_file: "./logs/embworker-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      merge_logs: true,
      restart_delay: 5000,
    },
  ],
};
