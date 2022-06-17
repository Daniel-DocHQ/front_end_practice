
import accounts from '../../fixtures/accounts.json'

describe("Login to myhealth dashboard", () => {


	it("check login", () => {
	
		cy.login('super_admin')
	})

	it("check logout", () => {
		cy.logout()
	})

})
