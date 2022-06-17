import 'cypress-fill-command'
import '@testing-library/cypress/add-commands'
import accounts from '../fixtures/accounts.json'

Cypress.Commands.add('getIframe', (iframe) => {

    return cy.get(iframe)
        .its('0.contentDocument.body').should('not.be.empty')
        .then(cy.wrap)
})


Cypress.Commands.add('iframeLoaded', { prevSubject: 'element' }, $iframe => {
    const contentWindow = $iframe.prop('contentWindow')
    return new Promise(resolve => {
        if (contentWindow && contentWindow.document.readyState === 'complete') {
            resolve(contentWindow)
        } else {
            $iframe.on('load', () => {
                resolve(contentWindow)
            })
        }
    })
})

Cypress.Commands.add('getInDocument', { prevSubject: 'document' }, (document, selector) =>
    Cypress.$(selector, document),
)

Cypress.Commands.add('forceVisit', url => {
    cy.window().then(win => {
        return win.open(url, '_self');
    });
});

Cypress.Commands.add('myhealth_login', (user) => {

    let email = accounts[user].email;
    let password = accounts[user].password;

    cy.visit('https://myhealth-staging.dochq.co.uk/login', { timeout: 10000 })
    cy.intercept({ method: 'GET', url: 'https://ui-identity-editor-staging.dochq.co.uk/login?client=dochqhealth', }).as('login_page')
    cy.get('.login-container').find('button.green').click()
    cy.wait('@login_page')
    cy.wait(1000)

    cy.get('input[type="email"]').type(email)
    cy.get('input[type="password"]').type(password)

    cy.get('button').contains('Login').click({ force: true })
    cy.wait(2000)
})

Cypress.Commands.add('myhealth_logout', () => {
    cy.contains('Login').should('not.exist')
    cy.get('.personal-profile').click()
    cy.wait(1000)
    cy.contains('Logout').click()
})


Cypress.Commands.add('admin_login', (email, password) => {
    cy.visit('https://admin-staging.dochq.co.uk/login', { timeout: 70000 })
    
    cy.get('input[type="email"]').focus().clear().type(email)
    cy.get('input[type="password"]').focus().clear().type(password)

    cy.get('button').contains('Login').click({ force: true })
    cy.wait(2000)
})

Cypress.Commands.add('admin_logout', () => {
    cy.contains('Login').should('not.exist')
    cy.get('.personal-profile').click()
    cy.wait(1000)
    cy.contains('Logout').click()
})


