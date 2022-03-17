import prod from '../fixtures/product_list.json'
import { getNotNullItems } from '../support/utils/utils.js'
import { users_json } from '../support/user_data_generator.js'
import products from '../fixtures/products.json'
import filter_by from '../support/utils/utils.js'

// Get random user data from user_data_generator.js script
let user = JSON.parse(users_json);
let user_index = 0, adults_num = 1, children_num = 0;
let products_data;

export default class OrderPage {
	constructor(test_data) {
		this.products_list = test_data[0];
		this.test_params = test_data[1];
	}

	get_all_products_data() {
		cy.request('https://api-staging.dochq.co.uk/v1/product?include_inactive=true').then((response) => {
			cy.writeFile('cypress/fixtures/products.json', response.body.products);
		})
	}

	get_products_ids() {
		console.log(products)
		products_data = getNotNullItems(this.products_list)
		//** let ids_list = [];
		//** for (let i = 0; i < Object.keys(products_data).length; i++) {
		//** 	let product = Object.keys(products_data)[i]
		//** 	ids_list.push(String(prod[product].id))
		//** }
		return Object.keys(products_data);
	}

	get_products_sum() {
		let prod_arr = Object.values(getNotNullItems(this.products_list))
		const sum = prod_arr.reduce((partialSum, a) => partialSum + a, 0);
		return sum;
	}

	get_checkout_page_link() {
		// Get only not Null products from customize-test.json
		products_data = getNotNullItems(this.products_list)
		//console.log("id", Object.keys(products_data)[0])
		//console.log(products_data)
		let items = "";
		let source = `source=${this.test_params.shop_source}`;

		// Get products ids, names, prices and quantities + 
		for (let i = 0; i < Object.keys(products_data).length; i++) {
			//** let product = Object.keys(products_data)[i]
			let prod_id = Object.keys(products_data)[i];
			let product = products[products.findIndex(item => (item.id == Object.keys(products_data)[i]))]
			let postal_return = product.tags.includes("postal_return");
			//let postal_return = products.filter(item => (item.id == prod_id) && (item.tags.includes("postal_return"))).length > 0;
			
			// Generate checkout link
			//**items += `id${prod[product].id}delivery${prod[product].return ? '2' : '0'}=${Object.values(products_data)[i]}&`
			items += `id${prod_id}delivery${postal_return ? '2' : '0'}=${Object.values(products_data)[i]}&`
		}

		return `https://airportal-staging.dochq.co.uk/rapid-antigen-testing-order?${items + source}`
	}


	get_total_products_price() {
		let total_price = 0;
		for (let i = 0; i < Object.keys(products_data).length; i++) {
			//** let product = Object.keys(products_data)[i];

			let product = products[products.findIndex(item => (item.id == Object.keys(products_data)[i]))]
			console.log("index", product)
			//** let return_price = prod[product].return ? (prod[product].title.length * 10) : 0;

			//** let return_price = prod[product].return ? (prod[product].title.length * 10) : 0;
			let return_price = product.tags.includes("postal_return") ? ((product.type == 'bundle' ? 2 : 1) * 10) : 0;

			//** total_price += (prod[product].price + return_price) * Object.values(products_data)[i];
			total_price += (product.price + return_price) * Object.values(products_data)[i];

		}
		return total_price;
	}


	set_total_number_of_pessengers(pessenger_num) {
		cy.get('input[name="adult_total"]').focus().clear().type(pessenger_num)
	}


	// Random data is generated by default
	fill_account_details(
		email = user.users[user_index].email,
		first_name = user.users[user_index].first_name,
		last_name = user.users[user_index].last_name,
		date_of_birth = user.users[user_index].date_of_birth) {
		cy.get('#first_name').focus().clear().fill(first_name)
		cy.get('#last_name').focus().clear().fill(last_name)
		cy.get('#email').focus().clear().fill(email)
		cy.get('#email_check').focus().clear().fill(email)
		cy.get('input[name="date_of_birth"]').focus().clear().fill(date_of_birth)
	}


