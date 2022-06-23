import { Chance } from 'chance'
import { admin_test_data } from '../fixtures/customize_test';

const chance = new Chance(Math.random);
const companies_num = admin_test_data.companies_num
const company_types = ['Owner', 'Client', 'Provider']
const company_data_arr = new Array(companies_num).fill().map(function() {
    return {
		// Company Profile
        company_name: chance["company"](),
		company_type: company_types[Math.floor(Math.random() * company_types.length)],
        registration_number: chance["natural"]({ min: 30000, max: 90000 }),
		vat_number: chance["ssn"]({ dashes: false }),

		// Main Contact details
		contact_main: {
            email: chance["email"](),
			first_name: chance["first"](),
            last_name : chance["last"](),
			phone: chance["phone"]({ country: 'uk', mobile: true, formatted: false })
		},

		// Account Team Contact details
		contact_account: {
            email: chance["email"](),
			first_name: chance["first"](),
            last_name : chance["last"](),
			phone: chance["phone"]({ country: 'uk', mobile: true, formatted: false })
		},

		// Legal Address
		 address_leagal: {
            country:  chance["country"]({ full: true }), //or "Ukraine",
            street: chance["address"](),
            city: chance["city"](),
			county: chance["state"]({ territories: true, full: true }),
            postcode: chance["postcode"](), //generate a random U.K. postcode
        },

		// Correspondence Address
		address_coresp: {
            country:  chance["country"]({ full: true }),
            street: chance["address"](),
            city: chance["city"](),
			county: chance["state"]({ territories: true, full: true }),
            postcode: chance["postcode"]()
        }
    };
});

//const fs = require('fs')
let companies_json = JSON.stringify(company_data_arr, null, 2)

module.exports = {companies_json}