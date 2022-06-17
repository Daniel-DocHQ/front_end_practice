import prod from '../fixtures/product_list.json'
import user from '../fixtures/user.json'
import order_list from '../fixtures/order_list.json'
import {addDays} from '../support/utils/utils.js'

//import {test_data} from '../fixtures/customize_test.js'

let number_of_people = 1, user_index = 0;

//*** let product_index = Object.keys(order_data).length - 1;
let product_titles = [];

// if booking_date is set to "null" - default date will be today + day_from_today
// let default_date = custom_date.length < 2 || custom_date == null ? 


export default class BookingPage{
	constructor(test_data) {
		this.test_params = test_data[1];
	}

	get_recent_orders_data(email = this.test_params.email, short_id = this.test_params.short_token, size = 50) {

		if(email){              // get list of all recent orders by email
			cy.request('GET', `https://api-staging.dochq.co.uk/v1/order?page=0&page_size=${size}&email=${email}&incl_initiated=true`).then((response) => {
				cy.writeFile('cypress/fixtures/order_list.json', response.body.orders);
				console.log(response.body.orders)
			})
		} else if (short_id){   // get 1 particular order by short_id
			cy.request('GET', `https://api-staging.dochq.co.uk/v1/order/${short_id}`).then((response) => {
				cy.writeFile('cypress/fixtures/order_list.json', response.body.orders);
				console.log(response.body.orders)
			})
		}else{                  // get all orders by total amount
			cy.request('GET', `https://api-staging.dochq.co.uk/v1/order?page=0&page_size=${size}`).then((response) => {
				cy.writeFile('cypress/fixtures/order_list.json', response.body.orders);
				console.log(response.body.orders)
			})
		}
	}

	get_short_token(order_index = 0) {
		return order_list[order_index].short_token;
		//*** return Object.keys(order_data)[Object.keys(order_data).length - 1];
	}

	/***
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
	*/

	// this is required to make appointment booking possible for any product
	get_date_plus_day(custom_date, day_from_today = 0) { // 0 - today, 1 - tomorrow, 2 - aftertomorrow, etc.
		if(custom_date.length < 2 || custom_date == null) {
			let today = new Date();
			return addDays(today, day_from_today);
		} else {    
			let date = new Date(custom_date);
			return addDays(date, 0);
		}
	}


	get_app_slots_request_link(date)
	{
		let link_date = this.get_date_plus_day(date, 1)
		console.log(link_date)
		return `https://dochq-booking-api-staging.dochq.co.uk/?&service=video_gp_dochq&date=${link_date}`
	}

	
	fill_travel_data(date, prod_index, products) {
		//*** let current_product = Object.keys(order_data[this.get_short_token()])[prod_index];
		let current_product = products[prod_index];
		console.log(current_product);
		//*** let product_sku = prod[current_product].sku;
		let product_sku = current_product.sku;
		console.log(product_sku);
		switch (product_sku) {
			case "SYN-UK-PCR-SNS-002":
			case "SYN-UK-PCR-SNS-003":
			case "DAY-2-UK-ANT-001": // Day 2 PCR Test, Day 8 PCR Test
			{
				let landing_date = this.get_date_plus_day(date, 2);
				cy.get('input[name="city"]').type(`${this.test_params.flight_timezone}{downarrow}{enter}`);
				cy.get('input[name="landingDate"]').clear().fill(landing_date); //landingDate
				cy.get('input[name="landingTime"]').clear().fill("08:00 AM")
				cy.get('input[name="transit"]').fill("Poland");
				cy.get('input[name="transportNumber"]').fill("FFR543")
			
			} break;

			case "SYN-UK-PCR-SNS-001": // Fit to Travel PCR Test
			{   
				// setting flight date 4 days from today as FTT PCR appointments available 
				// between 72 hours and 57 hours prior departure_date.
				let departure_date = this.get_date_plus_day(date, 4);
                cy.get('input[name="travelDate"]').clear().fill(departure_date);
				cy.get('input[name="travelTime"]').clear().fill("10:00 PM")

			} break;

			case "FLX-UK-ANT-SNS-002":  // Pre Departure Antigen Test [to UK]
			{
				let departure_date = this.get_date_plus_day(date, 2);
				cy.get('input[name="city"]').type(`${this.test_params.flight_timezone}{downarrow}{enter}`);
                cy.get('input[name="travelDate"]').clear().fill(departure_date);
				cy.get('input[name="travelTime"]').clear().fill("11:00 PM")
				//cy.get('input[name="transit"]').fill("Poland");
				//cy.get('input[name="transportNumber"]').fill("FFR543")

			} break;

			case "FLX-UK-ANT-SNS-001":  // Fit to Travel Antigen Test
			case "CONSULT-ANT":         // Antigen Consultation Pre Departure Antigen Test [to UK], Fit to Travel Antigen Test
			{
				let departure_date = this.get_date_plus_day(date, 2);
				cy.get('input[name="city"]').type(`${this.test_params.flight_timezone}{downarrow}{enter}`);
                cy.get('input[name="travelDate"]').clear().fill(departure_date);
				cy.get('input[name="travelTime"]').clear().fill("11:00 PM")
			}
			break;

			case "DAY-2-US-ANT-001":   // Day 3 Antigen test, Day 2 Antigen Test [UK]
			{
				let landing_date = this.get_date_plus_day(date, 2);
				cy.get('input[name="city"]').type(`${this.test_params.flight_timezone}{downarrow}{enter}`);
                cy.get('input[name="landingDate"]').clear().fill(landing_date);
				cy.get('input[name="landingTime"]').clear().fill("08:00 AM")

			} break;
		
			default: console.log('Something went wrong');
		}
	}



