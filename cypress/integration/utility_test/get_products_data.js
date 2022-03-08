

describe("Update test data", () => {

	it('Get Fresh products data', () => {
		cy.request('https://api-staging.dochq.co.uk/v1/product?include_inactive=true').then((response) => {
			cy.writeFile('cypress/fixtures/products.json', response.body.products);
		})
	})
})