

describe("Login to myhealth dashboard", () => {


	it("check login", () => {
		let email = accounts['super_admin'].email;
		let password = accounts['super_admin'].password;

		cy.login(email, password)
	})

	it("check logout", () => {
		cy.logout()
	})

})
