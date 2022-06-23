import { admin_test_data } from '../../fixtures/customize_test.js'


before('Login to the Admin Portal and visit companny creation page', () => {
	const user = 'super_admin'
	cy.visit(`https://admin-staging.dochq.co.uk/user/sign-out`)
	cy.wait(2000)
	cy.admin_login(admin_test_data[0].admin_email, admin_test_data[0].admin_password)
	cy.visit(`https://admin-staging.dochq.co.uk/plans/create`)
})

describe(`Create a plan`, () => { //${employees[0].employee_name}
	it('Plan check', () => {
		cy.get('#type_id').click() 
		cy.get('li').contains('plan type').click() 

		cy.get('#focus_type_ids').click()
		cy.get('li').contains('focus type').click() 
		cy.get('li').contains('aaa').click()
		cy.findByTestId('ArrowDropDownIcon').click()
		cy.get('button').contains('Add Day').click()
	})
})