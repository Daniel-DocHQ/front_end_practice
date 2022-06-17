
import orders from '../fixtures/order_list.json'
import appointment_obj from '../fixtures/appointment.json'
import {addDays} from '../support/utils/utils.js'

let appointment

export default class VideoAppPage {
	constructor(test_data) {
		this.test_params = test_data;
	}

	get_clients_data() {
		return appointment_obj[0].booking_users;
	}

	write_appointment_by_short_id(short_id = this.test_params.short_token) {
		cy.request('GET', `https://dochq-booking-api-staging.dochq.co.uk/-/short-token/${short_id}`).then((response) => {
			cy.writeFile('cypress/fixtures/appointment.json', response.body);
			console.log(response.body)
		})
	}

	get_appointment_by_id(app_id) {
		if(app_id) {
			cy.request('GET', `https://dochq-booking-api-staging.dochq.co.uk/${app_id}?inc_practitioner_name=true`).then((response) => {
				appointment = response.body;
			})
		} else {
			return 0;
		}
	}

	get_appointment_id(short_id = null) { // Ovewrites appointment json if needed
		if(short_id) {
			this.write_appointment_by_short_id()
			return appointment_obj[0].id;
		}
		else return appointment_obj[0].id;
	}


	verify_client_details(custom_app_id) {
		appointment = this.get_appointment_by_id(custom_app_id) || appointment_obj

		// Assert appointment's Product type
		cy.get('.patient-notes-container').contains('Product').siblings().should('include.text', appointment[0].booking_user.metadata.test_type)
		
		// Assert Patiens' Names
		for (let i = 0; i < appointment[0].booking_users.length; i++) {
			let client_name = appointment[0].booking_users[i].first_name + ' ' + appointment[0].booking_users[i].last_name;
			cy.get('.patient-notes-container').contains(`Full Name Client ${i + 1}`).siblings().should('include.text', client_name)
		}

		// Assert Patiens' Email Addresses
		for (let i = 0; i < appointment[0].booking_users.length; i++) {
			let client_email = appointment[0].booking_users[i].email;
			cy.get('.patient-notes-container').contains(`Email Address ${i + 1}`).siblings().should('include.text', client_email)
		}

		// Assert Patiens' Join link
		let client_link = `https://myhealth-staging.dochq.co.uk/appointment?appointmentId=${custom_app_id || appointment_obj[0].id}`;
		cy.get('.patient-notes-container').contains('Joining link').siblings().should('include.text', client_link)
	}

	verify_client_address(custom_app_id = null) {
		// Assert Billing Address
		appointment = this.get_appointment_by_id(custom_app_id) || appointment_obj

		cy.get('.patient-notes-container').contains('Address Line').siblings().should('include.text', appointment[0].booking_user.street_address)
		cy.get('.patient-notes-container').contains('Town').siblings().should('include.text', appointment[0].booking_user.locality)
		cy.get('.patient-notes-container').contains('County').siblings().should('include.text', appointment[0].booking_user.region)
		cy.get('.patient-notes-container').contains('Country').siblings().should('include.text', appointment[0].booking_user.country)
		cy.get('.patient-notes-container').contains('Post Code').siblings().should('include.text', appointment[0].booking_user.postal_code)

		cy.get('.flex-end > .green').contains('Confirm').click()

	
	}

	add_appointment_notes() {
		if(!!test_data[3].appointment_notes) {
			cy.get('button').contains('Add').click()
			cy.get('#notes').clear().fill(test_data[3].appointment_notes)
			cy.get('bitton').contains('Submit').click()
		}
	}

	select_kit_provider(test_type = appointment_obj[0].booking_user.metadata.test_type) {

		switch(test_type) {
			case "Antigen":
			{
				let kit_provider = `${this.test_params[3].kit_provider}{downarrow}{enter}`
				cy.get('input[name="selectedKit"]').focus().clear().type(kit_provider)
			}
			break;

			case "PCR":
			{

			}
			break;
		}
	}

	pick_result(result) {  
		if (result === "Positive") return  'result-positive';
		if (result === "Negative") return 'result-negative';
		if (result === "Invalid") return 'result-invalid';
		if (result === "Reject") return 'result-rejected';
	}

	verify_data_and_fill_covid_results(client, index) {
		let test_type = appointment_obj[0].booking_user.metadata.test_type
		switch(test_type) {
			case "Antigen":
			{
				// Preparing proper Patiens' date_of_birth format
				const dob = addDays(client.date_of_birth.substring(0, 10), 0).split('-').join('/');
				const user_form = `[style="display: flex; justify-content: space-around; flex-wrap: wrap;"] > :nth-child(${index + 1})`;
				const result = this.test_params[3].test_results[index];
				const reject_reason = this.test_params[3].reject_reason;
				
				cy.get(user_form).within(() => {
					cy.get('#first-name').should('have.value', client.first_name)
					cy.get('#last-name').should('have.value', client.last_name)
					cy.get('input[type="email"]').should('have.value', client.email)
					cy.get('#date-of-birth').should('have.value', dob)
					cy.get('#passport-number').should('have.value', client.metadata.passport_number)
					cy.get('input[name="selectedKit"]').should('have.value', this.test_params[3].kit_provider)
					cy.get('[type="checkbox"]').check({force: true}) // ID document checked + Done by Alternative Platform (for all users)
				})

				if (result === "Reject") {
					cy.get(user_form).within(() => { cy.get('#test-result').click({force: true}) })
					cy.findByRole('listbox', {hidden: true}).click().within(() => { 
						cy.findByTestId(this.pick_result(result)).click() // Select "Reject" from MUI-Select
					}) 
					cy.get(user_form).within(() => { cy.get('div[aria-labelledby="test-result-label test-result"]').eq(1).click({force: true}) })
					cy.findByRole('listbox', {hidden: true}).click().within(() => { 
						cy.findByTestId(reject_reason).click() 
					})
				} else {
					cy.get(user_form).within(() => { cy.get('#test-result').click({force: true}) })
					cy.findByRole('listbox', {hidden: true}).within(() => { 
						cy.findByTestId(this.pick_result(result)).click() 
					})
				} break;
			}
			case "PCR":
			{

			} break;
		}
	}

}