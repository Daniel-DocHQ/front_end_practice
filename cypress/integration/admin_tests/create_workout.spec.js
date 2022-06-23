import { admin_test_data } from '../../fixtures/customize_test.js'
import { Chance } from "chance";

let chance = new Chance(Math.random);

before('Login to the Admin Portal and visit companny creation page', () => {
	cy.visit(`https://admin-staging.dochq.co.uk/user/sign-out`)
	cy.wait(2000)
	cy.admin_login(admin_test_data[0].admin_email, admin_test_data[0].admin_password)
	cy.visit(`https://admin-staging.dochq.co.uk/workouts/create`)
})

describe(`Create workout`, () => { //${employees[0].employee_name}
	const coach_name = chance.name()
	it('Describe workout', () => {
		cy.get("#name")
            .focus()
            .clear()
            .type(`${coach_name} ${chance.word()} Workout`);
		
		cy.get("#coach_name")
            .focus()
            .clear()
            .fill(coach_name);

		cy.get("#description")
            .focus()
            .clear()
            .fill(chance.paragraph({ sentences: 1 }));

			  
			
	})

	it('Add exercises', () => {
		for(let i = 0; i < admin_test_data[0].exercises_num; i++) {
			cy.get("button").contains("Add Exercise").click({ force: true });
			cy.get(`#mui-${i + 2}`).click({ force: true });
			cy.get(`#mui-${i + 2}-option-${i}`).click({ force: true });

			// Add exercises duration
			const durations = ['15', '30', '45', '60', '90', '120']
			const selector = "#exercises\\" + `[${i}` + "\\]\\"
			cy.get(`${selector}.duration`)
                .focus()
                .clear()
                .fill(Math.floor(Math.random() * durations.length));
			// Add exercises repeats
			cy.get(`${selector}.repeats`)
                .focus()
                .clear()
                .fill(Math.floor(Math.random() * 5 + 1));
			// Add exercises resting time
			cy.get(`${selector}.resting_time`)
                .focus()
                .clear()
                .fill(Math.floor(Math.random() * 2 + 1) * 60);
			// Add exercises sets
			cy.get(`${selector}.sets`)
                .focus()
                .clear()
                .fill(Math.floor(Math.random() * 15 + 1));
		}
	})
})