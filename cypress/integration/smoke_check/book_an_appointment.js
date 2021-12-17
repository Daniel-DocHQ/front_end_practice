/// <reference types="Cypress" />

//MAKING A CUSTOMIZED BOOKING OF ANY ORDERz
//PLEASE USE customize_test.json FOR TEST SETUP

import user from '../../fixtures/user.json'
import prod from '../../fixtures/product_list.json'
import BookingPage from '../../page_objects/BookingPage.js'
import {test_data} from '../../fixtures/customize_test.js'
const Booking = new BookingPage(test_data);
let app_date;

 	// return short_token of last order OR use wanted short_token from order_list.json
const token = Booking.get_short_token() || 'DOCHQ_0778394';

// returns last order products' titles
let products = Booking.get_product_titles(token);

let total_products = Object.keys(products).length;
const custom_date = test_data[2].booking_date
//let number_of_people = 1, user_index = 0;

for(let prod_index = 0; prod_index < total_products; prod_index++) {
describe(`B2C - Booking Appointment for ${Object.keys(products)[prod_index]}`, () => {
		it('Check that booking page of is correct', () => {

    		cy.intercept({method: 'GET', url: `https://api-staging.dochq.co.uk/v1/order/${token}`,}).as('booking_page')
    		cy.visit(`https://myhealth-staging.dochq.co.uk/b2c/book-appointment?short_token=${token}&service=video_gp_dochq`)
			cy.wait(1500); cy.reload()
    		cy.wait('@booking_page')
			// Assert booking page
			cy.get('@booking_page').should( req => {
        		expect(req.response.statusCode).eq(200)
        		expect(req.response.headers['content-type']).eq('application/json')
        		expect(req.response.body).to.not.be.null;
        		cy.log(req.response.body)
				
			//for(let i = 0; i < req.response.body.items.length; i++) {
        	//	if(req.response.body.items[i].product.title.not.include(Object.keys(products)[prod_index]))
			//		throw new Error(`${Object.keys(products)[prod_index]} is missing in the response data.`);
			//}
        	//expect(req.response.body.payment_flag).eq("Complete")
      		})

      		cy.wait(1500)
		})


		it('Pick the product and select number of people to take the test', () => {
			cy.log(products)
			cy.get('.MuiFormControlLabel-root').contains(Object.keys(products)[prod_index]).then((prod_lable)=> {
				// find and pick the product to book
				cy.get(prod_lable).siblings().find('input[name="product"]').check()
			})

			if(Object.keys(products)[prod_index] == "Antigen Consultation"){
				console.log(products)
				cy.get('input[name="selectedKit"]').focus().type('e{downarrow}{enter}')
				
			}else{
				cy.get('#number-of-people').focus().clear().type(Object.values(products)[prod_index])
			}

			cy.get('.green').click()
      		cy.wait(1500)
		})


		it('Travel Details & Picking an appointment slot', () => {
			//let link = Booking.get_app_slots_request_link(custom_date)
			//`https://dochq-booking-api-staging.dochq.co.uk/?&service=video_gp_dochq&date=${date}`
      		//cy.intercept({method: 'GET', url: link},).as('app_slots')
			
			Booking.fill_travel_data(custom_date, prod_index)
			
      		cy.get('.green').click()
      		cy.wait(1500)

      		app_date = Booking.pick_appointment_slot_and_get_booking_date(custom_date, prod_index)
		
      		//cy.wait('@app_slots')
      		//cy.get('@app_slots').should( req => {
      		//  expect(req.response.body).to.not.be.null;
      		//  expect(req.response.headers['content-type']).eq('application/json')
      		//  if (req.response.statusCode != 200 && expect(req.response.body.message).eq("Not enough results returned"))
      		//    throw new Error("Check availability of slots")
      		//  else
      		//    cy.get('.appointment-slot-container').find('div.slot-container > div').first().click({force: true})
      		//})

      		cy.get('.green').contains("Confirm").click()
      		cy.wait(1500)
    	})


	  	it('Passenger details', () => {
	    	for (let user_index = 0; user_index < Object.values(products)[prod_index]; user_index++) {

				Booking.fill_pessengers_data(user_index, prod_index)


	    		cy.get('.green').click()
	    		cy.wait(1500)
			}
     		cy.pause()
  		})

		it('Accept T&C and Summary', () => {
			
    		cy.get("div > p").contains('Selected Product').parent().should('include.text', Object.keys(products)[prod_index])
    		cy.get("div > p").contains('Appointment Date').parent().should('include.text', app_date)

    		for (let user_index = 0; user_index < Object.values(products)[prod_index]; user_index++) {
    			cy.get(`#passenger-name-${user_index+1}`).should('include.text', user.users[user_index].first_name+' '+user.users[user_index].last_name)
    			cy.get(`#passenger-email-${user_index+1} > p`).should('include.text', test_data[1].email) 								//user.users[user_index].email
    			cy.get(`#passenger-phone-${user_index+1}`).should('include.text', test_data[1].country_code+''+test_data[1].phone) 		//user.users[user_index].phone
    			cy.get(`#passenger-date-of-birth-${user_index+1} > p`).should('include.text', user.users[user_index].date_of_birth)
    			//cy.get(`#passenger-sex-${user_index+1}`).should('include.text', user.users[user_index].sex)		/*** there is a bug with sex: when autotest is making an order, MALE type is always choosen no amtter what data is paste ***/
				cy.get(`#passenger-passport-${user_index+1}`).should('include.text', `23${user_index}5678`)
    		}

    		cy.get('input[name="tocAccept"]').check()
    		cy.get('.green').click({force: true})
			cy.wait(2000)

  		})


  		it('Booking confirmation', () => {
    		cy.get(':nth-child(1) > .no-margin').should("have.text","Your Appointment Has Been Booked")
  		})

	
})

}
