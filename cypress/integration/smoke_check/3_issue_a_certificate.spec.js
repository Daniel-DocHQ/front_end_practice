
// Generating certificate for the particular order
// PLEASE USE customize_test.json FOR TEST SETUP

import BookingPage from '../../page_objects/BookingPage.js'
import VideoAppPage from '../../page_objects/VideoAppPage.js'
import {test_data} from '../../fixtures/customize_test.js'

const Booking = new BookingPage(test_data);
const Appointment = new VideoAppPage(test_data);

let token;
let app_id;
let clients = Appointment.get_clients_data()

before('Get appointment data', () => {
	Booking.get_recent_orders_data()
	
	token = test_data[1].short_token || Booking.get_short_token();
	Appointment.write_appointment_by_short_id(token)
})


describe("Issue Covid certificate", () => {

	it('Connect to the appointment as Super Admin', () => {
	
		app_id = Appointment.get_appointment_id()
		console.log(app_id)

		let user = 'super_admin'
		cy.myhealth_login(user)

		cy.visit(`https://myhealth-staging.dochq.co.uk/practitioner/video-appointment?appointmentId=${app_id}`)

	})
	
	it('Check that client data is correct', () => {
		Appointment.verify_client_details() // you can insert custom app_id
	})

	it('Join Appointment as Practitioner', () => {
		cy.get('.full-screen-nurse > div > .btn').click()
	})
	
	it('Verify Customer Address', () => {
		Appointment.verify_client_address()  // you can insert custom app_id
	})

	it('Select kit and continue with Certificate Form', () => {
		Appointment.select_kit_provider()
		cy.get('button').contains('Create Certificate').click()
		cy.scrollTo('bottom')
	})

	for(let i = 0; i < clients.length; i++) {
		it(`Verify and Sumbit Certificate for ${clients[i].first_name} ${clients[i].last_name}`, () => {
			Appointment.verify_data_and_fill_covid_results(clients[i], i)
			cy.get(
				`[style="display: flex; justify-content: space-around; flex-wrap: wrap;"] > :nth-child(${i + 1})`
			).within(() => { 
				cy.get('button').contains('Submit').click({multiple: true })
			})
		})
	}
	
})


