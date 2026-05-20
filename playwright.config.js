const { defineConfig } = require('@playwright/test');

const PORT = 4821;

module.exports = defineConfig({
  testDir: './tests',
  use: { baseURL: `http://localhost:${PORT}` },
  webServer: {
    command: `npx serve . -p ${PORT} -s`,
    port: PORT,
    reuseExistingServer: false,
  },
});
