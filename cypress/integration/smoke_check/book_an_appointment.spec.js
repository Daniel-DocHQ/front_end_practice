
//MAKING A CUSTOMIZED BOOKING OF ANY ORDERz
//PLEASE USE customize_test.json FOR TEST SETUP

import user from '../../fixtures/user.json'
import prod from '../../fixtures/product_list.json'
import BookingPage from '../../page_objects/BookingPage.js'
import OrderManagement from '../../page_objects/OrderManagePage'
import {test_data} from '../../fixtures/customize_test.js'


const Booking = new BookingPage(test_data);
const OrderM = new OrderManagement(test_data[1].short_token);


let app_date;
let products;
// return short_token of last order OR use wanted short_token from order_list.json
let token;
let total_products = 5;

//***token = Booking.get_short_token();

//*** products = Booking.get_product_titles(token);
//***const products = Booking.get_bookbale_products_data(token);
//***console.log(products)

// returns last order products' titles

const custom_date = test_data[1].booking_date
//let number_of_people = 1, user_index = 0;


	before('get orders data', () => {
		Booking.get_recent_orders_data()

		token = Booking.get_short_token();
		//*** products = Booking.get_product_titles(token);
		cy.request('GET', `https://api-staging.dochq.co.uk/v1/order/${token}/product?fulfilled=true`, { timeout: 5000 }).then((res) => {
			products = res.body;
			console.log(products)
			total_products = Object.keys(products).length || 2;
		})
	})

let prod_index = 0;

	describe("Booking of Appointment", () => { 

		it('Check that booking page of is correct', () => {
			cy.wait(2000)
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
			if (!products[prod_index].quantity) prod_index++; // if product is already booked, move to the next product

			console.log(prod_index)
			cy.get('.MuiFormControlLabel-root').contains(products[prod_index].title).then((prod_lable)=> {
				// find and pick the product to book
				cy.get(prod_lable).siblings().find('input[name="product"]').check()
			})

			if(Object.keys(products)[prod_index] == "Antigen Consultation"){
				console.log(products)
				cy.get('input[name="selectedKit"]').focus().type('e{downarrow}{enter}')
				
			}else{
				cy.get('#number-of-people').focus().clear().type(products[prod_index].quantity)
			}

			cy.get('.green').click()
      		cy.wait(1500)
		})


		it('Travel Details & Picking an appointment slot', () => {
			
			Booking.fill_travel_data(custom_date, prod_index, products)
			
      		cy.get('.green').click()
      		cy.wait(1500)

			app_date = Booking.pick_appointment_slot_and_get_booking_date(custom_date, prod_index, products)

      		cy.get('.green').contains("Confirm").click()
      		cy.wait(1500)
    	})


	  	it('Passenger details', () => {
			for (let user_index = 0; user_index < products[prod_index].quantity; user_index++) {

				Booking.fill_pessengers_data(user_index, prod_index, products)

	    		cy.get('.green').click()
	    		cy.wait(1500)
			}
  		})

		it('Accept T&C and Summary', () => {
			
    		cy.get("div > p").contains('Selected Product').parent().should('include.text', products[prod_index].title)
    		//cy.get("div > p").contains('Appointment Date').parent().should('include.text', app_date)

    		for (let user_index = 0; user_index < products[prod_index].quantity; user_index++) {
    			cy.get(`#passenger-name-${user_index+1}`).should('include.text', user.users[user_index].first_name+' '+user.users[user_index].last_name)
    			cy.get(`#passenger-email-${user_index+1} > p`).should('include.text', test_data[1].email) 								//user.users[user_index].email
    			cy.get(`#passenger-phone-${user_index+1}`).should('include.text', test_data[1].country_code+''+test_data[1].phone) 		//user.users[user_index].phone
    			//cy.get(`#passenger-date-of-birth-${user_index+1} > p`).should('include.text', user.users[user_index].date_of_birth)
    			//cy.get(`#passenger-sex-${user_index+1}`).should('include.text', user.users[user_index].sex)		/*** there is a bug with sex: when autotest is making an order, MALE type is always choosen no matter what data is paste ***/
				cy.get(`#passenger-passport-${user_index+1}`).should('include.text', `23${user_index}5678`)
    		}

    		cy.get('input[name="tocAccept"]').check()
    		cy.get('.green').click({force: true})
			cy.wait(2000)

  		})


  		it('Booking confirmation', () => {
    		cy.get(':nth-child(1) > .no-margin').should("have.text","Your Appointment Has Been Booked")
			if (Object.keys(products).length) Cypress.runner.stop()
  		})
	
	})

