require('../utils/auth.js')
var appointmentList = require("../../fixtures/appointment/appointment_list.json")

describe("TUI Practitioner - Appointment management", () => {
    beforeEach(function() {
        let apptTime = new Date()
        for (var i = 0; i < appointmentList.length; i++) {
            appointmentList[i].start_time = apptTime.setDate(apptTime.getDate() + 1)
        }

        cy.login(
            Cypress.env('tui_practitioner.email'),
            Cypress.env('tui_practitioner.password'),
            (token) => localStorage.setItem('auth_token', token)
        )
        cy.intercept('**/users/*', { fixture: 'user.json'})
        cy.intercept('**/roles', { fixture: 'user.json'})
        cy.intercept('GET', '/practitioner', { fixture: 'practitioner/practitioner_list.json'})
        cy.intercept('GET', '/practitioner/me', { fixture: 'practitioner/practitioner_profile.json'})
        cy.intercept('GET', '/getappointments', appointmentList)
        cy.intercept('GET', '/getclaimappointments', { fixture: 'appointment/appointment_list.json'})
        cy.intercept('GET', '/testtuiappt', {fixture: 'appointment/example_appointment.json'})

        cy.visit('/practitioner/live/my-rooms')

        cy.get(':nth-child(3) > .btn').click()

    })

    it('Join appointment', () => {
        cy.get('.full-screen-nurse > div > h2').should("have.text", "You are ready for your appointment")
    })

    it('Email 8x8 link', () => {
        cy.intercept('POST', '/testtuiappt/8x8link', "")
        cy.get('.center > .btn')
    })
})
