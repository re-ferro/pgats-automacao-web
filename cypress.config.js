const { defineConfig } = require("cypress");

module.exports = defineConfig({
  retries: {
    runMode: 2,
    openMode: 0
  },
  e2e: {
    reporter: 'cypress-mochawesome-reporter',
    setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on);
    },
  },
});
