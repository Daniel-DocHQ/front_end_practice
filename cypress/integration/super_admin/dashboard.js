require('../utils/auth.js')

describe("Super Admin - Dashboard navigation", () => {
  beforeEach(function() {
    cy.login(
      Cypress.env('super_admin.email'),
      Cypress.env('super_admin.password'),
      (token) => localStorage.setItem('auth_token', token)
    )
    cy.intercept('**/users/*', { fixture: 'user.json'})
    cy.intercept('**/roles', { fixture: 'user.json'})

    cy.visit('/super_admin/dashboard')
  })

  it('Access certificate lists', () => {
    cy.get(':nth-child(2) > .doc-card-actions > a > .btn').click()
    cy.wait(500)
    cy.location().should((loc) => {
      expect(loc.pathname.toString()).to.contain('/certificates-list');
    })
  })

  it('Access order management', () => {
    cy.intercept('**/v1/order?*', { fixture: 'order/orders.json'})

    cy.get(':nth-child(3) > .doc-card-actions > a > .btn').click()
    cy.wait(500)
    cy.location().should((loc) => {
      expect(loc.pathname.toString()).to.contain('/order-list');
    })
  })

  it('Access doctor management', () => {
    cy.intercept('**/admin/allappointments?*', { fixture: 'admin/allappointments.json'})
    cy.get(':nth-child(1) > .doc-card-actions > a > .btn').click()
    cy.wait(500)
    cy.location().should((loc) => {
      expect(loc.pathname.toString()).to.contain('/doctors-management');
    })
  })
})
