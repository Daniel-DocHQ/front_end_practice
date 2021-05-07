const short_token = "do_7447579745"
const day_of_travel= "30"
const appointment_search_rat = [
    {
        "end_time": new Date(),
        "id": "testid",
        "start_time": new Date()
    }
]


context('Actions', () => {
  beforeEach(() => {
    cy.visit(`/b2c/book-appointment?short_token=${short_token}&service=video_gp_dochq&order_id=testtest`)
  })


  it('Booking Shop appointment', () => {
    cy.intercept("GET", '/v1/order/testtest', { fixture: 'order_details_rat.json' }).as("getOrder")

    // How many people would take the test
    cy.get('#antigen-kit').focus().clear().type("2")
    cy.get('.btn').click()
    // Travel Details
    cy.wait(500)
    cy.get('.green').click()

    // Passenger details 1
    cy.get('#first-name').focus().type("Testing")
    cy.get('#last-name').type("Customer")
    cy.get('#email').type("stagingtestingaccounts@dochq.co.uk")
    cy.get('#phone').type("03300880645")
    cy.get('#date-of-birth').type("01/01/1990")
    cy.get('#ethnicity').type("Computer")
    cy.get(':nth-child(2) > .MuiButtonBase-root > .MuiIconButton-label > .PrivateSwitchBase-input-6').click()
    cy.get('#passport-number').type("123456789")
    cy.get('.green').click()
    cy.wait(500)

    // Passenger details 2
    cy.get('#first-name').focus().type("Testing")
    cy.get('#last-name').type("Customer 2")
    cy.get('#email').type("stagingtestingaccounts@dochq.co.uk")
    cy.get('#phone').type("03300880645")
    cy.get('#date-of-birth').type("01/01/1990")
    cy.get('#ethnicity').type("Computer")
    cy.get(':nth-child(2) > .MuiButtonBase-root > .MuiIconButton-label > .PrivateSwitchBase-input-6').click()
    cy.get('#passport-number').type("123456789")

    // Booking appointment
    cy.intercept("GET", '**/?&service=video_gp_dochq*', appointment_search_rat).as("apptSearch")
    cy.get('.green').click()
    cy.wait("@apptSearch")

    cy.get('.slot').click()
    cy.get('.green').click()
    cy.wait(500)

    // Summary
    cy.intercept('POST', '/testid/payment', (req) => {
      req.reply({fixture: "example_payment.json"})
    })
    cy.get('.green').click()
    cy.wait(500)

    // Booking confirmation
    cy.get(':nth-child(1) > .no-margin').should("have.text","Your Appointment Has Been Booked")
    cy.get('.green').click()
  })
})
