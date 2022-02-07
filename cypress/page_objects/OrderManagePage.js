
export default class OrderManagement {

	visit_order_list() {
		// should be logged in as super-admin
		cy.visit('https://myhealth-staging.dochq.co.uk/super_admin/order-list');
	}

	get_order_details({short_id = null, email = null, discount_code = null}) {
		cy.get('#demo-simple-select-label').next().click();

		if(short_id) {
			cy.get('li[data-value="1"]').click();
			cy.get('#standard-basic').fill(short_id);
		}
		if(email) {
			cy.get('li[data-value="2"]').click();
			cy.get('#standard-basic').fill(email);
		}
		if(discount_code) {
			cy.get('li[data-value="3"]').click();
			cy.get('#standard-basic').fill(discount_code);
		}

		cy.get('button').contains('Search').click();

	}


	get_products_data(short_token = this.order_data) {
		let products = {};
		cy.request('GET', `https://api-staging.dochq.co.uk/v1/order/${short_token}`).then( response => {

        	const responseBody = response.body;
			for(let i = 0; i < responseBody.items.length; i++){
				products[responseBody.items[i].product.title] = responseBody.items[i].quantity;
			}
		})
		cy.log(products);
		return products;
	}


}
