import prod from '../fixtures/product_list.json'
import user from '../fixtures/user.json'
import order_data from '../fixtures/order_list.json'
import {test_data} from '../fixtures/customize_test.js'

let number_of_people = 1, user_index = 0;


let product_index = Object.keys(order_data).length - 1;
let product_titles = [];


let today = new Date();
// if booking_date is set to "null" - default date will be today + day_from_today
//let default_date = custom_date.length < 2 || custom_date == null ? 


export default class BookingPage{
	constructor(test_data) {
		this.products_list = test_data[2];
	}

	get_short_token() {
		return Object.keys(order_data)[Object.keys(order_data).length - 1];
	}

	get_product_titles(short_token) {
		//Get index of the short_token in the order_list.json object
		const tokens = Object.keys(order_data);
		const index = tokens.indexOf(short_token);

		const prod_obj = Object.values(order_data)[index];
		let products = Object.keys(prod_obj);

		//delete products["cov-19_certificate"]
		
		console.log(products)
		const quantities = Object.values(prod_obj);
		
		//let product_titles = []
		let products_with_quantities = {};

		for(let i = 0; i < products.length; i++) {
			for(let k = 0; k < prod[products[i]].title.length; k++) {
				product_titles.push(prod[products[i]].title[k])
			}
		}

		product_titles.forEach((key, i) => products_with_quantities[key] = quantities[i] || quantities[i-1]);
		return products_with_quantities;
	}



	// this is required to make appointment booking possible for any product
	get_date_plus_day(custom_date, day_from_today = 0) { // 0 - today, 1 - tomorrow, 2 - aftertomorrow, etc.
		if(custom_date.length < 2 || custom_date == null)
			return (String(today.getDate() + day_from_today).padStart(2, '0'))+'-'+(today.getMonth()+1)+'-'+today.getFullYear();
		else
			{	// add day_from_today to custom_date
				let modified_date = +(custom_date.slice(0, 2))
				modified_date += day_from_today
				if(modified_date < 10) modified_date = '0' + modified_date;
				modified_date += '-'+(today.getMonth()+1)+'-'+today.getFullYear();	
				return modified_date // example: if day_from_today = 2, then custom_date "05-02-2022" will become "07-02-2022"
			}
	}


	get_app_slots_request_link(date)
	{
		let link_date = this.get_date_plus_day(date, 1)
		console.log(link_date)
		return `https://dochq-booking-api-staging.dochq.co.uk/?&service=video_gp_dochq&date=${link_date}`
	}


	fill_travel_data(date, prod_index) {
		if(product_titles[prod_index].includes('2' || '8')) // for all 'Day 2/3/8/5 whatever Test'
		{
			let departure_date = this.get_date_plus_day(date, 2)
			cy.get('input[name="transportNumber"]').fill("FFR543")
			cy.get('input[name="city"]').type(`${test_data[2].flight_timezone}{downarrow}{enter}`)
      		cy.get('input[name="travelDate"]').clear().fill(departure_date)
		}
		else if(product_titles[prod_index].includes('Fit to Travel [PCR]'))
		{	
			// setting flight date 4 days from today as FTT PCR appointments available 
			// between 72 hours and 57 hours prior departure_date.
			let departure_date = this.get_date_plus_day(date, 4) 
      		cy.get('input[name="travelDate"]').clear().fill(departure_date)
		}
		else	// all other products like pre-dep tests and ftt (except ftt pcr)
		{
			let departure_date = this.get_date_plus_day(date, 2)
			cy.get('input[name="city"]').type(`${test_data[2].flight_timezone}{downarrow}{enter}`)
      		cy.get('input[name="travelDate"]').clear().fill(departure_date)
		}
	}



	pick_appointment_slot_and_get_booking_date(date, prod_index) {
		if(product_titles[prod_index].includes('2' || '8')) // for all 'Day 2/3/8/5 whatever Test'
		{	
			let booking_date = this.get_date_plus_day(date, 2)
			cy.get(".MuiIconButton-label").contains(`${+(booking_date.slice(0, 2))}`).first().click({force: true})
			cy.get('.appointment-slot-container').find('div.slot-container > div').first().click({force: true})
			return booking_date;
		}
		else if(product_titles[prod_index].includes('Fit to Travel [PCR]'))
		{
			// if your [departure_date] day is 19th of December, appointments will be available on 16th or 17th
			let booking_date = this.get_date_plus_day(date, 1) 
			cy.get(".MuiIconButton-label").contains(`${+(booking_date.slice(0, 2))}`).first().click({force: true})
			cy.get('.appointment-slot-container').find('div.slot-container > div').first().click({force: true})
			return booking_date;
		}
		else	// all other products like pre-dep tests and ftt (except ftt pcr)
		{
			// appointment for these products is booked n days before [departure_date]
			let booking_date = this.get_date_plus_day(date, 1)
			cy.get(".MuiIconButton-label").contains(`${+(booking_date.slice(0, 2))}`).first().click({force: true})
			cy.get('.appointment-slot-container').find('div.slot-container > div').first().click({force: true})
			return booking_date;
		}
	}

	fill_pessengers_data(user_index, prod_index){
		cy.get('#first-name').focus().clear().fill(user.users[user_index].first_name)
	    cy.get('#last-name').clear().fill(user.users[user_index].last_name)						// to randomize replace with:
	    cy.get('#email').clear().fill(test_data[1].email) 										//user.users[user_index].email 
	    cy.get('#country-select-demo').clear().type(`${test_data[1].country_code}{enter}`)		//user.users[user_index].country_code
	    cy.get('#phone').clear().fill(test_data[1].phone)										//user.users[user_index].phone
	    cy.get('#date-of-birth').fill(user.users[user_index].date_of_birth)
	    cy.get('#ethnicity').type("{downarrow}{enter}")
	    cy.get(`fieldset[name="passengers[${user_index}].sex"]`).type(user.users[user_index].sex)
	    cy.get('#passport-number').fill(`23${user_index}5678`)
	    cy.get('#passport-number-confirmation').fill(`23${user_index}5678`)
		
		if(product_titles[prod_index].includes('2' || '8')) // for all 'Day 2/3/8/5 whatever Test'
		{	//Vaccine Status check
			switch(test_data[2].vaccine_status){
				case 'yes': {
					cy.get(`input[value="yes"]`).check('yes', { force: true })
	    			cy.get(`input[name="passengers[${user_index}].vaccineType"]`).check(user.users[user_index].vaccine.name)
	    			cy.get(`input[name="passengers[${user_index}].vaccineNumber"]`).check(user.users[user_index].vaccine.shots)
				}
				case 'no': {
					cy.get(`input[value="no"]`).check('no', { force: true })
				}
			}
		}
	}
}
