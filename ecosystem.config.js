/** PM2 ecosystem – loads /root/myapp/.env */
require('dotenv').config({ path: '/root/myapp/.env' });

module.exports = {
  apps: [
    {
      name: "myapp",
      cwd: "/root/myapp",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000 -H 127.0.0.1",
      env: {
        ...process.env,
        NODE_ENV: "production"
      },
      watch: false,
      autorestart: true,
      max_restarts: 10,
      out_file: "/root/.pm2/logs/myapp.out.log",
      error_file: "/root/.pm2/logs/myapp.err.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z"
    }
  ]
}