	// Random data is generated by default
	fill_shipping_address(
		country_code = user.users[user_index].country_code,
		phone = user.users[user_index].phone,
		postcode = user.users[user_index].address.postcode,
		address_1 = user.users[user_index].address.street,
		city = user.users[user_index].address.city,
		country = user.users[user_index].address.country) {
		cy.get('input[name="SAPostcode"]').clear().fill(postcode)
		cy.get('input[name="SAAddress_1"]').clear().fill(address_1)
		cy.get('input[name="SATown"]').clear().fill(city)
		cy.get('div[name="SACountry"]').find('input').then(($country2) => {
			if ($country2.is(":disabled")) {
				cy.get('input[name="SACounty"]').clear().fill(country)
			} else {
				cy.get('input[name="SACounty"]').clear().fill(country)
				cy.get($country2).clear().focus().type(`${country}{downarrow}{enter}`)
			}
		})
		cy.get('#country-select').clear().type(`${country_code}{enter}`)
		cy.get('input[name="SATelephone"]').clear().fill(phone)
	}


	// Payment section is filled with fake card data
	fill_payment_data() {

		const card_num = "4111111111111111", card_expiry = "12/24", card_cvv = "123"

		cy.get("#payment-iframe").then(($payment) => {
		
			if($payment.find("#braintree-iframe").length > 0) {
				// ------------------------------------  Braintree iframe ------------------------------------------------
				cy.getIframe('#braintree-hosted-field-number').find('input[name="credit-card-number"]').fill(card_num)
				cy.getIframe('#braintree-hosted-field-expirationDate').find('input[name="expiration"]').fill(card_expiry)
				cy.getIframe('#braintree-hosted-field-cvv').find('input[name="cvv"]').fill(card_cvv)

			} else {
				// ------------------------------------- Stripe iframe --------------------------------------------------
				cy.get('iframe')
					.eq(1)
					.iframeLoaded()
					.its('document')
					.getInDocument('input[name="number"]').type(card_num)
			
				cy.get('iframe')
					.eq(1)
					.iframeLoaded()
					.its('document')
					.getInDocument('input[name="expiry"]').type(card_expiry)
			
				cy.get('iframe')
					.eq(1)
					.iframeLoaded()
					.its('document')
					.getInDocument('input[name="cvc"]').type(card_cvv)
			}
			
		})
	}

	// Writing short-token and prosucts names with quantities to 
	// order_list.json file for further use in booking appointment tests.
	write_order_data() {
		let bookable_products = {} //JSON.parse(JSON.stringify(products_data));

		const basket_length = Object.keys(products_data).length;
		for (let i = 0; i < basket_length; i++) {
			let product_object = products[products.findIndex(item => (item.id == Object.keys(products_data)[i]))]
			let product = Object.keys(products_data)[i];
			let type = product_object.type;
			console.log(type)
			switch (type) {
				case "Certificate":
				case "Standalone":
					{
						delete bookable_products[product];
					} break;
				case "Bundle":
					{
						//**let bundle_items = prod[product].items;
						for(let k = 0; k < product_object.bundle_children.length; k++){
							let bundle_item = product_object.bundle_children[k].title
							bookable_products[bundle_item] = Object.values(products_data)[i];
						}
						delete bookable_products[product];
					} break;
				default: bookable_products[product_object.title] = Object.values(products_data)[i];
			}
		}
		console.log(bookable_products)
		cy.get('p > b').then((token) => {
			cy.readFile('cypress/fixtures/order_list.json').then((obj) => {
				obj[token.text()] = bookable_products;
				cy.writeFile('cypress/fixtures/order_list.json', obj);
			})
		})
	}
	write_user_data() {
		cy.writeFile('cypress/fixtures/user.json', user)
	}
}