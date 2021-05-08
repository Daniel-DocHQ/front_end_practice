require('../utils/auth.js')

describe("Super Admin - Order Management", () => {
  beforeEach(function() {
    cy.login((token) => localStorage.setItem('auth_token', token))
    cy.intercept('**/users/*', { fixture: 'user.json'})
    cy.intercept('**/roles', { fixture: 'user.json'})
    cy.intercept('**/v1/order/*', { fixture: 'order/order_details_rat.json'})

    cy.visit('/super_admin/order-list')
  })

  it('Load order ', () => {
    cy.intercept('**/v1/order?*', { fixture: 'order/orders.json'})
    cy.get(".MuiDataGrid-row:first").click()
  })

  it('Cancel order ', () => {
    cy.get(".MuiDataGrid-row:first").click()
    cy.get(".pink").click()
    cy.get('#name').type("super_admin@dochq.co.uk")
    cy.get('.MuiDialogActions-root > :nth-child(2) > .MuiButton-label').click()
  })

  it('Cancel with wrong email', () => {
    cy.get(".MuiDataGrid-row:first").click()
    cy.get(".pink").click()
    cy.get('#name').type("otheremail@dochq.co.uk")
    cy.get('.MuiDialogActions-root > :nth-child(2) > .MuiButton-label').click()
    cy.get('#name').should('have.value', "otheremail@dochq.co.uk")
  })
})
