import { admin_test_data } from '../../fixtures/customize_test.js'
import { companies_json } from '../../support/company_data_generator.js'
import { Chance } from "chance";

const companies = JSON.parse(companies_json);
console.log(companies)
before('Login to the Admin Portal and visit companny creation page', () => {
	const user = 'super_admin'
	cy.visit(`https://admin-staging.dochq.co.uk/user/sign-out`, {
    timeout: 30000
  });
	cy.wait(2000)
	cy.admin_login(admin_test_data[0].admin_email, admin_test_data[0].admin_password)
	cy.visit(`https://admin-staging.dochq.co.uk/organizations/create`)
})

//for (let i = 0; i < companies.length; i++) {
	describe(`Create company ${companies[0].company_name}`, () => {

		it('"Company Profile" check', () => {
			cy.get("#name").focus().clear().fill(companies[0].company_name)
			cy.get('#type-label').click({force: true})

			//cy.findByRole('listbox', {hidden: true}).click().within(() => { 
			//  cy.get('li').contains(companies[0].company_type).click({force: true})
			//})  chance.natural();
			
			cy.get("#registration_number").focus().fill(chance.natural({ min: 6, max: 7 }));
			cy.pause()
			cy.get("#vat_number").focus().fill(chance.natural({ min: 4, max: 5 }));
		})
	
		it('"Main Contact details" check', () => {
			cy.get("#main_contact_email").focus().fill(admin_test_data[0].main_company_email)
			cy.get("#main_contact_first_name").focus().fill(chance.first())
			cy.get("#main_contact_last_name").focus().fill(chance.last())
			cy.get("#main_contact_phone").focus().fill("+380638302847")
		})

		it('"Account Team Contact details" check', () => {
			cy.get("#account_team_contact_email").focus().fill(chance.email())
			cy.get("#account_team_contact_first_name").focus().fill(chance.first())
			cy.get("#account_team_contact_last_name").focus().fill(chance.last())
			cy.get("#account_team_contact_phone").focus().fill(chance.phone({ country: 'uk', mobile: true }))
		})

		it('"Legal Address" check', () => {
			cy.get("#legal_address\\.line_1").focus().fill(chance.address())
			cy.get("#legal_address\\.city").focus().fill(chance.city())
			cy.get('#legal_address\\.county').focus().fill(chance.state({ territories: true, full: true }))
			cy.get("#legal_address\\.postcode").focus().fill(chance.postcode())
			cy.get("#legal_address\\.country").focus().fill(chance.country())
		})

		it('"Correspondence Address" check', () => {
			cy.get("#correspondence_address\\.line_1").focus().fill(chance.address())
			cy.get("#correspondence_address\\.city").focus().fill(chance.city())
			cy.get("#correspondence_address\\.county").focus().fill(chance.state({ territories: true, full: true }))
			cy.get("#correspondence_address\\.postcode").focus().fill(chance.postcode())
			cy.get("#correspondence_address\\.country").focus().fill(chance.country())

		})
	
	})

//}

//  cy.logout()
