// / <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

const webpackPreprocessor = require('@cypress/webpack-preprocessor');
const codeCoverage = require('@cypress/code-coverage/task');

module.exports = (on: Cypress.PluginEvents, config: Cypress.PluginConfig) => {
  codeCoverage(on, config);

  const options = {
    // send in the options from your webpack.config.js, so it works the same
    // as your app's code
    webpackOptions: require('../../webpack.config'),
    watchOptions: {},
  };

  // add other tasks to be registered here

  // IMPORTANT to return the config object
  // with the any changed environment variables
  on('file:preprocessor', webpackPreprocessor(options));

  return config;
};
