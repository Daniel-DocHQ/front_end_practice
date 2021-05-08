require('../utils/auth.js')

describe("TUI Practitioner - Dashboard navigation", () => {
  beforeEach(function() {
    cy.login(
      Cypress.env('tui_practitioner.email'),
      Cypress.env('tui_practitioner.password'),
      (token) => localStorage.setItem('auth_token', token)
    )
    cy.intercept('**/users/*', { fixture: 'user.json'})
    cy.intercept('**/roles', { fixture: 'user.json'})
    cy.intercept('GET', '/practitioner', { fixture: 'practitioner/practitioner_list.json'})
    cy.intercept('GET', '/practitioner/me', { fixture: 'practitioner/practitioner_profile.json'})

    cy.intercept('GET', '/getappointments', { fixture: 'appointment/appointment_list.json'})
    cy.intercept('GET', '/getpastappointments', { fixture: 'appointment/appointment_list.json'})
    cy.intercept('GET', '/getclaimappointments', { fixture: 'appointment/appointment_list.json'})

    cy.visit('/practitioner/dashboard')
  })

  it('Claim appointment', () => {
    cy.intercept('POST', '/testtuiappt/claim', "The slot is now yours")
    cy.get('.MuiTableCell-alignRight > .btn').click()
  })

  it('Claim appointment', () => {
    cy.intercept('POST', '/testtuiappt/claim', "")
    cy.get('.MuiTableCell-alignRight > .btn').click()
  })

  it('Release appointment', () => {
    cy.intercept('POST', '/testtuiappt/release', "")
    cy.get('.pink').click()
  })
})
