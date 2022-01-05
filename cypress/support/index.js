// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:

//fs.writeFile('../fixtures/user.json', users_json, function writeJSON(err) {
//  if (err) return console.log(err);
//  console.log(JSON.stringify(users_json));
//  console.log('writing to ' + 'user.json');
//});


//cy.writeFile('cypress/fixtures/user.json', users_json)

// require('./commands')

Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false
})

module.exports = (on, config) => {
  on("before:browser:launch", (browser = {}, args) => {
    if (browser.name === "chrome") {
      args.push("--disable-site-isolation-trials");
      return args;
    }
  });
};