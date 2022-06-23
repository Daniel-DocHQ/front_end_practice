import { admin_test_data } from '../../fixtures/customize_test.js'


before('Login to the Admin Portal and visit companny creation page', () => {
	const user = 'super_admin'
	cy.visit(`https://admin-staging.dochq.co.uk/user/sign-out`)
	cy.wait(2000)
	cy.admin_login(admin_test_data[0].admin_email, admin_test_data[0].admin_password)
	cy.visit(`https://admin-staging.dochq.co.uk/employees/create`)
})

describe(`Create employee`, () => { //${employees[0].employee_name}
	it('"Employee Profile" check', () => {
		cy.get('#mui-7').click({force: true}).type(`Ukraine{downarrow}{enter}`)
		cy.get('#mui-8').click().type(`Silva Company{downarrow}{enter}`)
		cy.get('label').contains('Location A').within(() => {
			cy.get('input').check()
		})

	})

})