const short_token = "do_7447579745"
const day_of_travel= "30"

context('Actions', () => {
  beforeEach(() => {
    cy.visit(`/b2c/book-appointment?short_token=${short_token}&service=video_gp_dochq&order_id=testtest`)
  })

  it('Booking Shop appointment', () => {
    cy.get('#antigen-kit').focus().clear().type("2")
    cy.get('.btn').click()

    cy.contains(day_of_travel).click()
  })
})