	pick_appointment_slot_and_get_booking_date(date, prod_index, products) {
		//*** let current_product = Object.keys(order_data[this.get_short_token()])[prod_index];
		let current_product = products[prod_index];

		//*** let product_sku = prod[current_product].sku;
		let product_sku = current_product.sku;

		switch (product_sku) {
		case "SYN-UK-PCR-SNS-002":
		case "SYN-UK-PCR-SNS-003":
		case "DAY-2-UK-ANT-001": // Day 2 PCR Test, Day 8 PCR Test // for all 'Day 2/3/8/5 whatever Test'
		{   
			let booking_date = this.get_date_plus_day(date, 2)
			let day_to_pick = +(booking_date.slice(0, 2))
			cy.get(".MuiIconButton-label").contains(new RegExp("^" + day_to_pick + "$", "g")).first().click({force: true}) // regex to ensure that we pick exactly our date
			cy.get('.appointment-slot-container').find('div.slot-container > div').first().click({force: true})
			return booking_date;
		}
		case "SYN-UK-PCR-SNS-001":
		{
			// if your [departure_date] day is 19th of December, appointments will be available on 16th or 17th
			let booking_date = this.get_date_plus_day(date, 2)
			let day_to_pick = +(booking_date.slice(0, 2))
			cy.get(".MuiIconButton-label").contains(new RegExp("^" + day_to_pick + "$", "g")).first().click({force: true})
			cy.get('.appointment-slot-container').find('div.slot-container > div').first().click({force: true})
			return booking_date;
		}
		case "FLX-UK-ANT-SNS-002":  // Pre Departure Antigen Test [to UK]
		case "FLX-UK-ANT-SNS-001":  // Fit to Travel Antigen Test
		case "DAY-2-US-ANT-001":    // Day 3 Antigen test
		case "CONSULT-ANT":         // Antigen Consultation Pre Departure Antigen Test [to UK], Fit to Travel Antigen Test
		{
			// appointment for these products is booked n days before [departure_date]
			let booking_date = this.get_date_plus_day(date, 1);
			let day_to_pick = +(booking_date.slice(0, 2));
			cy.get(".MuiIconButton-label").contains(new RegExp("^" + day_to_pick + "$", "g")).first().click({force: true})

			cy.get('.appointment-slot-container').find('div.slot-container > div').first().click({force: true})
			return booking_date;
		}
		default: console.log('Something went wrong');
		}
	}


	fill_pessengers_data(user_index, prod_index, products){
		const vaccine_name = user.users[user_index].vaccine.name;
		const vaccine_shots = user.users[user_index].vaccine.shots;

		cy.get('#first-name').focus().clear().fill(user.users[user_index].first_name)
	    cy.get('#last-name').clear().fill(user.users[user_index].last_name)                         // to randomize replace with:
	    cy.get('#email').clear().fill(this.test_params.email)                                       //  - user.users[user_index].email 
	    cy.get('#country-select-demo').clear().type(`${this.test_params.country_code}{enter}`)      //  - user.users[user_index].country_code
	    cy.get('#phone').clear().fill(this.test_params.phone)                                       //  - user.users[user_index].phone
	    cy.get('#date-of-birth').fill(user.users[user_index].date_of_birth)
	    cy.get('#ethnicity').type("{downarrow}{enter}")
	    cy.get(`fieldset[name="passengers[${user_index}].sex"]`).type(user.users[user_index].sex)
	    cy.get('#passport-number').fill(`23${user_index}5678`)
	    cy.get('#passport-number-confirmation').fill(`23${user_index}5678`)
		
		let current_product = products[prod_index];
		let product_sku = current_product.sku;

		switch(product_sku){
			//case "FLX-UK-ANT-SNS-002":
			case "DAY-2-UK-ANT-001":
			case "SYN-UK-PCR-SNS-003":
			case "SYN-UK-PCR-SNS-002":
			
			{   //Vaccine Status check
				switch(this.test_params.vaccine_status){
					case 'yes': {
						cy.get(`input[value="yes"]`).check('yes', { force: true })
						cy.get(`input[name="passengers[${user_index}].vaccineType"]`).check(`${vaccine_name}`)
                        cy.get(`input[name="passengers[${user_index}].vaccineNumber"]`).check(`${vaccine_shots}`)

					}
					case 'no': {
						cy.get(`input[value="no"]`).check('no', { force: true })
					}
				}
			}
		}
	}
}
